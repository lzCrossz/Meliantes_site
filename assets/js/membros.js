// Monta os cards de membros a partir de communityData (membros-data.js)

const FALLBACK_IMG = 'assets/logo.jpg';

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function infoRow(label, labelColor, img, imgClass, text) {
    return `
        <div class="flex items-center space-x-3">
            <div class="${imgClass} bg-neutral-800 overflow-hidden border border-neutral-700 flex-shrink-0">
                <img src="${escapeHTML(img || FALLBACK_IMG)}" alt="" width="28" height="28" loading="lazy" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
            </div>
            <div class="flex flex-col">
                <span class="text-[9px] font-extrabold uppercase ${labelColor} tracking-widest">${label}</span>
                <span class="text-neutral-200 font-medium">${escapeHTML(text)}</span>
            </div>
        </div>`;
}

function renderMembers() {
    ['conselho', 'geral', 'banidos'].forEach(section => {
        const container = document.getElementById('container-' + section);
        if (!container) return;
        container.innerHTML = '';

        communityData[section].forEach(member => {
            const isBanished = section === 'banidos';
            const isCouncil = section === 'conselho';
            const cardColors = isBanished ? 'border-rose-500/40 hover:border-rose-500 bg-gradient-to-b from-neutral-950 via-rose-950/20 to-black hover:shadow-[0_0_35px_rgba(244,63,94,0.3)]' : 'border-gold-500/30 hover:border-gold-500 bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-black hover:shadow-[0_0_35px_rgba(250,204,21,0.25)]';
            const badgeColor = isBanished ? 'text-rose-400' : 'text-gold-400';
            const labelColor = isBanished ? 'text-rose-400' : 'text-gold-500';
            const tipBorder = isBanished ? 'border-rose-500/40' : 'border-gold-500/40';
            const imageBorderGradient = isBanished ? 'bg-gradient-to-tr from-rose-600 via-red-500 to-rose-200' : 'bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-100';

            let rows = '';
            if (isCouncil) rows += infoRow('Região', labelColor, member.flag, 'w-7 h-5 rounded-[3px]', member.region || 'Não informada');
            rows += infoRow('Origem', labelColor, member.origin_img, 'w-7 h-7 rounded-[4px]', member.origin || 'Lords');
            if (isCouncil) rows += infoRow('Jogo Favorito', labelColor, member.cover, 'w-7 h-7 rounded-[4px]', member.game || 'Não informado');

            const card = document.createElement('div');
            card.className = `member-card border ${cardColors} rounded-3xl p-7 flex flex-col items-center text-center space-y-5 card-epic-effect relative`;
            card.tabIndex = 0;
            card.innerHTML = `
                <div class="member-tip ${isCouncil ? '' : 'is-compact'} bg-neutral-950/95 backdrop-blur-md border ${tipBorder} rounded-2xl p-3.5 shadow-2xl">
                    <div class="member-tip-arrow absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-950 border-b border-r ${tipBorder} rotate-45"></div>
                    <div class="relative z-10 flex flex-col space-y-3 text-xs text-left">${rows}</div>
                </div>
                <div class="relative mt-2">
                    <div class="w-24 h-24 rounded-2xl ${imageBorderGradient} p-[2px] overflow-hidden gold-glow-sm">
                        <div class="w-full h-full bg-black rounded-[14px] overflow-hidden flex items-center justify-center">
                            <img src="${escapeHTML(member.img || FALLBACK_IMG)}" alt="Foto de ${escapeHTML(member.name)}" width="96" height="96" loading="lazy" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
                        </div>
                    </div>
                </div>
                <div class="w-full space-y-2">
                    <h3 class="w-full text-center text-xl font-extrabold text-white font-epic break-words">${escapeHTML(member.name)}</h3>
                    <p class="w-full text-center text-xs ${badgeColor} font-bold uppercase tracking-[0.15em] break-words">${escapeHTML(member.discord)}</p>
                </div>`;
            container.appendChild(card);
        });
    });
}

renderMembers();
