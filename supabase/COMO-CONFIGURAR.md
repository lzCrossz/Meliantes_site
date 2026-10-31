# Meliantes Awards — como configurar

Passo a passo para colocar a votação no ar. Só precisa fazer uma vez.

## 1. Criar o projeto no Supabase
1. Entre em [supabase.com](https://supabase.com) e crie um projeto (o plano gratuito basta).
2. No projeto, abra **SQL Editor**, cole todo o conteúdo de [`awards.sql`](awards.sql) e clique em **Run**.
   Isso cria as tabelas, as regras de segurança, a edição de 2026 e as 13 categorias.

## 2. Criar o app no Discord
1. Abra o [Discord Developer Portal](https://discord.com/developers/applications) → **New Application** (ex.: "Meliantes Awards").
2. Vá em **OAuth2** e copie o **Client ID** e o **Client Secret** (clique em "Reset Secret" se precisar).
3. Ainda em **OAuth2 → Redirects**, adicione:
   `https://SEU-PROJETO.supabase.co/auth/v1/callback`
   (troque `SEU-PROJETO` pelo endereço do seu projeto; ele aparece em Supabase → Project Settings → API).

## 3. Ligar o login do Discord no Supabase
1. Supabase → **Authentication → Sign In / Providers → Discord** → ative.
2. Cole o **Client ID** e o **Client Secret** do passo anterior e salve.
3. Supabase → **Authentication → URL Configuration**:
   - **Site URL:** `https://lzcrossz.github.io/Meliantes_site/`
   - **Redirect URLs:** adicione `https://lzcrossz.github.io/Meliantes_site/awards.html`
     (e, se quiser testar no computador, `http://localhost:8765/awards.html`).

## 4. Conectar o site
Abra [`assets/js/awards-config.js`](../assets/js/awards-config.js) e troque:
- `supabaseUrl` pelo **Project URL**
- `supabaseAnonKey` pela chave **anon public**

As duas ficam em Supabase → **Project Settings → API**. A chave *anon* é pública, pode ir para o GitHub.
**Nunca** coloque a chave `service_role` no site.

## 5. Cadastrar os indicados
Supabase → **Table Editor → nominees → Insert row**:
- `category_id`: o número da categoria (veja na tabela `categories`)
- `name`: nome do indicado (para casal/dupla, algo como `Fulano & Ciclano`)
- `img` (opcional): foto do site, ex.: `assets/gica.jpg`

Também dá para cadastrar vários de uma vez pelo SQL Editor — tem um exemplo no fim do `awards.sql`.

## 6. Abrir e encerrar a votação
No **Table Editor → editions**, mude o `status` da edição:
- `rascunho` → aparece "Em breve" e os indicados sem poder votar
- `aberta` → todo mundo pode logar com o Discord e votar (e trocar o voto)
- `encerrada` → a votação fecha e o site mostra porcentagens, votos e vencedores

## Próximos anos
Rode no SQL Editor (trocando o ano), cadastre os indicados e mude `anoAtual` em `awards-config.js`:

```sql
insert into public.editions (year, status) values (2027, 'rascunho');
insert into public.categories (year, name, position) values
    (2027, 'Mais provável de ir preso', 1);
    -- ...demais categorias
```

Depois de encerrar um ano, se quiser, copie os resultados para
[`assets/js/awards-historico.js`](../assets/js/awards-historico.js) para eles ficarem nas abas de anos passados.

## Anos passados (2024 e 2025)
Ficam em [`assets/js/awards-historico.js`](../assets/js/awards-historico.js), sem precisar do Supabase.
Basta preencher cada categoria com os nomes e a quantidade de votos.
