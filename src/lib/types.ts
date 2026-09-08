export type Role = "student" | "vendor" | "admin";
export type Gender = "male" | "female" | "mixed";
export type ListingStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "confirmed" | "rejected";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: Role;
  created_at: string;
};

export type Boarding = {
  id: string;
  vendor_id: string;
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
  status: ListingStatus;
  created_at: string;
};

export type BoardingWithVendor = Boarding & {
  vendor_name: string;
  vendor_phone: string;
  vendor_email: string;
};

export type Booking = {
  id: string;
  boarding_id: string;
  student_id: string;
  move_in_date: string;
  duration_months: number;
  message: string;
  status: BookingStatus;
  created_at: string;
};

export type BookingWithBoarding = Booking & {
  boarding_title: string;
  boarding_area: string;
  boarding_image: string | null;
  boarding_price: number;
};

export type BookingWithStudent = Booking & {
  boarding_title: string;
  boarding_area: string;
  student_name: string;
  student_phone: string;
  student_email: string;
};

export const AREAS = [
  "Puttalam Town",
  "Kalladi",
  "Thillayadi",
  "Palaviya",
  "Sirambiadiya",
  "Nawagaththegama",
  "Anamaduwa",
  "Mundal",
] as const;

export const AMENITIES = [
  "Wi-Fi",
  "Attached bathroom",
  "Study table",
  "Electricity included",
  "Water included",
  "Kitchen access",
  "Meals provided",
  "Parking",
  "A/C",
  "CCTV",
  "Washing machine",
  "Backup power",
] as const;

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "female", label: "Women only" },
  { value: "male", label: "Men only" },
  { value: "mixed", label: "Mixed" },
];

export function genderLabel(g: Gender) {
  return GENDERS.find((x) => x.value === g)?.label ?? g;
}
