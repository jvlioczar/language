(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle  = document.getElementById('langToggle');
  const libFilter   = document.getElementById('libFilter');
  const curators    = document.getElementById('curators');
  const libGrid     = document.querySelector('.lib-grid');

  // ===== Dictionaries (preserved) =====
  const I18N = {
    pt: {
      'meta.description': 'BiblioVerse — A Biblioteca de Tudo. Portal central para acessar as bibliotecas temáticas e conhecer o projeto e seus curadores.',
      'brand.name': 'BiblioVerse',
      'footer.lead': '<strong class="proj-name">BiblioVerse</strong> é um projeto colaborativo para organizar e facilitar o acesso a bibliotecas úteis em diferentes temas.',
      'brand.beta': 'BETA',
      'brand.byline.prefix': 'A biblioteca de tudo',
      'hero.logoAlt': 'Logo do BiblioVerse',
      'section.libs.aria': 'Acesso rápido às bibliotecas',
      'libs.design': 'Biblioteca de Design (em construção)',
      'libs.design.short': 'Design',
      'libs.language': 'Biblioteca de Estudo de Idiomas (em construção)',
      'libs.language.short': 'Idiomas',
      'libs.games': 'Biblioteca de Games (em construção)',
      'libs.games.short': 'Games',
      'libs.ai': 'Biblioteca de IAs',
      'libs.ai.short': 'IA',
      'libs.music': 'Biblioteca de Música (em construção)',
      'libs.music.short': 'Música',
      'libs.coding': 'Biblioteca de Programação (em construção)',
      'libs.coding.short': 'Programação',
      'libs.social': 'Biblioteca de Redes Sociais',
      'libs.social.short': 'Redes Sociais',
      'section.about.aria': 'Sobre o projeto',
      'section.about.title': 'Sobre o BiblioVerse',
      'section.about.p1': 'O BiblioVerse é um hub de bibliotecas temáticas com curadoria humana. A missão é simples: <em>acesso rápido, claro e verificado</em> ao melhor conteúdo, em uma interface mínima e veloz. Código aberto, espírito colaborativo.',
      'section.about.p2': 'Foco em três pilares: utilidade, transparência e performance. Se um link não ajuda, ele não entra. Se ajuda, entra polido — com contexto, ícone e tradução quando couber.',
      'section.curators.aria': 'Curadores',
      'section.curators.title': 'Curadores',
      'section.curators.filterLabel': 'Filtrar por biblioteca',
      'section.curators.all': 'Todas as bibliotecas',
      'curators.julio.desc': 'Designer e idealizador do BiblioVerse. Curadoria nas bibliotecas de IA e Design.',
      'curators.roney.desc': 'Revisor do projeto e curador na biblioteca de IA.',
      'curators.ellie.desc': 'Curadoria e testes da biblioteca de Idiomas.',
      'curators.diego.desc': 'Designer e pesquisador. Curadoria em Design e Música.',
      'curators.sungmin.desc': 'Dev front-end e curador em Programação e Games.',
      'curators.ellison.desc': 'Pesquisador de plataformas. Curadoria em Redes Sociais.',
      'curators.aline.desc': 'Curadora na biblioteca de Idiomas.',
      'curators.andreza.desc': 'Curadora na biblioteca de Redes Sociais.',
      'curators.taina.desc': 'Curadora na biblioteca de Design.',
      'curators.henrique.desc': 'Curador na biblioteca de Games.',
      'links.linkedin': 'LinkedIn',
      'links.instagram': 'Instagram',
      'footer.count': 'Portal central do <strong class="proj-name">BiblioVerse</strong> — Última atualização: Setembro/2025',
      'footer.thanks': 'Obrigado pela visita!',
      'actions.share': 'Compartilhar',
      'actions.toTop': 'Voltar ao topo',
      'meta.last': 'Última'
    },
    en: {
      'meta.description': 'BiblioVerse — The Library of Everything. Central portal to access themed libraries and meet the project and its curators.',
      'brand.name': 'BiblioVerse',
      'footer.lead': '<strong class="proj-name">BiblioVerse</strong> is a collaborative project to organize and facilitate access to useful libraries across different topics.',
      'brand.beta': 'BETA',
      'brand.byline.prefix': 'The library of everything',
      'brand.byline.suffix': '',
      'hero.logoAlt': 'BiblioVerse logo',
      'section.libs.aria': 'Quick access to libraries',
      'libs.design': 'Design Library (under construction)',
      'libs.design.short': 'Design',
      'libs.language': 'Language Study Library (under construction)',
      'libs.language.short': 'Languages',
      'libs.games': 'Games Library (under construction)',
      'libs.games.short': 'Games',
      'libs.ai': 'AI Library',
      'libs.ai.short': 'AI',
      'libs.music': 'Music Library (under construction)',
      'libs.music.short': 'Music',
      'libs.coding': 'Programming Library (under construction)',
      'libs.coding.short': 'Programming',
      'libs.social': 'Social Media Library',
      'libs.social.short': 'Social',
      'section.about.aria': 'About the project',
      'section.about.title': 'About BiblioVerse',
      'section.about.p1': 'BiblioVerse is a hub of themed libraries curated by humans. The mission is simple: <em>fast, clear, verified access</em> to the best content, in a minimal and fast interface. Open-source, collaborative spirit.',
      'section.about.p2': 'We focus on three pillars: usefulness, transparency, and performance. If a link doesn’t help, it’s out. If it helps, it comes polished — with context, icon and translation when relevant.',
      'section.curators.aria': 'Curators',
      'section.curators.title': 'Curators',
      'section.curators.filterLabel': 'Filter by library',
      'section.curators.all': 'All libraries',
      'curators.julio.desc': 'Designer and creator of BiblioVerse. Curates the AI and Design libraries.',
      'curators.roney.desc': 'Project reviewer and curator in the AI library.',
      'curators.ellie.desc': 'Curation and testing in the Language library.',
      'curators.diego.desc': 'Designer and researcher. Curates Design and Music.',
      'curators.sungmin.desc': 'Front-end developer; curates Programming and Games.',
      'curators.ellison.desc': 'Platform researcher. Curates Social Networks.',
      'curators.aline.desc': 'Curator in the Languages library.',
      'curators.andreza.desc': 'Curator in the Social Networks library.',
      'curators.taina.desc': 'Curator in the Design library.',
      'curators.henrique.desc': 'Curator in the Games library.',
      'links.linkedin': 'LinkedIn',
      'links.instagram': 'Instagram',
      'footer.count': 'Central hub of <strong class="proj-name">BiblioVerse</strong> — Last update: September/2025',
      'footer.thanks': 'Thanks for visiting!',
      'actions.share': 'Share',
      'actions.toTop': 'Back to top',
      'meta.last': 'Last'
    }
  };

  // ===== State =====
  let curLang = (function(){ try{ return localStorage.getItem('bv-lang') || 'pt'; }catch(e){ return 'pt'; } 
// Share button functionality

  // ===== Share button (Web Share API with clipboard fallback) =====
  function setupShare(){
    const shareBtn = document.getElementById('shareBtn') || document.querySelector('[data-action="share"]');
    if(!shareBtn) return;
    // Apply gradient class hook (CSS below)
    shareBtn.classList.add('btn-share-gradient');
    const shareData = {
      title: document.title || 'BiblioVerse',
      text: (I18N?.[curLang]?.['footer.lead'] ?
             I18N[curLang]['footer.lead'].replace(/<[^>]*>/g,'') :
             'BiblioVerse — portal central de bibliotecas.'),
      url: location.href
    };
    const doClipboardFallback = async () => {
      try {
        await navigator.clipboard.writeText(shareData.url);
        // Simple, dependency-free feedback
        shareBtn.setAttribute('data-shared', '1');
        const prev = shareBtn.textContent;
        const okLabel = (curLang === 'en') ? 'Link copied!' : 'Link copiado!';
        shareBtn.textContent = '✓ ' + okLabel;
        setTimeout(()=>{
          shareBtn.textContent = prev;
          shareBtn.removeAttribute('data-shared');
        }, 1800);
      } catch (e) {
        alert((curLang === 'en') ? 'Copy failed. Please copy the URL manually.' : 'Falha ao copiar. Copie o link manualmente, por favor.');
      }
    };
    shareBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await doClipboardFallback();
        }
      } catch(e){
        // If user cancels or share fails, attempt fallback copy
        await doClipboardFallback();
      }
    }, { passive: false });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupShare();
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: 'Confira este projeto incrível: BiblioVerse',
            url: window.location.href
          });
        } catch (err) {
          console.error('Erro ao compartilhar:', err);
        }
      } else {
        // Fallback: copy link
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copiado para a área de transferência!');
        } catch (err) {
          console.error('Erro ao copiar link:', err);
        }
      }
    });
  }
});

})();
  let curTheme = (function(){ try{ return localStorage.getItem('bv-theme') || (root.getAttribute('data-theme')||'light'); }catch(e){ return 'light'; } 
// Share button functionality

  // ===== Share button (Web Share API with clipboard fallback) =====
  function setupShare(){
    const shareBtn = document.getElementById('shareBtn') || document.querySelector('[data-action="share"]');
    if(!shareBtn) return;
    // Apply gradient class hook (CSS below)
    shareBtn.classList.add('btn-share-gradient');
    const shareData = {
      title: document.title || 'BiblioVerse',
      text: (I18N?.[curLang]?.['footer.lead'] ?
             I18N[curLang]['footer.lead'].replace(/<[^>]*>/g,'') :
             'BiblioVerse — portal central de bibliotecas.'),
      url: location.href
    };
    const doClipboardFallback = async () => {
      try {
        await navigator.clipboard.writeText(shareData.url);
        // Simple, dependency-free feedback
        shareBtn.setAttribute('data-shared', '1');
        const prev = shareBtn.textContent;
        const okLabel = (curLang === 'en') ? 'Link copied!' : 'Link copiado!';
        shareBtn.textContent = '✓ ' + okLabel;
        setTimeout(()=>{
          shareBtn.textContent = prev;
          shareBtn.removeAttribute('data-shared');
        }, 1800);
      } catch (e) {
        alert((curLang === 'en') ? 'Copy failed. Please copy the URL manually.' : 'Falha ao copiar. Copie o link manualmente, por favor.');
      }
    };
    shareBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await doClipboardFallback();
        }
      } catch(e){
        // If user cancels or share fails, attempt fallback copy
        await doClipboardFallback();
      }
    }, { passive: false });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupShare();
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: 'Confira este projeto incrível: BiblioVerse',
            url: window.location.href
          });
        } catch (err) {
          console.error('Erro ao compartilhar:', err);
        }
      } else {
        // Fallback: copy link
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copiado para a área de transferência!');
        } catch (err) {
          console.error('Erro ao copiar link:', err);
        }
      }
    });
  }
});

})();

  // ===== Helpers =====
  function setLangAttr(lang){ document.documentElement.lang = (lang === 'en') ? 'en' : 'pt-BR'; }
  function setLangToggleIcon(lang){ 
    if(!langToggle) return; 
    langToggle.textContent = (lang === 'en') ? '🇧🇷' : '🇦🇺'; 
    langToggle.setAttribute('title', lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês'); 
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês'); 
  }
  function setThemeIcon(theme){ if(!themeToggle) return; themeToggle.textContent = (theme === 'light') ? '🌙' : '☀️'; }

  // Text getter respecting i18n keys to guarantee consistent sorting in both languages
  function getI18nText(el, lang){
    const key = el.getAttribute('data-i18n');
    if(key && I18N[lang] && I18N[lang][key] != null){
      // Remove tags for comparison, normalize accents
      const tmp = I18N[lang][key].replace(/<[^>]*>/g, '');
      return tmp.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }
    const txt = el.textContent || '';
    return txt.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  // ===== Sorting: library cards =====
  function sortLibCards(lang){
    if(!libGrid) return;
    const cards = Array.from(libGrid.querySelectorAll('.lib-card'));

    cards.sort((a,b)=>{
      const aNameEl = a.querySelector('.lib-name');
      const bNameEl = b.querySelector('.lib-name');
      const aText = getI18nText(aNameEl, lang);
      const bText = getI18nText(bNameEl, lang);
      // localeCompare with base sensitivity for predictable PT/EN order
      return aText.localeCompare(bText, lang === 'en' ? 'en' : 'pt-BR', {sensitivity:'base'});
    });

    // Re-append in sorted order
    const frag = document.createDocumentFragment();
    cards.forEach(c => frag.appendChild(c));
    libGrid.appendChild(frag);
  }

  // ===== Sorting: filter select options =====
  function sortFilterOptions(lang){
    if(!libFilter) return;
    const opts = Array.from(libFilter.querySelectorAll('option'));
    const first = opts.find(o => o.value === 'all'); // keep "All" first
    const rest  = opts.filter(o => o !== first);

    rest.sort((a,b)=>{
      const aText = getI18nText(a, lang);
      const bText = getI18nText(b, lang);
      return aText.localeCompare(bText, lang === 'en' ? 'en' : 'pt-BR', {sensitivity:'base'});
    });

    // Rebuild select
    const frag = document.createDocumentFragment();
    if(first) frag.appendChild(first);
    rest.forEach(o => frag.appendChild(o));
    libFilter.appendChild(frag);
  }

  // ===== Ensure filter starts at "all" every time =====
  function resetFilterToAll(){
    if(!libFilter) return;
    libFilter.value = 'all';
  }

  function applyI18n(lang){
    document.title = (lang === 'en') ? 'BiblioVerse - The Library of Everything' : 'BiblioVerse - A Biblioteca de Tudo';
    // Make sure gradient-title class is kept on key titles
    document.querySelectorAll('section[data-i18n-attr*="section.about.aria"] .section-title, #curators .section-title').forEach(e=>e.classList.add('gradient-title'));

    const dict = (I18N && I18N[lang]) ? I18N[lang] : (I18N.pt || {});

    // data-i18n: set innerHTML (kept from previous behavior)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(key && dict[key] != null) el.innerHTML = dict[key];
    });

    // data-i18n-attr="attr:key;attr2:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const def = el.getAttribute('data-i18n-attr') || '';
      def.split(';').forEach(pair => {
        const p = pair.trim();
        if(!p) return;
        const parts = p.split(':');
        const attr = (parts[0]||'').trim();
        const key  = (parts[1]||'').trim();
        if(attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    // After translating text, sort UI in this language
    sortLibCards(lang);
    sortFilterOptions(lang);

    // Always default the filter to "all" after any rebuild/translation
    resetFilterToAll();
    filterCurators();

    setLangAttr(lang);
    setLangToggleIcon(lang);
    try{ localStorage.setItem('bv-lang', lang); }catch(e){}
  }

  function filterCurators(){
    const val = (libFilter?.value || 'all').trim();
    const cards = curators?.querySelectorAll('.cur-card') || [];
    cards.forEach(card => {
      const libs = (card.getAttribute('data-libs') || '').split(',').map(s=>s.trim());
      const show = (val==='all') || libs.includes(val);
      card.style.display = show ? '' : 'none';
    });
  }

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    setThemeIcon(theme);
    try{ localStorage.setItem('bv-theme', theme); }catch(e){}
  }

  // ===== Event wiring =====
  
  // ===== Share button (Web Share API with clipboard fallback) =====
  function setupShare(){
    const shareBtn = document.getElementById('shareBtn') || document.querySelector('[data-action="share"]');
    if(!shareBtn) return;
    // Apply gradient class hook (CSS below)
    shareBtn.classList.add('btn-share-gradient');
    const shareData = {
      title: document.title || 'BiblioVerse',
      text: (I18N?.[curLang]?.['footer.lead'] ?
             I18N[curLang]['footer.lead'].replace(/<[^>]*>/g,'') :
             'BiblioVerse — portal central de bibliotecas.'),
      url: location.href
    };
    const doClipboardFallback = async () => {
      try {
        await navigator.clipboard.writeText(shareData.url);
        // Simple, dependency-free feedback
        shareBtn.setAttribute('data-shared', '1');
        const prev = shareBtn.textContent;
        const okLabel = (curLang === 'en') ? 'Link copied!' : 'Link copiado!';
        shareBtn.textContent = '✓ ' + okLabel;
        setTimeout(()=>{
          shareBtn.textContent = prev;
          shareBtn.removeAttribute('data-shared');
        }, 1800);
      } catch (e) {
        alert((curLang === 'en') ? 'Copy failed. Please copy the URL manually.' : 'Falha ao copiar. Copie o link manualmente, por favor.');
      }
    };
    shareBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await doClipboardFallback();
        }
      } catch(e){
        // If user cancels or share fails, attempt fallback copy
        await doClipboardFallback();
      }
    }, { passive: false });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupShare();
    applyTheme(curTheme);
    applyI18n(curLang); // this also sorts and resets filter

    if(langToggle) langToggle.addEventListener('click', () => {
      curLang = (curLang === 'pt') ? 'en' : 'pt';
      applyI18n(curLang); // re-translate, re-sort, and reset filter
    });

    if(themeToggle) themeToggle.addEventListener('click', () => {
      curTheme = (root.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
      applyTheme(curTheme);
    });

    if(libFilter) libFilter.addEventListener('change', filterCurators);

    // Safety: force "all" on first paint too
    resetFilterToAll();
    filterCurators();
  });

  window.addEventListener('load', () => { 
    try{ resetFilterToAll(); filterCurators(); }catch(e){} 
  });

// Share button functionality

  // ===== Share button (Web Share API with clipboard fallback) =====
  function setupShare(){
    const shareBtn = document.getElementById('shareBtn') || document.querySelector('[data-action="share"]');
    if(!shareBtn) return;
    // Apply gradient class hook (CSS below)
    shareBtn.classList.add('btn-share-gradient');
    const shareData = {
      title: document.title || 'BiblioVerse',
      text: (I18N?.[curLang]?.['footer.lead'] ?
             I18N[curLang]['footer.lead'].replace(/<[^>]*>/g,'') :
             'BiblioVerse — portal central de bibliotecas.'),
      url: location.href
    };
    const doClipboardFallback = async () => {
      try {
        await navigator.clipboard.writeText(shareData.url);
        // Simple, dependency-free feedback
        shareBtn.setAttribute('data-shared', '1');
        const prev = shareBtn.textContent;
        const okLabel = (curLang === 'en') ? 'Link copied!' : 'Link copiado!';
        shareBtn.textContent = '✓ ' + okLabel;
        setTimeout(()=>{
          shareBtn.textContent = prev;
          shareBtn.removeAttribute('data-shared');
        }, 1800);
      } catch (e) {
        alert((curLang === 'en') ? 'Copy failed. Please copy the URL manually.' : 'Falha ao copiar. Copie o link manualmente, por favor.');
      }
    };
    shareBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await doClipboardFallback();
        }
      } catch(e){
        // If user cancels or share fails, attempt fallback copy
        await doClipboardFallback();
      }
    }, { passive: false });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupShare();
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: 'Confira este projeto incrível: BiblioVerse',
            url: window.location.href
          });
        } catch (err) {
          console.error('Erro ao compartilhar:', err);
        }
      } else {
        // Fallback: copy link
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copiado para a área de transferência!');
        } catch (err) {
          console.error('Erro ao copiar link:', err);
        }
      }
    });
  }
});

})();
