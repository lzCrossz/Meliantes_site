// Comportamentos compartilhados: menu mobile, revelar ao rolar e intro da página inicial

function setupMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (!menu) return;
    // Fecha o menu ao escolher um link (importante para âncoras na mesma página)
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => menu.removeAttribute('open'));
    });
    document.addEventListener('click', event => {
        if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') menu.removeAttribute('open');
    });
}

function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        // Elementos que entram juntos aparecem um após o outro
        entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
            entry.target.style.transitionDelay = (index * 120) + 'ms';
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -15% 0px' });
    items.forEach(el => observer.observe(el));
}

function runIntro(onDone) {
    const root = document.documentElement;
    const overlay = document.getElementById('intro-overlay');
    if (!overlay || !root.classList.contains('intro')) return onDone();

    const logo = document.getElementById('intro-logo');
    const curtainLeft = document.getElementById('curtain-left');
    const curtainRight = document.getElementById('curtain-right');
    setTimeout(() => {
        logo.classList.add('opacity-0', 'scale-110');
        curtainLeft.style.transform = 'translateX(-100%)';
        curtainRight.style.transform = 'translateX(100%)';
        setTimeout(onDone, 300);
        setTimeout(() => root.classList.remove('intro'), 800);
    }, 350);
}

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    runIntro(setupReveal);
});
