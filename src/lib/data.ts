import "server-only";
import { supabaseServer } from "./supabase/server";
import type {
  Boarding,
  BoardingWithVendor,
  BookingStatus,
  BookingWithBoarding,
  BookingWithStudent,
  Gender,
  ListingStatus,
} from "./types";

/**
 * Every database read and write lives here. Pages and server actions never
 * talk to Supabase directly.
 *
 * Row level security does the real enforcement: each call runs as the
 * signed-in person, so a query that asks for more than it should simply comes
 * back empty rather than leaking. The role checks in the server actions are
 * the second lock, not the only one.
 */

const BOARDING_FIELDS =
  "id, vendor_id, title, description, area, address, gender, price_per_month, " +
  "total_rooms, available_rooms, amenities, images, status, created_at";

const VENDOR_EMBED = "profiles!boardings_vendor_id_fkey (full_name, phone, email)";

type VendorEmbed = { full_name: string; phone: string; email: string } | null;

function withVendor(row: Boarding & { profiles: VendorEmbed }): BoardingWithVendor {
  const { profiles, ...boarding } = row;
  return {
    ...boarding,
    vendor_name: profiles?.full_name ?? "",
    vendor_phone: profiles?.phone ?? "",
    vendor_email: profiles?.email ?? "",
  };
}

/** Full boardings sort to the end of every list; nobody wants to click those. */
function freeFirst<T extends { available_rooms: number }>(rows: T[]): T[] {
  return [
    ...rows.filter((r) => r.available_rooms > 0),
    ...rows.filter((r) => r.available_rooms === 0),
  ];
}

/**
 * PostgREST reads `or=(...)` as a comma-separated list, so a search term
 * containing a comma or a full stop would change the meaning of the filter.
 * Quoting the value fixes that; the quote itself is all we have to strip.
 */
function quoted(term: string): string {
  return `"%${term.replace(/["\\]/g, "")}%"`;
}

/* -------------------------------------------------------------- browsing --- */

export type SearchParams = {
  area?: string;
  max?: number;
  min?: number;
  gender?: Gender;
  q?: string;
  sort?: "recent" | "price_asc" | "price_desc";
};

export async function searchBoardings(params: SearchParams = {}): Promise<Boarding[]> {
  const supabase = await supabaseServer();
  let query = supabase.from("boardings").select(BOARDING_FIELDS).eq("status", "approved");

  if (params.area) query = query.eq("area", params.area);
  if (typeof params.max === "number" && Number.isFinite(params.max)) {
    query = query.lte("price_per_month", params.max);
  }
  if (typeof params.min === "number" && Number.isFinite(params.min)) {
    query = query.gte("price_per_month", params.min);
  }
  if (params.gender) query = query.eq("gender", params.gender);
  if (params.q) {
    const t = quoted(params.q);
    query = query.or(
      `title.ilike.${t},description.ilike.${t},area.ilike.${t},address.ilike.${t}`,
    );
  }

  query =
    params.sort === "price_asc"
      ? query.order("price_per_month", { ascending: true })
      : params.sort === "price_desc"
        ? query.order("price_per_month", { ascending: false })
        : query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return freeFirst((data ?? []) as unknown as Boarding[]);
}

export async function getFeaturedBoardings(limit = 6): Promise<Boarding[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .select(BOARDING_FIELDS)
    .eq("status", "approved")
    .gt("available_rooms", 0)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as Boarding[];
}

export async function getBoarding(id: string): Promise<BoardingWithVendor | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .select(`${BOARDING_FIELDS}, ${VENDOR_EMBED}`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return withVendor(data as unknown as Boarding & { profiles: VendorEmbed });
}

/**
 * Postgres has no GROUP BY over PostgREST, and the board is small enough that
 * counting the rows here costs nothing and saves a view.
 */
async function approvedAreaRows(): Promise<{ area: string; available_rooms: number }[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .select("area, available_rooms")
    .eq("status", "approved");
  if (error) throw error;
  return data ?? [];
}

export async function getAreaCounts(): Promise<{ area: string; n: number }[]> {
  const rows = await approvedAreaRows();
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.area, (counts.get(r.area) ?? 0) + 1);
  return [...counts.entries()]
    .map(([area, n]) => ({ area, n }))
    .sort((a, b) => b.n - a.n || a.area.localeCompare(b.area));
}

export async function getAreaBreakdown(): Promise<
  { area: string; listings: number; rooms: number }[]
> {
  const rows = await approvedAreaRows();
  const acc = new Map<string, { listings: number; rooms: number }>();
  for (const r of rows) {
    const cur = acc.get(r.area) ?? { listings: 0, rooms: 0 };
    acc.set(r.area, {
      listings: cur.listings + 1,
      rooms: cur.rooms + r.available_rooms,
    });
  }
  return [...acc.entries()]
    .map(([area, v]) => ({ area, ...v }))
    .sort((a, b) => b.listings - a.listings || a.area.localeCompare(b.area));
}

export type BoardStats = {
  listings: number;
  rooms_available: number;
  median_price: number;
  min_price: number;
  max_price: number;
};

/** Public counts for the home page. Reads boardings only, so anyone can see it. */
export async function getBoardStats(): Promise<BoardStats> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .select("price_per_month, available_rooms")
    .eq("status", "approved")
    .order("price_per_month", { ascending: true });
  if (error) throw error;

  const rows = data ?? [];
  const prices = rows.map((r) => r.price_per_month);
  return {
    listings: rows.length,
    rooms_available: rows.reduce((n, r) => n + r.available_rooms, 0),
    median_price: prices.length ? prices[Math.floor((prices.length - 1) / 2)] : 0,
    min_price: prices[0] ?? 0,
    max_price: prices.at(-1) ?? 0,
  };
}

/* -------------------------------------------------------- vendor listings --- */

export async function getVendorBoardings(vendorId: string): Promise<Boarding[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .select(BOARDING_FIELDS)
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Boarding[];
}

export type BoardingInput = {
  title: string;
  description: string;
  area: string;
  address: string;
  gender: Gender;
  price_per_month: number;
  total_rooms: number;
  available_rooms: number;
  amenities: string[];
  images: string[];
};

export async function createBoarding(
  vendorId: string,
  input: BoardingInput,
): Promise<string> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .insert({ ...input, vendor_id: vendorId, status: "pending" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

/** A rejected listing goes back into the queue when its owner edits it. */
export async function updateBoarding(
  id: string,
  vendorId: string,
  input: BoardingInput,
  currentStatus: ListingStatus,
): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .update({
      ...input,
      status: currentStatus === "rejected" ? "pending" : currentStatus,
    })
    .eq("id", id)
    .eq("vendor_id", vendorId)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function deleteBoarding(id: string, vendorId: string): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .delete()
    .eq("id", id)
    .eq("vendor_id", vendorId)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}

/* ---------------------------------------------------------------- admin --- */

export async function getBoardingsByStatus(
  status: ListingStatus,
): Promise<BoardingWithVendor[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .select(`${BOARDING_FIELDS}, ${VENDOR_EMBED}`)
    .eq("status", status)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as (Boarding & { profiles: VendorEmbed })[]).map(
    withVendor,
  );
}

export async function setBoardingStatus(
  id: string,
  status: ListingStatus,
): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("boardings")
    .update({ status })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}

export type AdminStats = BoardStats & {
  students: number;
  vendors: number;
  pending_listings: number;
  bookings: number;
  pending_bookings: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await supabaseServer();

  const countOf = async (
    table: "profiles" | "boardings" | "bookings",
    column?: string,
    value?: string,
  ) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (column && value) q = q.eq(column, value);
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  };

  const [board, students, vendors, pendingListings, bookings, pendingBookings] =
    await Promise.all([
      getBoardStats(),
      countOf("profiles", "role", "student"),
      countOf("profiles", "role", "vendor"),
      countOf("boardings", "status", "pending"),
      countOf("bookings"),
      countOf("bookings", "status", "pending"),
    ]);

  return {
    ...board,
    students,
    vendors,
    pending_listings: pendingListings,
    bookings,
    pending_bookings: pendingBookings,
  };
}

/* -------------------------------------------------------------- bookings --- */

export async function createBooking(input: {
  boarding_id: string;
  student_id: string;
  move_in_date: string;
  duration_months: number;
  message: string;
}): Promise<string> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("bookings")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function hasOpenRequest(
  boardingId: string,
  studentId: string,
): Promise<boolean> {
  const supabase = await supabaseServer();
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("boarding_id", boardingId)
    .eq("student_id", studentId)
    .eq("status", "pending");
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function getStudentBookings(
  studentId: string,
): Promise<BookingWithBoarding[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, boardings (title, area, price_per_month, images)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  type Row = BookingWithBoarding & {
    boardings: {
      title: string;
      area: string;
      price_per_month: number;
      images: string[];
    } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => {
    const { boardings, ...booking } = r;
    return {
      ...booking,
      boarding_title: boardings?.title ?? "",
      boarding_area: boardings?.area ?? "",
      boarding_price: boardings?.price_per_month ?? 0,
      boarding_image: boardings?.images?.[0] ?? null,
    };
  });
}

const PENDING_FIRST = { pending: 0, confirmed: 1, rejected: 2 } as const;

export async function getVendorBookings(
  vendorId: string,
): Promise<BookingWithStudent[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, boardings!inner (title, area, vendor_id), " +
        "profiles!bookings_student_id_fkey (full_name, phone, email)",
    )
    .eq("boardings.vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  type Row = BookingWithStudent & {
    boardings: { title: string; area: string } | null;
    profiles: { full_name: string; phone: string; email: string } | null;
  };

  return ((data ?? []) as unknown as Row[])
    .map((r) => {
      const { boardings, profiles, ...booking } = r;
      return {
        ...booking,
        boarding_title: boardings?.title ?? "",
        boarding_area: boardings?.area ?? "",
        student_name: profiles?.full_name ?? "",
        student_phone: profiles?.phone ?? "",
        student_email: profiles?.email ?? "",
      };
    })
    .sort((a, b) => PENDING_FIRST[a.status] - PENDING_FIRST[b.status]);
}

/**
 * Confirming goes through confirm_booking() so the room comes off the board in
 * the same transaction - two clicks on the last room cannot both win. The
 * function returns null on success or the message to show the owner.
 */
export async function decideBooking(
  bookingId: string,
  vendorId: string,
  status: Exclude<BookingStatus, "pending">,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await supabaseServer();

  if (status === "confirmed") {
    const { data, error } = await supabase.rpc("confirm_booking", {
      booking: bookingId,
    });
    if (error) return { ok: false, error: error.message };
    return data ? { ok: false, error: data as string } : { ok: true };
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "rejected" })
    .eq("id", bookingId)
    .eq("status", "pending")
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!(data ?? []).length) {
    return { ok: false, error: "That request has already been answered." };
  }
  return { ok: true };
}

export async function cancelBooking(
  bookingId: string,
  studentId: string,
): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("student_id", studentId)
    .eq("status", "pending")
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}
