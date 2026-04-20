/* ========================================================
   GULF DIAGNOSTIC MEDICAL CENTER — main.js
   Floating nav · Mobile menu · Scrollspy · Scroll reveal
   · Bilingual EN/AR · Reviews marquee · WhatsApp form
   ======================================================== */
(function () {
    'use strict';

    var WA_NUMBER = '971556894193';
    var LANG_KEY = 'gdmc-lang';

    var header = document.getElementById('site-header');
    var navToggle = document.getElementById('nav-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    var langToggle = document.getElementById('lang-toggle');
    var langToggleMobile = document.getElementById('lang-toggle-mobile');

    /* ---------- Floating Island Nav ---------- */
    function onScroll() {
        if (window.scrollY > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile Menu ---------- */
    function setMenu(open) {
        mobileMenu.classList.toggle('active', open);
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
    }
    navToggle.addEventListener('click', function () {
        setMenu(!mobileMenu.classList.contains('active'));
    });

    var overlay = mobileMenu.querySelector('.mobile-menu-overlay');
    if (overlay) overlay.addEventListener('click', function () { setMenu(false); });

    mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900 && mobileMenu.classList.contains('active')) {
            setMenu(false);
        }
    });

    /* ---------- Bilingual EN/AR ---------- */
    var currentLang = localStorage.getItem(LANG_KEY) || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

        var html = document.documentElement;
        html.lang = lang;

        document.querySelectorAll('[data-en][data-ar]').forEach(function (el) {
            var val = el.getAttribute('data-' + lang);
            if (val != null) el.textContent = val;
        });
        document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]').forEach(function (el) {
            var val = el.getAttribute('data-placeholder-' + lang);
            if (val != null) el.placeholder = val;
        });
    }

    if (langToggle) langToggle.addEventListener('click', function () {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });
    if (langToggleMobile) langToggleMobile.addEventListener('click', function () {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });

    if (currentLang !== 'en') setLanguage(currentLang);

    /* ---------- Scrollspy ---------- */
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        var y = window.scrollY + 140;
        var current = '';
        sections.forEach(function (section) {
            if (y >= section.offsetTop) current = section.id;
        });
        navLinks.forEach(function (link) {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + current
            );
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    /* ---------- Scroll Reveal ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Reviews Marquee (duplicate for seamless loop) ---------- */
    var reviewsTrack = document.getElementById('reviews-track');
    if (reviewsTrack) reviewsTrack.innerHTML += reviewsTrack.innerHTML;

    /* ---------- Service Card → pre-select booking service ---------- */
    var serviceMap = {
        'Complete Blood Work':            'blood',
        'Cholesterol & Lipid Profile':    'lipid',
        'Hormone & Thyroid':              'hormone',
        'Diabetes & HbA1c':               'diabetes',
        'General Consultation':           'consultation',
        'Pre-Employment & Wellness':      'screening'
    };

    document.querySelectorAll('.service-card').forEach(function (card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        var handle = function () {
            var name = card.getAttribute('data-service');
            var sel = document.getElementById('service');
            if (sel && serviceMap[name]) sel.value = serviceMap[name];
            var contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        card.addEventListener('click', handle);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handle(); }
        });
    });

    /* ---------- Form → WhatsApp ---------- */
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = (document.getElementById('name').value || '').trim();
            var phone = (document.getElementById('phone').value || '').trim();
            var sel = document.getElementById('service');
            var service = sel && sel.value ? sel.options[sel.selectedIndex].text : '';
            var message = (document.getElementById('message').value || '').trim();

            var lines = ['Hello Gulf Diagnostic Medical Center, I would like to book a test or consultation.'];
            if (name)    lines.push('Name: ' + name);
            if (phone)   lines.push('Phone: ' + phone);
            if (service) lines.push('Service: ' + service);
            if (message) lines.push('Message: ' + message);

            var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }

    /* ---------- Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
