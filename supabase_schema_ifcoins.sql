
-- ===============================================================
-- IFCOINS GAME SCHOOL: SCHEMA MIGRATION SCRIPT
-- Projetado para Supabase (PostgreSQL 15+)
-- Executar no painel SQL do projeto qeiubvtitwvpcxzovdcu.supabase.co
-- ===============================================================

------------------------------------------------------------------
-- 1) TABELA DE PERFIS (vinculada ao auth.users)
------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (role in ('estudante', 'professor', 'admin')),
  coins integer not null default 0,
  created_at timestamp with time zone default current_timestamp
);

alter table profiles enable row level security;

create policy "Profiles: apenas dono lê seu perfil"
on profiles for select
using (auth.uid() = id);

create policy "Profiles: apenas dono insere seu perfil"
on profiles for insert
with check (auth.uid() = id);

create policy "Profiles: atualizar apenas próprio perfil (opcional)"
on profiles for update
using (auth.uid() = id);

------------------------------------------------------------------
-- 2) TABELA DE CARDS (catálogo de cartas)
------------------------------------------------------------------
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  rarity text check (rarity in ('common','uncommon','rare','legendary')),
  cost integer not null default 0,
  created_at timestamp with time zone default current_timestamp
);

alter table cards enable row level security;

-- Qualquer usuário autenticado pode ler as cartas
create policy "Cards: leitura pública autenticada"
on cards for select
using (auth.role() = 'authenticated');

-- Somente admins podem inserir/alterar cartas
create policy "Cards: apenas admin insere"
on cards for insert
with check ( ( select role from profiles where id = auth.uid() ) = 'admin');

create policy "Cards: apenas admin altera"
on cards for update
using ( ( select role from profiles where id = auth.uid() ) = 'admin');

------------------------------------------------------------------
-- 3) TABELA DE USER_CARDS (coleção de cartas de cada usuário)
------------------------------------------------------------------
create table if not exists user_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  quantity integer not null default 1,
  acquired_at timestamp with time zone default current_timestamp
);

alter table user_cards enable row level security;

create policy "UserCards: usuário vê suas cartas"
on user_cards for select
using (auth.uid() = user_id);

create policy "UserCards: usuário recebe suas cartas"
on user_cards for insert
with check (auth.uid() = user_id);

------------------------------------------------------------------
-- 4) TABELA DE EVENTS (tarefas, desafios ou missões)
------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points integer not null default 0,
  start_date date,
  end_date date,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default current_timestamp
);

alter table events enable row level security;

create policy "Events: leitura pública autenticada"
on events for select
using (auth.role() = 'authenticated');

create policy "Events: apenas professores/admin inserem"
on events for insert
with check ( ( select role from profiles where id = auth.uid() ) in ('professor', 'admin') );

create policy "Events: apenas criador ou admin altera"
on events for update
using ( auth.uid() = created_by or ( select role from profiles where id = auth.uid() ) = 'admin' );

------------------------------------------------------------------
-- 5) TABELA DE REWARD_LOGS (histórico de moedas concedidas)
------------------------------------------------------------------
create table if not exists reward_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount integer not null,
  reason text,
  issued_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default current_timestamp
);

alter table reward_logs enable row level security;

create policy "RewardLogs: usuário vê seus logs"
on reward_logs for select
using (auth.uid() = user_id);

create policy "RewardLogs: professores/admin inserem"
on reward_logs for insert
with check ( ( select role from profiles where id = auth.uid() ) in ('professor','admin') );

------------------------------------------------------------------
-- 6) VIEW DE RANKING (pontuação total por usuário)
------------------------------------------------------------------
create or replace view rankings as
select
  p.id,
  p.name,
  p.role,
  p.coins +
    coalesce((select sum(amount) from reward_logs rl where rl.user_id = p.id), 0) as total_coins
from profiles p;
