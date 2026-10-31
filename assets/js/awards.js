// Meliantes Awards: login com Discord, votação e resultados (Supabase)

const cfg = window.AWARDS_CONFIG || {};
const isConfigured = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && !cfg.supabaseUrl.includes('SEU-PROJETO'));
const sb = isConfigured && window.supabase
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { flowType: 'pkce' } })
    : null;

const state = {
    currentYear: cfg.anoAtual,
    selectedYear: cfg.anoAtual,
    loading: Boolean(sb),
    error: null,
    user: null,
    edition: null,      // { year, status } ou null se não existir
    categories: [],     // [{ id, name, nominees: [{ id, name, img }] }]
    myVotes: {},        // { [category_id]: nominee_id }
    results: {}         // { [nominee_id]: votos } quando encerrada
};

const app = document.getElementById('awards-app');
const tabs = document.getElementById('year-tabs');

// ---------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function formatPercent(value) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
}

function plural(n, singular, pluralForm) {
    return `${n} ${n === 1 ? singular : pluralForm}`;
}

let toastTimer;
function toast(message, kind = 'ok') {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl border transition duration-300 ${kind === 'erro' ? 'bg-rose-950 border-rose-500/50 text-rose-200' : 'bg-neutral-950 border-gold-500/50 text-gold-400'}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('opacity-0', 'pointer-events-none'), 2600);
}

function nomineeAvatar(nominee, size = 'w-10 h-10') {
    // Lista de imagens (ex.: casal) vira avatares sobrepostos
    if (Array.isArray(nominee.img)) {
        return `<span class="flex -space-x-3 flex-shrink-0">${nominee.img.map(src => nomineeAvatar({ name: nominee.name, img: src }, size)).join('')}</span>`;
    }
    if (nominee.img) {
        return `<img src="${escapeHTML(nominee.img)}" alt="" loading="lazy" class="${size} rounded-xl object-cover border border-neutral-700 flex-shrink-0" onerror="this.onerror=null;this.src='assets/logo.jpg'">`;
    }
    const initials = String(nominee.name).split(/\s*&\s*|\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
    return `<span class="${size} rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 font-epic font-bold text-sm flex items-center justify-center flex-shrink-0">${escapeHTML(initials)}</span>`;
}

function categoryCard(title, body, badge = '') {
    return `
        <article class="rounded-3xl border border-gold-500/25 bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-black p-6 space-y-5">
            <header class="flex items-start justify-between gap-3">
                <h3 class="text-lg sm:text-xl font-extrabold text-white font-epic leading-snug">${escapeHTML(title)}</h3>
                ${badge}
            </header>
            ${body}
        </article>`;
}

// Lista com barras de porcentagem; usada para a edição atual encerrada e para anos passados
function resultsList(rows) {
    const total = rows.reduce((sum, r) => sum + r.votes, 0);
    if (!rows.length) return '<p class="text-sm text-neutral-500">Sem indicados nesta categoria.</p>';
    const max = Math.max(...rows.map(r => r.votes));
    const sorted = [...rows].sort((a, b) => b.votes - a.votes);
    const items = sorted.map(r => {
        const pct = total ? (r.votes / total) * 100 : 0;
        const isWinner = total > 0 && r.votes === max;
        return `
            <li class="space-y-2">
                <div class="flex items-center gap-3">
                    ${nomineeAvatar(r)}
                    <span class="flex-1 min-w-0 truncate font-semibold ${isWinner ? 'text-gold-400' : 'text-neutral-200'}">${isWinner ? '<span aria-label="Vencedor">👑</span> ' : ''}${escapeHTML(r.name)}</span>
                    <span class="text-xs text-neutral-400 whitespace-nowrap"><strong class="text-white text-sm">${formatPercent(pct)}</strong> · ${plural(r.votes, 'voto', 'votos')}</span>
                </div>
                <div class="h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div class="h-full rounded-full ${isWinner ? 'bg-gradient-to-r from-gold-600 to-gold-400' : 'bg-neutral-600'}" style="width: ${pct}%"></div>
                </div>
            </li>`;
    }).join('');
    return `<ul class="space-y-4">${items}</ul><p class="text-[11px] uppercase tracking-widest text-neutral-500">Total: ${plural(total, 'voto', 'votos')}</p>`;
}

// Destaque para categorias de anos passados em que só se sabe o vencedor
function winnerOnly(winner) {
    return `
        <div class="flex items-center gap-4 rounded-2xl border border-gold-400/60 bg-gold-500/10 p-4 gold-glow-sm">
            ${nomineeAvatar({ name: winner.nome, img: winner.img }, 'w-14 h-14')}
            <div class="min-w-0">
                <span class="text-[10px] uppercase tracking-widest text-gold-500 font-extrabold">👑 Vencedor</span>
                <p class="text-lg font-bold text-gold-400 leading-snug break-words">${escapeHTML(winner.nome)}</p>
                ${winner.detalhe ? `<p class="text-xs text-neutral-400">${escapeHTML(winner.detalhe)}</p>` : ''}
            </div>
        </div>`;
}

// Card especial para a categoria principal (ex.: Melhor Meliante do ano)
function legendCard(category) {
    const winners = [].concat(category.vencedores || category.vencedor);
    const people = winners.map(w => {
        const initials = String(w.nome).split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
        const photo = w.img
            ? `<img src="${escapeHTML(w.img)}" alt="Foto de ${escapeHTML(w.nome)}" class="w-full h-full object-cover rounded-[22px]" onerror="this.onerror=null;this.src='assets/logo.jpg'">`
            : `<span class="w-full h-full rounded-[22px] bg-black flex items-center justify-center text-4xl font-epic font-bold text-gold-400">${escapeHTML(initials)}</span>`;
        return `
            <div class="flex flex-col items-center space-y-5">
                <div class="relative pt-8">
                    <span class="legend-crown absolute top-0 left-1/2 text-5xl" aria-hidden="true">👑</span>
                    <div class="legend-avatar w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-[3px] bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-100">${photo}</div>
                </div>
                <p class="text-4xl sm:text-6xl font-extrabold font-epic text-gold-gradient leading-tight break-words">${escapeHTML(w.nome)}</p>
            </div>`;
    }).join('');
    return `
        <article class="award-legend">
            <div class="award-legend-inner px-6 py-12 sm:py-16 text-center space-y-8">
                <div class="space-y-4">
                    <span class="inline-block text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.4em] text-gold-400 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/40 gold-glow-sm">★ Prêmio máximo ★</span>
                    <h3 class="text-2xl sm:text-4xl font-extrabold uppercase text-white font-epic tracking-wider">${escapeHTML(category.categoria)}</h3>
                </div>
                <div class="flex flex-wrap justify-center gap-12">${people}</div>
                <p class="text-[11px] uppercase tracking-[0.35em] text-neutral-400">O grande vencedor da edição</p>
            </div>
        </article>`;
}

// ---------------------------------------------------------------------
// Dados (Supabase)
// ---------------------------------------------------------------------
async function loadEdition() {
    const { data: edition, error } = await sb.from('editions').select('year, status').eq('year', state.currentYear).maybeSingle();
    if (error) throw error;
    state.edition = edition;
    if (!edition) return;

    const { data: categories, error: catError } = await sb
        .from('categories')
        .select('id, name, position, nominees(id, name, img)')
        .eq('year', edition.year)
        .order('position')
        .order('id', { referencedTable: 'nominees' });
    if (catError) throw catError;
    state.categories = categories;

    state.results = {};
    if (edition.status === 'encerrada') {
        const { data: rows, error: resError } = await sb.rpc('results', { p_year: edition.year });
        if (resError) throw resError;
        rows.forEach(r => { state.results[r.nominee_id] = Number(r.votes); });
    }
}

async function loadMyVotes() {
    state.myVotes = {};
    if (!state.user || !state.edition) return;
    const { data, error } = await sb.from('votes').select('category_id, nominee_id');
    if (error) throw error;
    data.forEach(v => { state.myVotes[v.category_id] = v.nominee_id; });
}

async function vote(categoryId, nomineeId) {
    if (!state.user) return toast('Entre com o Discord para votar.', 'erro');
    if (state.edition?.status !== 'aberta') return;
    if (state.myVotes[categoryId] === nomineeId) return;

    const previous = state.myVotes[categoryId];
    state.myVotes[categoryId] = nomineeId;
    render();

    const { error } = await sb.from('votes').upsert(
        { user_id: state.user.id, category_id: categoryId, nominee_id: nomineeId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,category_id' }
    );
    if (error) {
        if (previous === undefined) delete state.myVotes[categoryId];
        else state.myVotes[categoryId] = previous;
        render();
        return toast('Não foi possível registrar o voto. Tente de novo.', 'erro');
    }
    toast(previous === undefined ? 'Voto registrado!' : 'Voto alterado!');
}

function login() {
    const redirectTo = window.location.origin + window.location.pathname;
    sb.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo } })
        .then(({ error }) => { if (error) toast('Não foi possível entrar com o Discord.', 'erro'); });
}

async function logout() {
    await sb.auth.signOut();
}

// ---------------------------------------------------------------------
// Renderização
// ---------------------------------------------------------------------
function renderTabs() {
    const years = [...new Set([...Object.keys(awardsHistorico).map(Number), state.currentYear])].sort((a, b) => a - b);
    tabs.innerHTML = years.map(year => {
        const active = year === state.selectedYear;
        return `<button type="button" data-year="${year}" aria-pressed="${active}" class="px-5 py-2.5 rounded-xl text-sm font-bold font-epic tracking-wider border transition ${active ? 'bg-gold-500 text-black border-gold-500 gold-glow-sm' : 'bg-neutral-950 text-neutral-300 border-gold-500/25 hover:border-gold-500/60 hover:text-gold-400'}">${year}${year === state.currentYear ? ' <span class="text-[10px] uppercase tracking-widest opacity-70">atual</span>' : ''}</button>`;
    }).join('');
}

function statusBadge(status) {
    if (status === 'aberta') return '<span class="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Votação aberta</span>';
    if (status === 'encerrada') return '<span class="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400">Encerrada</span>';
    return '<span class="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400">Em breve</span>';
}

function authWidget() {
    if (!sb) return '';
    if (!state.user) {
        return `
            <button type="button" data-login class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm transition hover:scale-105">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                Entrar com Discord
            </button>`;
    }
    const meta = state.user.user_metadata || {};
    const name = meta.custom_claims?.global_name || meta.full_name || meta.name || 'Meliante';
    const avatar = meta.avatar_url
        ? `<img src="${escapeHTML(meta.avatar_url)}" alt="" class="w-10 h-10 rounded-xl border border-gold-500/40 object-cover">`
        : nomineeAvatar({ name });
    return `
        <div class="flex items-center gap-3">
            ${avatar}
            <div class="flex flex-col text-left">
                <span class="text-[10px] uppercase tracking-widest text-neutral-500">Logado como</span>
                <span class="text-sm font-semibold text-white">${escapeHTML(name)}</span>
            </div>
            <button type="button" data-logout class="ml-2 text-xs text-neutral-400 hover:text-rose-400 underline underline-offset-4">Sair</button>
        </div>`;
}

function statusPanel() {
    const ed = state.edition;
    let description;
    if (!sb) description = 'A votação desta edição ainda não foi configurada. Volte em breve!';
    else if (!ed) description = `A edição de ${state.currentYear} ainda não foi criada. Volte em breve!`;
    else if (ed.status === 'rascunho') description = 'Os indicados estão sendo definidos. A votação abre em breve, fique de olho no Discord!';
    else if (ed.status === 'aberta') description = state.user ? 'Escolha um indicado em cada categoria. Você pode trocar seu voto até a votação encerrar.' : 'Entre com sua conta do Discord para votar. Os resultados aparecem quando a votação encerrar.';
    else description = 'A votação foi encerrada. Confira quem levou cada título!';

    const total = state.categories.length;
    const voted = state.categories.filter(c => state.myVotes[c.id] !== undefined).length;
    const progress = ed?.status === 'aberta' && state.user && total
        ? `
            <div class="space-y-2 pt-2">
                <div class="flex justify-between text-xs text-neutral-400"><span>Seu progresso</span><span><strong class="text-gold-400">${voted}</strong> de ${total} categorias</span></div>
                <div class="h-2 rounded-full bg-neutral-800 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500" style="width: ${(voted / total) * 100}%"></div></div>
            </div>`
        : '';

    return `
        <div class="rounded-3xl border border-gold-500/30 bg-neutral-950/80 p-6 sm:p-8 gold-glow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div class="space-y-2">
                    <div class="flex items-center gap-3 flex-wrap">
                        <h2 class="text-2xl font-extrabold text-white font-epic">Edição ${state.currentYear}</h2>
                        ${statusBadge(ed?.status)}
                    </div>
                    <p class="text-sm text-neutral-400 max-w-xl">${description}</p>
                </div>
                ${ed && ed.status !== 'encerrada' ? authWidget() : ''}
            </div>
            ${progress}
        </div>`;
}

function votingCategory(category) {
    const isOpen = state.edition.status === 'aberta';
    const chosen = state.myVotes[category.id];
    const badge = chosen !== undefined ? '<span class="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 whitespace-nowrap">✓ Votado</span>' : '';
    if (!category.nominees.length) return categoryCard(category.name, '<p class="text-sm text-neutral-500">Indicados em breve.</p>');

    const options = category.nominees.map(n => {
        const selected = chosen === n.id;
        return `
            <button type="button" ${isOpen ? `data-vote="${category.id}:${n.id}"` : 'disabled'} aria-pressed="${selected}"
                class="w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${selected ? 'border-gold-400 bg-gold-500/10 gold-glow-sm' : 'border-neutral-800 bg-black/40'} ${isOpen ? 'hover:border-gold-500/60 hover:bg-gold-500/5 cursor-pointer' : 'cursor-default opacity-80'}">
                ${nomineeAvatar(n)}
                <span class="flex-1 min-w-0 truncate font-semibold ${selected ? 'text-gold-400' : 'text-neutral-200'}">${escapeHTML(n.name)}</span>
                <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-gold-400 bg-gold-400' : 'border-neutral-600'}">
                    ${selected ? '<svg class="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"/></svg>' : ''}
                </span>
            </button>`;
    }).join('');
    return categoryCard(category.name, `<div class="space-y-2">${options}</div>`, badge);
}

function renderCurrent() {
    if (state.loading) {
        return '<div class="py-24 text-center text-neutral-500 text-sm uppercase tracking-widest animate-pulse">Carregando votação...</div>';
    }
    if (state.error) {
        return `${statusPanel()}<p class="text-center text-sm text-rose-400">Não foi possível carregar a votação agora. Tente recarregar a página.</p>`;
    }
    let cards = '';
    if (state.edition) {
        cards = state.categories.map(c => state.edition.status === 'encerrada'
            ? categoryCard(c.name, resultsList(c.nominees.map(n => ({ ...n, votes: state.results[n.id] || 0 }))))
            : votingCategory(c)
        ).join('');
    }
    return `${statusPanel()}${cards ? `<div class="flex flex-col gap-6">${cards}</div>` : ''}`;
}

function renderPast(year) {
    const categories = awardsHistorico[year] || [];
    const header = `
        <div class="rounded-3xl border border-gold-500/30 bg-neutral-950/80 p-6 sm:p-8 gold-glow-sm space-y-2">
            <div class="flex items-center gap-3 flex-wrap">
                <h2 class="text-2xl font-extrabold text-white font-epic">Edição ${year}</h2>
                ${statusBadge('encerrada')}
            </div>
            <p class="text-sm text-neutral-400">Resultados da votação realizada no Discord.</p>
        </div>`;
    if (!categories.length) {
        return `${header}<p class="text-center text-sm text-neutral-500 py-12">Os resultados de ${year} ainda não foram adicionados.</p>`;
    }
    const cards = categories.map(c => c.destaque ? legendCard(c) : categoryCard(c.categoria, (c.vencedores || c.vencedor)
        ? `<div class="space-y-3">${[].concat(c.vencedores || c.vencedor).map(winnerOnly).join('')}</div>`
        : resultsList((c.resultados || []).map(r => ({ name: r.nome, votes: Number(r.votos) || 0, img: r.img })))
    )).join('');
    return `${header}<div class="flex flex-col gap-6">${cards}</div>`;
}

function render() {
    renderTabs();
    app.innerHTML = state.selectedYear === state.currentYear ? renderCurrent() : renderPast(state.selectedYear);
}

// ---------------------------------------------------------------------
// Eventos e inicialização
// ---------------------------------------------------------------------
document.addEventListener('click', event => {
    const yearBtn = event.target.closest('[data-year]');
    if (yearBtn) {
        state.selectedYear = Number(yearBtn.dataset.year);
        return render();
    }
    const voteBtn = event.target.closest('[data-vote]');
    if (voteBtn) {
        const [categoryId, nomineeId] = voteBtn.dataset.vote.split(':').map(Number);
        return vote(categoryId, nomineeId);
    }
    if (event.target.closest('[data-login]')) return login();
    if (event.target.closest('[data-logout]')) return logout();
});

async function init() {
    render();
    if (!sb) return;
    try {
        const { data: { session } } = await sb.auth.getSession();
        state.user = session?.user ?? null;
        await loadEdition();
        await loadMyVotes();
    } catch (err) {
        console.error(err);
        state.error = err;
    }
    state.loading = false;
    render();

    sb.auth.onAuthStateChange((_event, session) => {
        const userId = session?.user?.id ?? null;
        if (userId === (state.user?.id ?? null)) return;
        state.user = session?.user ?? null;
        // Fora do callback, como recomenda o Supabase
        setTimeout(async () => {
            try { await loadMyVotes(); } catch (err) { console.error(err); }
            render();
        }, 0);
    });
}

init();
