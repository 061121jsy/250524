create table if not exists public.readings (
  id text primary key,
  kind text not null check (kind in ('tarot', 'saju', 'fortune')),
  user_id text,
  saved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  request jsonb not null default '{}'::jsonb,
  response jsonb not null default '{}'::jsonb,
  provider text not null default 'fallback',
  model text not null default '',
  usage jsonb,
  error text
);

create index if not exists readings_kind_user_created_at_idx
  on public.readings (kind, user_id, created_at desc);

create index if not exists readings_user_created_at_idx
  on public.readings (user_id, created_at desc);

create index if not exists readings_saved_idx
  on public.readings (saved);

alter table public.readings enable row level security;
