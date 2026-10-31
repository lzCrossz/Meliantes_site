-- =====================================================================
-- Meliantes Awards — estrutura do banco no Supabase
-- Cole tudo no SQL Editor do Supabase e clique em "Run".
-- =====================================================================

-- Edições (uma por ano). status: 'rascunho' -> 'aberta' -> 'encerrada'
create table public.editions (
    year   int primary key,
    status text not null default 'rascunho' check (status in ('rascunho', 'aberta', 'encerrada'))
);

-- Categorias de cada edição
create table public.categories (
    id       bigint generated always as identity primary key,
    year     int not null references public.editions(year) on delete cascade,
    name     text not null,
    position int not null default 0
);

-- Indicados de cada categoria (para casal/dupla, use o nome do par, ex.: "Fulano & Ciclano")
create table public.nominees (
    id          bigint generated always as identity primary key,
    category_id bigint not null references public.categories(id) on delete cascade,
    name        text not null,
    img         text  -- opcional, ex.: 'assets/gica.jpg'
);

-- Votos: um por pessoa em cada categoria (trocar o voto substitui o anterior)
create table public.votes (
    user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
    category_id bigint not null references public.categories(id) on delete cascade,
    nominee_id  bigint not null references public.nominees(id) on delete cascade,
    updated_at  timestamptz not null default now(),
    primary key (user_id, category_id)
);

create index on public.categories (year);
create index on public.nominees (category_id);
create index on public.votes (nominee_id);

-- ---------------------------------------------------------------------
-- Segurança (Row Level Security)
-- ---------------------------------------------------------------------
alter table public.editions   enable row level security;
alter table public.categories enable row level security;
alter table public.nominees   enable row level security;
alter table public.votes      enable row level security;

-- Edições, categorias e indicados: qualquer um pode ler
create policy "leitura pública" on public.editions   for select using (true);
create policy "leitura pública" on public.categories for select using (true);
create policy "leitura pública" on public.nominees   for select using (true);

-- O voto só vale se o indicado pertence à categoria e a edição está aberta
create function public.vote_is_valid(p_category bigint, p_nominee bigint)
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (
        select 1
        from nominees n
        join categories c on c.id = n.category_id
        join editions e on e.year = c.year
        where n.id = p_nominee
          and c.id = p_category
          and e.status = 'aberta'
    );
$$;

-- Cada pessoa vê apenas os próprios votos (ninguém vê em quem o outro votou)
create policy "ver os próprios votos" on public.votes
    for select to authenticated
    using (user_id = auth.uid());

create policy "votar" on public.votes
    for insert to authenticated
    with check (user_id = auth.uid() and public.vote_is_valid(category_id, nominee_id));

create policy "trocar o voto" on public.votes
    for update to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid() and public.vote_is_valid(category_id, nominee_id));

-- ---------------------------------------------------------------------
-- Resultados: contagem de votos, liberada só quando a edição está encerrada
-- ---------------------------------------------------------------------
create function public.results(p_year int)
returns table (category_id bigint, nominee_id bigint, votes bigint)
language sql stable security definer
set search_path = public
as $$
    select c.id, n.id, count(v.user_id)
    from categories c
    join editions e on e.year = c.year and e.status = 'encerrada'
    join nominees n on n.category_id = c.id
    left join votes v on v.nominee_id = n.id and v.category_id = c.id
    where c.year = p_year
    group by c.id, n.id;
$$;

grant execute on function public.results(int) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Edição de 2026 com as categorias (começa como 'rascunho')
-- ---------------------------------------------------------------------
insert into public.editions (year, status) values (2026, 'rascunho');

insert into public.categories (year, name, position) values
    (2026, 'Mais provável de ir preso', 1),
    (2026, 'Mais provável de morrer', 2),
    (2026, 'Mais provável de ter filho', 3),
    (2026, 'Mais provável de ficar rico', 4),
    (2026, 'Mais burro', 5),
    (2026, 'Mais inteligente', 6),
    (2026, 'Mais machista', 7),
    (2026, 'Mais preconceituoso', 8),
    (2026, 'Melhor jogador', 9),
    (2026, 'Pior jogador', 10),
    (2026, 'Mais estressado(a)', 11),
    (2026, 'Melhor casal', 12),
    (2026, 'Melhor dupla', 13);

-- Exemplo de como cadastrar indicados (troque os nomes e rode quando quiser):
-- insert into public.nominees (category_id, name, img) values
--     ((select id from public.categories where year = 2026 and name = 'Melhor jogador'), 'Gusttxxx', 'assets/gusttxxx.jpg'),
--     ((select id from public.categories where year = 2026 and name = 'Melhor jogador'), 'JUAN', 'assets/juan.jpg'),
--     ((select id from public.categories where year = 2026 and name = 'Melhor casal'), 'Fulano & Ciclano', null);
