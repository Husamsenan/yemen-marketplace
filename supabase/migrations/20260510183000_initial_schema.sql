create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  icon text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  phone text unique,
  email text unique,
  city_id uuid references public.cities(id) on delete set null,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  verified boolean not null default false,
  blocked boolean not null default false,
  language text not null default 'ar' check (language in ('ar', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  city_id uuid not null references public.cities(id),
  title text not null check (char_length(title) between 3 and 140),
  title_en text,
  description text not null check (char_length(description) between 10 and 4000),
  price numeric(14,2),
  currency text not null default 'YER',
  district text,
  lat double precision,
  lng double precision,
  condition text check (condition in ('new', 'used', 'refurbished') or condition is null),
  status text not null default 'pending' check (status in ('draft', 'pending', 'active', 'sold', 'rejected', 'removed')),
  premium_until timestamptz,
  view_count int not null default 0,
  whatsapp text,
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(title_en, '') || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  width int,
  height int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversations_not_self check (buyer_id <> seller_id),
  unique (listing_id, buyer_id, seller_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text check (body is null or char_length(body) <= 2000),
  image_url text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint messages_have_content check (body is not null or image_url is not null)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  moderator_id uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.premium_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  plan text not null check (plan in ('premium_7', 'premium_14', 'premium_30', 'shop_monthly')),
  amount numeric(14,2) not null,
  currency text not null default 'YER',
  provider text,
  provider_reference text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('android', 'ios', 'web')),
  token text not null,
  created_at timestamptz not null default now(),
  unique (platform, token)
);

create table if not exists public.seller_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  document_path text,
  notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cities_active_sort_idx on public.cities (active, sort_order);
create index if not exists categories_active_sort_idx on public.categories (active, sort_order);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists listings_feed_idx on public.listings (status, city_id, category_id, created_at desc);
create index if not exists listings_premium_idx on public.listings (premium_until desc nulls last, created_at desc);
create index if not exists listings_search_idx on public.listings using gin (search_vector);
create index if not exists listings_title_trgm_idx on public.listings using gin (title gin_trgm_ops);
create index if not exists listing_images_listing_idx on public.listing_images (listing_id, sort_order);
create index if not exists favorites_user_idx on public.favorites (user_id, created_at desc);
create index if not exists conversations_buyer_idx on public.conversations (buyer_id, last_message_at desc);
create index if not exists conversations_seller_idx on public.conversations (seller_id, last_message_at desc);
create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists reports_status_idx on public.reports (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin_or_moderator()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_user_role() in ('admin', 'moderator'), false)
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    new.phone,
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_conversation_last_message()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
after insert on public.messages
for each row execute function public.touch_conversation_last_message();

create or replace function public.increment_listing_views(listing_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings
  set view_count = view_count + 1
  where id = listing_id and status = 'active';
$$;

alter table public.cities enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.premium_orders enable row level security;
alter table public.device_tokens enable row level security;
alter table public.seller_verifications enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Public can read active cities" on public.cities;
create policy "Public can read active cities" on public.cities
for select using (active = true);

drop policy if exists "Admins manage cities" on public.cities;
create policy "Admins manage cities" on public.cities
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories
for select using (active = true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Users read public profile fields" on public.profiles;
create policy "Users read public profile fields" on public.profiles
for select using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
for update using (id = auth.uid())
with check (id = auth.uid() and role = public.current_user_role());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Public can read active listings" on public.listings;
create policy "Public can read active listings" on public.listings
for select using (status = 'active' or seller_id = auth.uid() or public.is_admin_or_moderator());

drop policy if exists "Users create own listings" on public.listings;
create policy "Users create own listings" on public.listings
for insert with check (seller_id = auth.uid());

drop policy if exists "Users update own listings" on public.listings;
create policy "Users update own listings" on public.listings
for update using (seller_id = auth.uid())
with check (seller_id = auth.uid());

drop policy if exists "Moderators manage listings" on public.listings;
create policy "Moderators manage listings" on public.listings
for all using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

drop policy if exists "Public can read active listing images" on public.listing_images;
create policy "Public can read active listing images" on public.listing_images
for select using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and (listings.status = 'active' or listings.seller_id = auth.uid() or public.is_admin_or_moderator())
  )
);

drop policy if exists "Sellers manage own listing images" on public.listing_images;
create policy "Sellers manage own listing images" on public.listing_images
for all using (
  exists (select 1 from public.listings where listings.id = listing_images.listing_id and listings.seller_id = auth.uid())
)
with check (
  exists (select 1 from public.listings where listings.id = listing_images.listing_id and listings.seller_id = auth.uid())
);

drop policy if exists "Users manage own favorites" on public.favorites;
create policy "Users manage own favorites" on public.favorites
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Participants read conversations" on public.conversations;
create policy "Participants read conversations" on public.conversations
for select using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin_or_moderator());

drop policy if exists "Users create own conversations" on public.conversations;
create policy "Users create own conversations" on public.conversations
for insert with check (buyer_id = auth.uid() or seller_id = auth.uid());

drop policy if exists "Participants read messages" on public.messages;
create policy "Participants read messages" on public.messages
for select using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid() or public.is_admin_or_moderator())
  )
);

drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages" on public.messages
for insert with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
  )
);

drop policy if exists "Users create reports" on public.reports;
create policy "Users create reports" on public.reports
for insert with check (reporter_id = auth.uid());

drop policy if exists "Users read own reports" on public.reports;
create policy "Users read own reports" on public.reports
for select using (reporter_id = auth.uid() or public.is_admin_or_moderator());

drop policy if exists "Moderators manage reports" on public.reports;
create policy "Moderators manage reports" on public.reports
for update using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

drop policy if exists "Users manage own premium orders" on public.premium_orders;
create policy "Users manage own premium orders" on public.premium_orders
for all using (user_id = auth.uid() or public.is_admin_or_moderator())
with check (user_id = auth.uid() or public.is_admin_or_moderator());

drop policy if exists "Users manage own device tokens" on public.device_tokens;
create policy "Users manage own device tokens" on public.device_tokens
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users create own verification requests" on public.seller_verifications;
create policy "Users create own verification requests" on public.seller_verifications
for insert with check (user_id = auth.uid());

drop policy if exists "Users read own verification requests" on public.seller_verifications;
create policy "Users read own verification requests" on public.seller_verifications
for select using (user_id = auth.uid() or public.is_admin_or_moderator());

drop policy if exists "Moderators manage verification requests" on public.seller_verifications;
create policy "Moderators manage verification requests" on public.seller_verifications
for update using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

drop policy if exists "Admins read audit logs" on public.audit_logs;
create policy "Admins read audit logs" on public.audit_logs
for select using (public.current_user_role() = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('listing-images', 'listing-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('verification-docs', 'verification-docs', false, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read listing images" on storage.objects;
create policy "Public read listing images" on storage.objects
for select using (bucket_id in ('listing-images', 'avatars'));

drop policy if exists "Authenticated users upload listing images" on storage.objects;
create policy "Authenticated users upload listing images" on storage.objects
for insert to authenticated
with check (bucket_id in ('listing-images', 'avatars') and owner = auth.uid());

drop policy if exists "Owners update own public images" on storage.objects;
create policy "Owners update own public images" on storage.objects
for update to authenticated
using (bucket_id in ('listing-images', 'avatars') and owner = auth.uid())
with check (bucket_id in ('listing-images', 'avatars') and owner = auth.uid());

drop policy if exists "Owners delete own public images" on storage.objects;
create policy "Owners delete own public images" on storage.objects
for delete to authenticated
using (bucket_id in ('listing-images', 'avatars') and owner = auth.uid());

drop policy if exists "Private verification docs" on storage.objects;
create policy "Private verification docs" on storage.objects
for all to authenticated
using (bucket_id = 'verification-docs' and (owner = auth.uid() or public.is_admin_or_moderator()))
with check (bucket_id = 'verification-docs' and owner = auth.uid());

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'conversations'
  ) then
    alter publication supabase_realtime add table public.conversations;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reports'
  ) then
    alter publication supabase_realtime add table public.reports;
  end if;
end $$;
