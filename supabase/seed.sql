insert into public.cities (slug, name_ar, name_en, sort_order) values
  ('sanaa', 'صنعاء', 'Sanaa', 10),
  ('aden', 'عدن', 'Aden', 20),
  ('taiz', 'تعز', 'Taiz', 30),
  ('hodeidah', 'الحديدة', 'Hodeidah', 40),
  ('ibb', 'إب', 'Ibb', 50),
  ('hadramout', 'حضرموت', 'Hadramout', 60),
  ('mukalla', 'المكلا', 'Mukalla', 70),
  ('dhamar', 'ذمار', 'Dhamar', 80)
on conflict (slug) do update
set name_ar = excluded.name_ar,
    name_en = excluded.name_en,
    sort_order = excluded.sort_order;

insert into public.categories (slug, name_ar, name_en, icon, sort_order) values
  ('cars', 'سيارات', 'Cars', 'car', 10),
  ('real-estate', 'عقارات', 'Real Estate', 'home', 20),
  ('phones', 'هواتف', 'Phones', 'phone', 30),
  ('electronics', 'إلكترونيات', 'Electronics', 'devices', 40),
  ('jobs', 'وظائف', 'Jobs', 'briefcase', 50),
  ('furniture', 'أثاث', 'Furniture', 'chair', 60),
  ('solar', 'طاقة شمسية', 'Solar Products', 'sun', 70),
  ('services', 'خدمات', 'Services', 'tools', 80)
on conflict (slug) do update
set name_ar = excluded.name_ar,
    name_en = excluded.name_en,
    icon = excluded.icon,
    sort_order = excluded.sort_order;
