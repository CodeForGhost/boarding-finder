-- BoardingPx - demo seed data
-- Run supabase/schema.sql first, then create the demo accounts (see README),
-- then run this. Rows are matched to accounts by email, so the auth users must
-- exist before this runs.

do $$
declare
  u_admin uuid;
  u_student uuid;
  u_student2 uuid;
  u_student3 uuid;
  u_vendor uuid;
  u_vendor2 uuid;
  u_vendor3 uuid;
  u_vendor4 uuid;
begin

  select id into u_admin from auth.users where email = 'admin@demo.lk';
  if u_admin is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'admin@demo.lk';
  end if;
  update public.profiles set full_name = 'Fathima Rizna', phone = '032 226 5501', role = 'admin' where id = u_admin;

  select id into u_student from auth.users where email = 'student@demo.lk';
  if u_student is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'student@demo.lk';
  end if;
  update public.profiles set full_name = 'Ashan Fernando', phone = '070 221 6648', role = 'student' where id = u_student;

  select id into u_student2 from auth.users where email = 'nuha@demo.lk';
  if u_student2 is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'nuha@demo.lk';
  end if;
  update public.profiles set full_name = 'Nuha Rifkhan', phone = '075 664 2210', role = 'student' where id = u_student2;

  select id into u_student3 from auth.users where email = 'tharindu@demo.lk';
  if u_student3 is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'tharindu@demo.lk';
  end if;
  update public.profiles set full_name = 'Tharindu Silva', phone = '071 448 9903', role = 'student' where id = u_student3;

  select id into u_vendor from auth.users where email = 'vendor@demo.lk';
  if u_vendor is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'vendor@demo.lk';
  end if;
  update public.profiles set full_name = 'M. Nizam', phone = '077 415 2280', role = 'vendor' where id = u_vendor;

  select id into u_vendor2 from auth.users where email = 'sithara@demo.lk';
  if u_vendor2 is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'sithara@demo.lk';
  end if;
  update public.profiles set full_name = 'Sithara Perera', phone = '071 908 3341', role = 'vendor' where id = u_vendor2;

  select id into u_vendor3 from auth.users where email = 'jaleel@demo.lk';
  if u_vendor3 is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'jaleel@demo.lk';
  end if;
  update public.profiles set full_name = 'A. Jaleel', phone = '076 332 7719', role = 'vendor' where id = u_vendor3;

  select id into u_vendor4 from auth.users where email = 'kumari@demo.lk';
  if u_vendor4 is null then
    raise exception 'Create the auth user % before seeding (see supabase/README.md)', 'kumari@demo.lk';
  end if;
  update public.profiles set full_name = 'R. Kumari', phone = '078 550 1094', role = 'vendor' where id = u_vendor4;

  delete from public.bookings where boarding_id in (select id from public.boardings where vendor_id in (
    u_vendor, u_vendor2, u_vendor3, u_vendor4));
  delete from public.boardings where vendor_id in (
    u_vendor, u_vendor2, u_vendor3, u_vendor4);

  insert into public.boardings
    (id, vendor_id, title, description, area, address, gender, price_per_month,
     total_rooms, available_rooms, amenities, images, status, created_at)
  values
    ('00000000-0000-4000-8000-000000000001', u_vendor, 'Annexe near Puttalam bus stand', 'Two rooms on the upper floor with a separate entrance from Kurunegala Road. Five minutes on foot to the main bus stand, so you can be in Kalladi or Palaviya without waiting for a connection. Tube well water and a 24-hour tank, so the dry-season cuts do not reach the tap.', 'Puttalam Town',
     '142/3 Kurunegala Road, Puttalam', 'male', 6500, 4, 2,
     array['Wi-Fi', 'Attached bathroom', 'Study table', 'Water included', 'Parking', 'CCTV']::text[], array['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '34 days'),
    ('00000000-0000-4000-8000-000000000002', u_vendor, 'Women''s boarding at Kalladi Junction', 'Ground-floor rooms in a family home, women only. The owner''s family lives in the front section and the gate is locked at 9.30pm. Rice and curry twice a day is included; tell the owner a day ahead if you will miss a meal.', 'Kalladi',
     '27 Beach Road, Kalladi', 'female', 7200, 6, 1,
     array['Meals provided', 'Wi-Fi', 'Attached bathroom', 'Study table', 'Electricity included', 'CCTV']::text[], array['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '41 days'),
    ('00000000-0000-4000-8000-000000000003', u_vendor2, 'Budget single rooms, Thillayadi', 'Plain single rooms in a row house behind the Thillayadi mosque. Shared bathroom, shared kitchen, no frills. This is the cheapest thing on the road and it fills up in the first week of every term.', 'Thillayadi',
     'Lane 4, Mosque Road, Thillayadi', 'male', 3500, 8, 5,
     array['Kitchen access', 'Water included', 'Parking']::text[], array['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '58 days'),
    ('00000000-0000-4000-8000-000000000004', u_vendor3, 'New upstairs rooms, Palaviya', 'Built last year, so the wiring and plumbing are new. Each room takes two students with separate study tables and its own bathroom. Backup power covers the whole floor during the evening cuts.', 'Palaviya',
     '88 Puttalam-Colombo Road, Palaviya', 'male', 8000, 5, 3,
     array['Wi-Fi', 'A/C', 'Attached bathroom', 'Study table', 'Backup power', 'Parking', 'CCTV']::text[], array['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '12 days'),
    ('00000000-0000-4000-8000-000000000005', u_vendor2, 'Quiet room in a family house, Sirambiadiya', 'One room in a family house on a lane off the main road, suitable for a student who wants to study without noise. Breakfast included. No visitors after 8pm.', 'Sirambiadiya',
     'Nelum Mawatha, Sirambiadiya', 'female', 5500, 2, 2,
     array['Meals provided', 'Wi-Fi', 'Study table', 'Water included', 'Electricity included']::text[], array['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '20 days'),
    ('00000000-0000-4000-8000-000000000006', u_vendor4, 'Shared boarding for four, Nawagaththegama', 'Two rooms sleeping two each, plus a common area with a table big enough to work at. Well water in the garden and a washing machine you can use twice a week. Bicycle parking under the porch.', 'Nawagaththegama',
     'Wewa Road, Nawagaththegama', 'female', 4200, 4, 4,
     array['Kitchen access', 'Washing machine', 'Parking', 'Water included', 'Study table']::text[], array['https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '47 days'),
    ('00000000-0000-4000-8000-000000000007', u_vendor, 'Single room with attached bath, Puttalam Town', 'One room, one student, own bathroom, own key. The house is on a quiet lane two turns off Kandy Road. Electricity is metered separately and billed at the end of the month.', 'Puttalam Town',
     '5/1 Sanasa Lane, Puttalam', 'male', 6000, 3, 1,
     array['Attached bathroom', 'Wi-Fi', 'Study table', 'Parking', 'Water included']::text[], array['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '63 days'),
    ('00000000-0000-4000-8000-000000000008', u_vendor3, 'Women''s hostel wing, Kalladi', 'A six-room wing run as a small hostel with a warden who lives on site. Rooms are shared two to a room. The study hall stays open until 11pm and there is a common kitchen for tea and snacks.', 'Kalladi',
     '12 Lagoon View Road, Kalladi', 'female', 6800, 6, 2,
     array['Wi-Fi', 'Study table', 'Kitchen access', 'CCTV', 'Backup power', 'Electricity included']::text[], array['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '29 days'),
    ('00000000-0000-4000-8000-000000000009', u_vendor4, 'Two-room annexe with kitchen, Anamaduwa', 'Self-contained annexe with its own kitchen, good for two or three students who want to cook. Gas cooker and fridge are provided. The bus to Puttalam passes the top of the lane every twenty minutes.', 'Anamaduwa',
     'Hospital Road, Anamaduwa', 'male', 5000, 2, 1,
     array['Kitchen access', 'Attached bathroom', 'Parking', 'Water included', 'Study table']::text[], array['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '51 days'),
    ('00000000-0000-4000-8000-000000000010', u_vendor2, 'Rooms above the shop, Mundal', 'Three rooms above a grocery on the Mundal main road. Noisy until the shop closes at 8pm, quiet after that, and the price reflects it. The lagoon is a ten-minute walk if you want somewhere to sit in the evening.', 'Mundal',
     'Main Street, Mundal', 'male', 3800, 3, 3,
     array['Water included', 'Parking', 'Kitchen access']::text[], array['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '15 days'),
    ('00000000-0000-4000-8000-000000000011', u_vendor, 'A/C room for two, Puttalam Town', 'The most comfortable room on this list and priced that way. Air conditioning, hot water, a proper desk each, and fibre internet that holds up for online classes. Suits two students splitting the rent.', 'Puttalam Town',
     '31 Anuradhapura Road, Puttalam', 'female', 8500, 2, 1,
     array['A/C', 'Wi-Fi', 'Attached bathroom', 'Study table', 'Backup power', 'Washing machine', 'CCTV', 'Parking']::text[], array['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '8 days'),
    ('00000000-0000-4000-8000-000000000012', u_vendor3, 'Women''s boarding with meals, Palaviya', 'Four rooms, two students each, three meals a day cooked in the house. The owner has run this boarding for eleven years and most students come through older sisters who stayed here before.', 'Palaviya',
     'Church Road, Palaviya', 'female', 7500, 4, 2,
     array['Meals provided', 'Wi-Fi', 'Study table', 'Electricity included', 'Water included', 'CCTV']::text[], array['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '37 days'),
    ('00000000-0000-4000-8000-000000000013', u_vendor4, 'Shared room, Thillayadi', 'Four beds in one room, shared bathroom outside. Bring your own mattress or rent one from the owner for Rs 300 a month. Honest about what it is: a bed and a fan for people who are out all day.', 'Thillayadi',
     'Sea Street, Thillayadi', 'male', 3600, 4, 2,
     array['Water included', 'Parking']::text[], array['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '44 days'),
    ('00000000-0000-4000-8000-000000000014', u_vendor2, 'Annexe near Kalladi beach', 'One-bedroom annexe with a small veranda facing the coconut garden. Five minutes to the beach road. Best for a final-year student who wants to be left alone.', 'Kalladi',
     'Coconut Garden Lane, Kalladi', 'male', 6200, 1, 0,
     array['Attached bathroom', 'Kitchen access', 'Wi-Fi', 'Parking', 'Water included']::text[], array['https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=70']::text[], 'approved', now() - interval '26 days'),
    ('00000000-0000-4000-8000-000000000015', u_vendor3, 'New boarding house, Sirambiadiya', 'Six rooms just finished, taking bookings for the new term. Attached bathrooms, tiled floors, and a covered park for motorbikes. Photos are from the final week of construction.', 'Sirambiadiya',
     'School Lane, Sirambiadiya', 'female', 5800, 6, 6,
     array['Attached bathroom', 'Wi-Fi', 'Study table', 'Parking', 'Backup power']::text[], array['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=70', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=70']::text[], 'pending', now() - interval '2 days'),
    ('00000000-0000-4000-8000-000000000016', u_vendor4, 'Room to let, Nawagaththegama', 'Single room in a house near the tank. Quiet, cheap, and a long way from everything, which is the trade-off.', 'Nawagaththegama',
     'Tank Road, Nawagaththegama', 'female', 4000, 2, 2,
     array['Water included', 'Kitchen access', 'Study table']::text[], array['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=70']::text[], 'pending', now() - interval '1 days'),
    ('00000000-0000-4000-8000-000000000017', u_vendor, 'Upstairs rooms at Mundal Junction', 'Two rooms upstairs at the junction, walking distance to the bus halt. Taking students from the start of next month.', 'Mundal',
     'Junction Road, Mundal', 'male', 4500, 2, 2,
     array['Parking', 'Water included', 'Wi-Fi']::text[], array['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=70']::text[], 'pending', now() - interval '1 days')
  ;

  insert into public.bookings
    (boarding_id, student_id, move_in_date, duration_months, message, status, created_at)
  values
    ('00000000-0000-4000-8000-000000000002', u_student2, current_date + interval '9 days',
     12, 'I am starting my HND in January and need a place with meals. Can I see the room this Saturday morning?', 'pending', now() - interval '2 days'),
    ('00000000-0000-4000-8000-000000000001', u_student3, current_date + interval '16 days',
     6, 'Two of us are looking together. Is the upstairs room still free?', 'pending', now() - interval '1 days'),
    ('00000000-0000-4000-8000-000000000007', u_student, current_date - interval '21 days',
     6, 'I work at the co-op in the evenings so I would come in late some days. Is that alright?', 'confirmed', now() - interval '28 days'),
    ('00000000-0000-4000-8000-000000000011', u_student, current_date + interval '12 days',
     12, 'Looking to share the A/C room with a classmate. Would you take the rent from us separately?', 'pending', now() - interval '3 days'),
    ('00000000-0000-4000-8000-000000000014', u_student, current_date - interval '5 days',
     3, 'Is the annexe free from the first of next month?', 'rejected', now() - interval '11 days'),
    ('00000000-0000-4000-8000-000000000008', u_student2, current_date - interval '40 days',
     12, 'My sister stayed here in 2023. I would like the same wing if possible.', 'confirmed', now() - interval '52 days'),
    ('00000000-0000-4000-8000-000000000004', u_student3, current_date + interval '5 days',
     9, 'Do you have space for a motorbike?', 'pending', now() - interval '4 days')
  ;

end $$;
