// === Superbar <-> Sidebar width sync ===
(function(){
  try{
    const root = document.documentElement;
    const side = document.querySelector('.sidepush, #sidepush, .sidebar, #sidebar');
    const setW = () => {
      const w = side ? side.offsetWidth : 0;
      root.style.setProperty('--sidepush-w', w + 'px');
    };
    setW();
    // Track live changes (collapse/expand)
    if (window.ResizeObserver){
      const ro = new ResizeObserver(setW);
      if (side) ro.observe(side);
      window.addEventListener('resize', setW, {passive:true});
    }else{
      window.addEventListener('resize', setW, {passive:true});
    }
  }catch(e){
    // fail silently; layout still works with full width
  }
})();


// Helper: update arrow direction and labels
function updateMenuToggleUi(){
  var btn = document.getElementById('menuToggle'); if(!btn) return;
  var open = document.body.classList.contains('side-open');
  // Right arrow to expand, left arrow to collapse
  btn.textContent = open ? '◀' : '▶';
  var lang = (typeof getLang==='function') ? getLang() : 'pt';
  var lblOpen = lang==='en' ? 'Collapse menu' : (lang==='es' ? 'Colapsar menú' : (lang==='zh' ? '收起菜单' : (lang==='de' ? 'Menü einklappen' : 'Recolher menu')));
  var lblClosed = lang==='en' ? 'Expand menu' : (lang==='es' ? 'Expandir menú' : (lang==='zh' ? '展开菜单' : (lang==='de' ? 'Menü ausklappen' : 'Expandir menu')));
  btn.setAttribute('aria-label', open ? lblOpen : lblClosed);
  btn.setAttribute('title', open ? lblOpen : lblClosed);
}


function slug(str){return (str||'Outros').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
function groupBy(a,k){return a.reduce((acc,it)=>{const key=(it[k]||'Outros').trim()||'Outros';(acc[key]=acc[key]||[]).push(it);return acc;},{});}
function clear(el){while(el.firstChild){el.removeChild(el.firstChild);}}
function sortAlpha(a){return [...a].sort((x,y)=>x.name.localeCompare(y.name,undefined,{sensitivity:'base'}));}

function parseCompanyItem(name){
  const patterns=[/\s+—\s+/,/\s+-\s+/,/\s*:\s*/];
  for(const p of patterns){
    if(p.test(name)){ const parts=name.split(p); if(parts.length>=2){ return {company:parts[0].trim(), item:parts.slice(1) ? parts.slice(1).join(' ').trim() : parts[1].trim()}; } }
  }
  // fix: simpler split
  const dash = name.split(' - '); if(dash.length>=2) return {company:dash[0].trim(), item:dash.slice(1).join(' ').trim()};
  const colon = name.split(': '); if(colon.length>=2) return {company:colon[0].trim(), item:colon.slice(1).join(' ').trim()};
  return {company:'', item:(name||'').toString().trim()};
}

// Category i18n mapping (keys are PT)
const CAT_I18N = {
  "Altruísmo e petições": "Altruism & Petitions",
  "Arte e design": "Art & Design",
  "Bate-papo": "Chat",
  "Blogs e escrita": "Blogs & Writing",
  "Bookmarking": "Bookmarking",
  "Buscadores": "Search Engines",
  "Ciência e pesquisa": "Science & Research",
  "Clubes de assinatura e Crowdfunding": "Subscription Clubs & Crowdfunding",
  "Comida (avaliação)": "Food Reviews",
  "Debate": "Debate",
  "Emprego": "Jobs",
  "Encontros e eventos": "Meetups & Events",
  "Esportes e atividades físicas": "Sports & Fitness",
  "Estadias e viagens (avaliação)": "Stays & Travel Reviews",
  "Feed": "News Feed",
  "Figuras-chave": "Key Figures",
  "Filmes e séries (avaliação)": "Movies & Series Reviews",
  "Fóruns": "Forums",
  "Fotografia": "Photography",
  "Games (avaliação)": "Game Reviews",
  "Gaming": "Gaming",
  "Gerais": "General",
  "IAs": "AI",
  "Línguas": "Languages",
  "Literatura": "Literature",
  "Mais acessados": "Most Visited Sites",
  "Marketplaces": "Marketplaces",
  "Mensagens": "Messaging",
  "Microblogging": "Microblogging",
  "Música": "Music",
  "Música (avaliação)": "Music Reviews",
  "Navegadores web": "Web Browsers",
  "Negócios (avaliação)": "Business Reviews",
  "Perguntas": "Questions",
  "Perguntas pessoais": "Personal Questions",
  "Profissional": "Professional",
  "Rankings e listas": "Rankings & Lists",
  "Relacionamento": "Relationships",
  "Streaming": "Streaming",
  "Termos essenciais": "Essential Terms",
  "Viagem": "Travel",
  "Vídeochamada": "Video Call",
  "Vídeo curto": "Short-form Video",
  "Vídeo longo": "Long-form Video",
  "Agregador de Links": "Links In Bio",
  "Wikis": "Wikis",
  "📚 Aplicativos de Idiomas": "Language Learning Apps",
  "🔁 Aprendizado com Repetição Espaçada": "Spaced Repetition Learning",
  "🎓 Plataformas de cursos online": "Online Course Platforms",
  "📝 Gramática & Vocabulário": "Grammar & Vocabulary",
  "🎧 Escuta (Listening)": "Listening",
  "🗣️ Fala (Speaking)": "Speaking",
  "📖 Leitura (Reading)": "Reading",
  "🧩 Memorização": "Memorization",
  "✍️ Escrita (Writing)": "Writing",
  "🔊 Pronúncia & Fonética": "Pronunciation & Phonetics",
  "💡 Conceitos Fundamentais": "Core Concepts",
  "🤝 Conversação & Troca Linguística": "Conversation & Language Exchange",
  "🧠 Técnicas e métodos de estudo": "Study Techniques & Methods",
  "🌍 Tradutores": "Translators",
  "📋 Testes & Certificações": "Tests & Certifications",
  "🏫 Grandes escolas": "Major Schools",
  "👨‍🏫 Professores privados": "Private Tutors",
  "📗 Clubes de leitura online": "Online Reading Clubs",
  "🖋️ Correção de textos": "Writing Correction",
  "🔬 Aprendizado Avançado / Linguística": "Advanced Learning / Linguistics",
  "🌐 Comunidade": "Community",
  "🤖 Ferramentas com IA para idiomas": "AI Tools for Languages",
  "⌚ Gadgets / Wearables": "Gadgets / Wearables",
  "✈️ Agências de imersão e intercâmbio": "Immersion & Exchange Agencies",
  "Blogs de idiomas": "Language Learning Blogs",
  "🌎 Principais Idiomas": "Major Languages",
  "🎯 Foco nos Estudos": "Study Focus"
};

// Category i18n mapping – Spanish (keys are PT)
const CAT_I18N_ES = {
  "Altruísmo e petições": "Altruismo y Peticiones",
  "Arte e design": "Arte y Diseño",
  "Bate-papo": "Chat",
  "Blogs e escrita": "Blogs y Escritura",
  "Bookmarking": "Marcadores",
  "Buscadores": "Motores de Búsqueda",
  "Ciência e pesquisa": "Ciencia e Investigación",
  "Clubes de assinatura e Crowdfunding": "Clubs de Suscripción y Crowdfunding",
  "Comida (avaliação)": "Reseñas de Comida",
  "Debate": "Debate",
  "Emprego": "Empleo",
  "Encontros e eventos": "Encuentros y Eventos",
  "Esportes e atividades físicas": "Deportes y Actividad Física",
  "Estadias e viagens (avaliação)": "Reseñas de Alojamiento y Viajes",
  "Feed": "Feed de Noticias",
  "Figuras-chave": "Figuras Clave",
  "Filmes e séries (avaliação)": "Reseñas de Películas y Series",
  "Fóruns": "Foros",
  "Fotografia": "Fotografía",
  "Games (avaliação)": "Reseñas de Juegos",
  "Gaming": "Videojuegos",
  "Gerais": "General",
  "IAs": "IA",
  "Línguas": "Idiomas",
  "Literatura": "Literatura",
  "Mais acessados": "Sitios Más Visitados",
  "Marketplaces": "Marketplaces",
  "Mensagens": "Mensajería",
  "Microblogging": "Microblogging",
  "Música": "Música",
  "Música (avaliação)": "Reseñas de Música",
  "Navegadores web": "Navegadores Web",
  "Negócios (avaliação)": "Reseñas de Negocios",
  "Perguntas": "Preguntas",
  "Perguntas pessoais": "Preguntas Personales",
  "Profissional": "Profesional",
  "Rankings e listas": "Rankings y Listas",
  "Relacionamento": "Relaciones",
  "Streaming": "Streaming",
  "Termos essenciais": "Términos Esenciales",
  "Viagem": "Viajes",
  "Vídeochamada": "Videollamada",
  "Vídeo curto": "Video Corto",
  "Vídeo longo": "Video Largo",
  "Agregador de Links": "Agregador de Links",
  "Wikis": "Wikis",
  "📚 Aplicativos de Idiomas": "Aplicaciones de Idiomas",
  "🔁 Aprendizado com Repetição Espaçada": "Aprendizaje con Repetición Espaciada",
  "🎓 Plataformas de cursos online": "Plataformas de Cursos en Línea",
  "📝 Gramática & Vocabulário": "Gramática y Vocabulario",
  "🎧 Escuta (Listening)": "Escucha (Listening)",
  "🗣️ Fala (Speaking)": "Habla (Speaking)",
  "📖 Leitura (Reading)": "Lectura (Reading)",
  "🧩 Memorização": "Memorización",
  "✍️ Escrita (Writing)": "Escritura (Writing)",
  "🔊 Pronúncia & Fonética": "Pronunciación y Fonética",
  "💡 Conceitos Fundamentais": "Conceptos Fundamentales",
  "🤝 Conversação & Troca Linguística": "Conversación e Intercambio Lingüístico",
  "🧠 Técnicas e métodos de estudo": "Técnicas y Métodos de Estudio",
  "🌍 Tradutores": "Traductores",
  "📋 Testes & Certificações": "Pruebas y Certificaciones",
  "🏫 Grandes escolas": "Grandes Escuelas",
  "👨‍🏫 Professores privados": "Profesores Privados",
  "📗 Clubes de leitura online": "Clubes de Lectura en Línea",
  "🖋️ Correção de textos": "Corrección de Textos",
  "🔬 Aprendizado Avançado / Linguística": "Aprendizaje Avanzado / Lingüística",
  "🌐 Comunidade": "Comunidad",
  "🤖 Ferramentas com IA para idiomas": "Herramientas de IA para Idiomas",
  "⌚ Gadgets / Wearables": "Gadgets / Wearables",
  "✈️ Agências de imersão e intercâmbio": "Agencias de Inmersión e Intercambio",
  "Blogs de idiomas": "Blogs de Idiomas",
  "🌎 Principais Idiomas": "Principales Idiomas",
  "🎯 Foco nos Estudos": "Enfoque en los Estudios"
};

// Category i18n mapping – Mandarin Chinese / 普通话 (keys are PT)
const CAT_I18N_ZH = {
  "Altruísmo e petições": "利他主义与请愿",
  "Arte e design": "艺术与设计",
  "Bate-papo": "聊天",
  "Blogs e escrita": "博客与写作",
  "Bookmarking": "书签",
  "Buscadores": "搜索引擎",
  "Ciência e pesquisa": "科学与研究",
  "Clubes de assinatura e Crowdfunding": "订阅俱乐部与众筹",
  "Comida (avaliação)": "美食评测",
  "Debate": "辩论",
  "Emprego": "求职",
  "Encontros e eventos": "聚会与活动",
  "Esportes e atividades físicas": "运动与健身",
  "Estadias e viagens (avaliação)": "住宿与旅行评测",
  "Feed": "新闻推送",
  "Figuras-chave": "关键人物",
  "Filmes e séries (avaliação)": "电影与剧集评测",
  "Fóruns": "论坛",
  "Fotografia": "摄影",
  "Games (avaliação)": "游戏评测",
  "Gaming": "游戏",
  "Gerais": "综合",
  "IAs": "人工智能",
  "Línguas": "语言",
  "Literatura": "文学",
  "Mais acessados": "最常访问的网站",
  "Marketplaces": "市场",
  "Mensagens": "即时通讯",
  "Microblogging": "微博",
  "Música": "音乐",
  "Música (avaliação)": "音乐评测",
  "Navegadores web": "网络浏览器",
  "Negócios (avaliação)": "商业评测",
  "Perguntas": "问答",
  "Perguntas pessoais": "个人问题",
  "Profissional": "职业",
  "Rankings e listas": "排名与列表",
  "Relacionamento": "人际关系",
  "Streaming": "流媒体",
  "Termos essenciais": "基本术语",
  "Viagem": "旅行",
  "Vídeochamada": "视频通话",
  "Vídeo curto": "短视频",
  "Vídeo longo": "长视频",
  "Agregador de Links": "链接聚合",
  "Wikis": "维基",
  "📚 Aplicativos de Idiomas": "语言学习应用",
  "🔁 Aprendizado com Repetição Espaçada": "间隔重复学习",
  "🎓 Plataformas de cursos online": "在线课程平台",
  "📝 Gramática & Vocabulário": "语法与词汇",
  "🎧 Escuta (Listening)": "听力",
  "🗣️ Fala (Speaking)": "口语",
  "📖 Leitura (Reading)": "阅读",
  "🧩 Memorização": "记忆",
  "✍️ Escrita (Writing)": "写作",
  "🔊 Pronúncia & Fonética": "发音与语音学",
  "💡 Conceitos Fundamentais": "基础概念",
  "🤝 Conversação & Troca Linguística": "对话与语言交流",
  "🧠 Técnicas e métodos de estudo": "学习技巧与方法",
  "🌍 Tradutores": "翻译工具",
  "📋 Testes & Certificações": "测试与认证",
  "🏫 Grandes escolas": "知名学校",
  "👨‍🏫 Professores privados": "私人教师",
  "📗 Clubes de leitura online": "在线读书俱乐部",
  "🖋️ Correção de textos": "文字校正",
  "🔬 Aprendizado Avançado / Linguística": "高级学习 / 语言学",
  "🌐 Comunidade": "社区",
  "🤖 Ferramentas com IA para idiomas": "语言学习AI工具",
  "⌚ Gadgets / Wearables": "智能设备 / 可穿戴设备",
  "✈️ Agências de imersão e intercâmbio": "沉浸式学习与交流机构",
  "Blogs de idiomas": "语言学习博客",
  "🌎 Principais Idiomas": "主要语言",
  "🎯 Foco nos Estudos": "学习专注"
};

// Category i18n mapping – Hindi / हिन्दी (keys are PT)
const CAT_I18N_HI = {
  "Altruísmo e petições": "परोपकार और याचिकाएं",
  "Arte e design": "कला और डिज़ाइन",
  "Bate-papo": "चैट",
  "Blogs e escrita": "ब्लॉग और लेखन",
  "Bookmarking": "बुकमार्किंग",
  "Buscadores": "सर्च इंजन",
  "Ciência e pesquisa": "विज्ञान और शोध",
  "Clubes de assinatura e Crowdfunding": "सदस्यता क्लब और क्राउडफंडिंग",
  "Comida (avaliação)": "खाना समीक्षा",
  "Debate": "बहस",
  "Emprego": "रोज़गार",
  "Encontros e eventos": "मुलाकात और कार्यक्रम",
  "Esportes e atividades físicas": "खेल और शारीरिक गतिविधियां",
  "Estadias e viagens (avaliação)": "आवास और यात्रा समीक्षा",
  "Feed": "न्यूज़ फ़ीड",
  "Figuras-chave": "प्रमुख हस्तियां",
  "Filmes e séries (avaliação)": "फिल्म और सीरीज़ समीक्षा",
  "Fóruns": "फ़ोरम",
  "Fotografia": "फ़ोटोग्राफ़ी",
  "Games (avaliação)": "गेम समीक्षा",
  "Gaming": "गेमिंग",
  "Gerais": "सामान्य",
  "IAs": "आर्टिफ़िशियल इंटेलिजेंस",
  "Línguas": "भाषाएं",
  "Literatura": "साहित्य",
  "Mais acessados": "सबसे ज़्यादा देखी जाने वाली साइटें",
  "Marketplaces": "मार्केटप्लेस",
  "Mensagens": "संदेश",
  "Microblogging": "माइक्रोब्लॉगिंग",
  "Música": "संगीत",
  "Música (avaliação)": "संगीत समीक्षा",
  "Navegadores web": "वेब ब्राउज़र",
  "Negócios (avaliação)": "व्यापार समीक्षा",
  "Perguntas": "प्रश्न",
  "Perguntas pessoais": "व्यक्तिगत प्रश्न",
  "Profissional": "व्यावसायिक",
  "Rankings e listas": "रैंकिंग और सूचियां",
  "Relacionamento": "रिश्ते",
  "Streaming": "स्ट्रीमिंग",
  "Termos essenciais": "आवश्यक शब्द",
  "Viagem": "यात्रा",
  "Vídeochamada": "वीडियो कॉल",
  "Vídeo curto": "शॉर्ट वीडियो",
  "Vídeo longo": "लंबा वीडियो",
  "Agregador de Links": "लिंक एग्रीगेटर",
  "Wikis": "विकी",
  "📚 Aplicativos de Idiomas": "भाषा सीखने के ऐप्स",
  "🔁 Aprendizado com Repetição Espaçada": "स्पेस्ड रिपीटिशन लर्निंग",
  "🎓 Plataformas de cursos online": "ऑनलाइन कोर्स प्लेटफ़ॉर्म",
  "📝 Gramática & Vocabulário": "व्याकरण और शब्दावली",
  "🎧 Escuta (Listening)": "सुनना (Listening)",
  "🗣️ Fala (Speaking)": "बोलना (Speaking)",
  "📖 Leitura (Reading)": "पढ़ना (Reading)",
  "🧩 Memorização": "याद करना",
  "✍️ Escrita (Writing)": "लिखना (Writing)",
  "🔊 Pronúncia & Fonética": "उच्चारण और ध्वनिविज्ञान",
  "💡 Conceitos Fundamentais": "मूल अवधारणाएं",
  "🤝 Conversação & Troca Linguística": "संवाद और भाषा विनिमय",
  "🧠 Técnicas e métodos de estudo": "अध्ययन तकनीक और विधियां",
  "🌍 Tradutores": "अनुवादक",
  "📋 Testes & Certificações": "परीक्षा और प्रमाणन",
  "🏫 Grandes escolas": "प्रमुख स्कूल",
  "👨‍🏫 Professores privados": "निजी शिक्षक",
  "📗 Clubes de leitura online": "ऑनलाइन पुस्तक क्लब",
  "🖋️ Correção de textos": "लेखन सुधार",
  "🔬 Aprendizado Avançado / Linguística": "उन्नत अध्ययन / भाषाविज्ञान",
  "🌐 Comunidade": "समुदाय",
  "🤖 Ferramentas com IA para idiomas": "भाषा के लिए AI उपकरण",
  "⌚ Gadgets / Wearables": "गैजेट्स / वेयरेबल्स",
  "✈️ Agências de imersão e intercâmbio": "इमर्शन और एक्सचेंज एजेंसियां",
  "Blogs de idiomas": "भाषा ब्लॉग",
  "🌎 Principais Idiomas": "प्रमुख भाषाएं",
  "🎯 Foco nos Estudos": "अध्ययन पर ध्यान"
};

// Category i18n mapping – Arabic / العربية (keys are PT)
const CAT_I18N_AR = {
  "Altruísmo e petições": "الإيثار والعرائض",
  "Arte e design": "الفن والتصميم",
  "Bate-papo": "الدردشة",
  "Blogs e escrita": "المدونات والكتابة",
  "Bookmarking": "الإشارات المرجعية",
  "Buscadores": "محركات البحث",
  "Ciência e pesquisa": "العلوم والبحث",
  "Clubes de assinatura e Crowdfunding": "نوادي الاشتراك والتمويل الجماعي",
  "Comida (avaliação)": "تقييمات الطعام",
  "Debate": "النقاش",
  "Emprego": "التوظيف",
  "Encontros e eventos": "اللقاءات والفعاليات",
  "Esportes e atividades físicas": "الرياضة والنشاط البدني",
  "Estadias e viagens (avaliação)": "تقييمات الإقامة والسفر",
  "Feed": "موجز الأخبار",
  "Figuras-chave": "الشخصيات الرئيسية",
  "Filmes e séries (avaliação)": "تقييمات الأفلام والمسلسلات",
  "Fóruns": "المنتديات",
  "Fotografia": "التصوير الفوتوغرافي",
  "Games (avaliação)": "تقييمات الألعاب",
  "Gaming": "الألعاب",
  "Gerais": "عام",
  "IAs": "الذكاء الاصطناعي",
  "Línguas": "اللغات",
  "Literatura": "الأدب",
  "Mais acessados": "المواقع الأكثر زيارة",
  "Marketplaces": "الأسواق الإلكترونية",
  "Mensagens": "الرسائل",
  "Microblogging": "التدوين المصغر",
  "Música": "الموسيقى",
  "Música (avaliação)": "تقييمات الموسيقى",
  "Navegadores web": "متصفحات الويب",
  "Negócios (avaliação)": "تقييمات الأعمال",
  "Perguntas": "الأسئلة",
  "Perguntas pessoais": "الأسئلة الشخصية",
  "Profissional": "المهني",
  "Rankings e listas": "التصنيفات والقوائم",
  "Relacionamento": "العلاقات",
  "Streaming": "البث المباشر",
  "Termos essenciais": "المصطلحات الأساسية",
  "Viagem": "السفر",
  "Vídeochamada": "مكالمة الفيديو",
  "Vídeo curto": "الفيديو القصير",
  "Vídeo longo": "الفيديو الطويل",
  "Agregador de Links": "مجمع الروابط",
  "Wikis": "ويكي",
  "📚 Aplicativos de Idiomas": "تطبيقات تعلم اللغات",
  "🔁 Aprendizado com Repetição Espaçada": "التعلم بالتكرار المتباعد",
  "🎓 Plataformas de cursos online": "منصات الدورات الإلكترونية",
  "📝 Gramática & Vocabulário": "القواعد والمفردات",
  "🎧 Escuta (Listening)": "الاستماع",
  "🗣️ Fala (Speaking)": "التحدث",
  "📖 Leitura (Reading)": "القراءة",
  "🧩 Memorização": "الحفظ",
  "✍️ Escrita (Writing)": "الكتابة",
  "🔊 Pronúncia & Fonética": "النطق وعلم الأصوات",
  "💡 Conceitos Fundamentais": "المفاهيم الأساسية",
  "🤝 Conversação & Troca Linguística": "المحادثة والتبادل اللغوي",
  "🧠 Técnicas e métodos de estudo": "تقنيات وأساليب الدراسة",
  "🌍 Tradutores": "المترجمون",
  "📋 Testes & Certificações": "الاختبارات والشهادات",
  "🏫 Grandes escolas": "المدارس الكبرى",
  "👨‍🏫 Professores privados": "المدرسون الخصوصيون",
  "📗 Clubes de leitura online": "نوادي القراءة الإلكترونية",
  "🖋️ Correção de textos": "تصحيح النصوص",
  "🔬 Aprendizado Avançado / Linguística": "التعلم المتقدم / اللسانيات",
  "🌐 Comunidade": "المجتمع",
  "🤖 Ferramentas com IA para idiomas": "أدوات الذكاء الاصطناعي للغات",
  "⌚ Gadgets / Wearables": "الأجهزة الذكية / الملبوسات",
  "✈️ Agências de imersão e intercâmbio": "وكالات الانغماس والتبادل",
  "Blogs de idiomas": "مدونات اللغات",
  "🌎 Principais Idiomas": "اللغات الرئيسية",
  "🎯 Foco nos Estudos": "التركيز على الدراسة"
};

// Category i18n mapping – German / Deutsch (keys are PT)
const CAT_I18N_DE = {
  "Altruísmo e petições": "Altruismus & Petitionen",
  "Arte e design": "Kunst & Design",
  "Bate-papo": "Chat",
  "Blogs e escrita": "Blogs & Schreiben",
  "Bookmarking": "Lesezeichen",
  "Buscadores": "Suchmaschinen",
  "Ciência e pesquisa": "Wissenschaft & Forschung",
  "Clubes de assinatura e Crowdfunding": "Abonnementclubs & Crowdfunding",
  "Comida (avaliação)": "Restaurantbewertungen",
  "Debate": "Debatte",
  "Emprego": "Arbeit",
  "Encontros e eventos": "Treffen & Veranstaltungen",
  "Esportes e atividades físicas": "Sport & Fitness",
  "Estadias e viagens (avaliação)": "Unterkunft & Reisebewertungen",
  "Feed": "Newsfeed",
  "Figuras-chave": "Schlüsselfiguren",
  "Filmes e séries (avaliação)": "Film- & Serienbewertungen",
  "Fóruns": "Foren",
  "Fotografia": "Fotografie",
  "Games (avaliação)": "Spielebewertungen",
  "Gaming": "Gaming",
  "Gerais": "Allgemein",
  "IAs": "KI",
  "Línguas": "Sprachen",
  "Literatura": "Literatur",
  "Mais acessados": "Meistbesuchte Seiten",
  "Marketplaces": "Marktplätze",
  "Mensagens": "Nachrichten",
  "Microblogging": "Microblogging",
  "Música": "Musik",
  "Música (avaliação)": "Musikbewertungen",
  "Navegadores web": "Webbrowser",
  "Negócios (avaliação)": "Unternehmensbewertungen",
  "Perguntas": "Fragen",
  "Perguntas pessoais": "Persönliche Fragen",
  "Profissional": "Beruflich",
  "Rankings e listas": "Rankings & Listen",
  "Relacionamento": "Beziehungen",
  "Streaming": "Streaming",
  "Termos essenciais": "Grundbegriffe",
  "Viagem": "Reisen",
  "Vídeochamada": "Videoanruf",
  "Vídeo curto": "Kurzvideos",
  "Vídeo longo": "Langvideos",
  "Agregador de Links": "Link-Aggregator",
  "Wikis": "Wikis",
  "📚 Aplicativos de Idiomas": "Sprachlern-Apps",
  "🔁 Aprendizado com Repetição Espaçada": "Lernen mit Spaced Repetition",
  "🎓 Plataformas de cursos online": "Online-Kursplattformen",
  "📝 Gramática & Vocabulário": "Grammatik & Wortschatz",
  "🎧 Escuta (Listening)": "Hören (Listening)",
  "🗣️ Fala (Speaking)": "Sprechen (Speaking)",
  "📖 Leitura (Reading)": "Lesen (Reading)",
  "🧩 Memorização": "Einprägen",
  "✍️ Escrita (Writing)": "Schreiben (Writing)",
  "🔊 Pronúncia & Fonética": "Aussprache & Phonetik",
  "💡 Conceitos Fundamentais": "Grundkonzepte",
  "🤝 Conversação & Troca Linguística": "Konversation & Sprachaustausch",
  "🧠 Técnicas e métodos de estudo": "Lerntechniken & -methoden",
  "🌍 Tradutores": "Übersetzer",
  "📋 Testes & Certificações": "Tests & Zertifizierungen",
  "🏫 Grandes escolas": "Große Sprachschulen",
  "👨‍🏫 Professores privados": "Privatlehrer",
  "📗 Clubes de leitura online": "Online-Lesekreise",
  "🖋️ Correção de textos": "Textkorrektur",
  "🔬 Aprendizado Avançado / Linguística": "Fortgeschrittenes Lernen / Linguistik",
  "🌐 Comunidade": "Gemeinschaft",
  "🤖 Ferramentas com IA para idiomas": "KI-Tools für Sprachen",
  "⌚ Gadgets / Wearables": "Gadgets / Wearables",
  "✈️ Agências de imersão e intercâmbio": "Immersions- & Austauschanbieter",
  "Blogs de idiomas": "Sprachlernblogs",
  "🌎 Principais Idiomas": "Hauptsprachen",
  "🎯 Foco nos Estudos": "Lernfokus"
};

// Category icon mapping (keys are PT)
const CAT_ICON = {
  "Altruísmo e petições": "🕊️",
  "Arte e design": "🖌️",
  "Bate-papo": "💬",
  "Blogs e escrita": "✍️",
  "Bookmarking": "📌",
  "Buscadores": "🔎",
  "Ciência e pesquisa": "🧪",
  "Clubes de assinatura e Crowdfunding": "💎",
  "Comida (avaliação)": "🍽️",
  "Debate": "🧠",
  "Emprego": "💼",
  "Encontros e eventos": "🤝",
  "Esportes e atividades físicas": "🏅",
  "Estadias e viagens (avaliação)": "🏙️",
  "Feed": "📰",
  "Figuras-chave": "🌟",
  "Filmes e séries (avaliação)": "🎬",
  "Fóruns": "🗂️",
  "Fotografia": "📷",
  "Games (avaliação)": "🎮",
  "Gaming": "🕹️",
  "Gerais": "🟦",
  "IAs": "🤖",
  "Línguas": "🗣️",
  "Literatura": "📚",
  "Mais acessados": "🌍",
  "Marketplaces": "🛍️",
  "Mensagens": "💌",
  "Microblogging": "🐦",
  "Música": "🎵",
  "Música (avaliação)": "🎧",
  "Navegadores web": "🌐",
  "Negócios (avaliação)": "🏢",
  "Perguntas": "❓",
  "Perguntas pessoais": "🙋",
  "Profissional": "🧑‍💼",
  "Rankings e listas": "🏆",
  "Relacionamento": "💖",
  "Streaming": "🎥",
  "Termos essenciais": "🧩",
  "Viagem": "🗺️",
  "Vídeochamada": "📞",
  "Vídeo curto": "⏩",
  "Vídeo longo": "▶️",
  "Agregador de Links": "🔗",
  "Wikis": "📖",
  "📚 Aplicativos de Idiomas": "📚",
  "🔁 Aprendizado com Repetição Espaçada": "🔁",
  "🎓 Plataformas de cursos online": "🎓",
  "📝 Gramática & Vocabulário": "📝",
  "🎧 Escuta (Listening)": "🎧",
  "🗣️ Fala (Speaking)": "🗣️",
  "📖 Leitura (Reading)": "📖",
  "🧩 Memorização": "🧩",
  "✍️ Escrita (Writing)": "✍️",
  "🔊 Pronúncia & Fonética": "🔊",
  "💡 Conceitos Fundamentais": "💡",
  "🤝 Conversação & Troca Linguística": "🤝",
  "🧠 Técnicas e métodos de estudo": "🧠",
  "🌍 Tradutores": "🌍",
  "📋 Testes & Certificações": "📋",
  "🏫 Grandes escolas": "🏫",
  "👨‍🏫 Professores privados": "👨‍🏫",
  "📗 Clubes de leitura online": "📗",
  "🖋️ Correção de textos": "🖋️",
  "🔬 Aprendizado Avançado / Linguística": "🔬",
  "🌐 Comunidade": "🌐",
  "🤖 Ferramentas com IA para idiomas": "🤖",
  "⌚ Gadgets / Wearables": "⌚",
  "✈️ Agências de imersão e intercâmbio": "✈️",
  "Blogs de idiomas": "📰",
  "🌎 Principais Idiomas": "🌎",
  "🎯 Foco nos Estudos": "🎯"
};

function catIcon(cat){ return CAT_ICON[cat] || "📦"; }
function catIconEl(cat){
  const span = document.createElement('span');
  span.className = 'cat-ico';
  span.textContent = catIcon(cat);
  span.setAttribute('aria-hidden','true');
  return span;
}


function isFeatured(it){
  if(!it) return false;
  if(it.featured === true) return true;
  try{
    if(typeof it.featured === 'string' && it.featured.toLowerCase()==='true') return true;
    if(Array.isArray(it.tags)){
      for(var i=0;i<it.tags.length;i++){
        var t = String(it.tags[i]||'').toLowerCase();
        if(t==='featured' || t==='destaque' || t==='star' || t==='⭐' || t==='highlight') return true;
      }
    }else if(typeof it.tags === 'string'){
      var s = it.tags.toLowerCase();
      if(s.includes('featured') || s.includes('destaque') || s.includes('star') || s.includes('highlight')) return true;
    }
  }catch(e){}
  return false;
}
function isEnded(it){
  if(!it) return false;
  try{
    if(it.ended === true) return true;
    if(typeof it.ended === 'string' && it.ended.toLowerCase()==='true') return true;
    if(Array.isArray(it.tags)){
      for(var i=0;i<it.tags.length;i++){
        var t = String(it.tags[i]||'').toLowerCase();
        if(t==='ended' || t==='encerrado' || t==='rip' || t==='defunct' || t==='discontinued' || t==='🪦' || t==='lapide' || t==='lápide') return true;
      }
    }else if(typeof it.tags === 'string'){
      var s = it.tags.toLowerCase();
      if(s.includes('ended') || s.includes('encerrado') || s.includes('rip') || s.includes('defunct') || s.includes('discontinued') || s.includes('🪦') || s.includes('lapide') || s.includes('lápide')) return true;
    }
  }catch(e){}
  return false;
}

function sortFeaturedAlpha(items){
  var arr = (items||[]).slice();
  arr.sort(function(a,b){
    // priority: 0 = featured, 1 = normal, 2 = ended
    var rank = function(it){ return isFeatured(it) ? 0 : (isEnded(it) ? 2 : 1); };
    var pa = rank(a), pb = rank(b);
    if (pa !== pb) return pa - pb; // featured first, ended last
    var an = (a && a.name) ? String(a.name) : '';
    var bn = (b && b.name) ? String(b.name) : '';
    return an.localeCompare(bn, undefined, {sensitivity:'base'});
  });
  return arr;
}

function stripLeadingEmojiLabel(text){
  return String(text||'')
    .replace(/^[\p{Extended_Pictographic}\uFE0F\u200D#*0-9]+\s*/u, '')
    .trim();
}

function catLabel(cat){
  const lang = getLang();
  const raw = lang==='en' ? (CAT_I18N[cat] || cat) : (lang==='es' ? (CAT_I18N_ES[cat] || cat) : (lang==='zh' ? (CAT_I18N_ZH[cat] || cat) : (lang==='hi' ? (CAT_I18N_HI[cat] || cat) : (lang==='ar' ? (CAT_I18N_AR[cat] || cat) : (lang==='de' ? (CAT_I18N_DE[cat] || cat) : cat)))));
  return stripLeadingEmojiLabel(raw);
}
function catSlugFor(cat){
  const lang = getLang();
  const translated = lang==='en' ? (CAT_I18N[cat] || cat) : (lang==='es' ? (CAT_I18N_ES[cat] || cat) : (lang==='zh' ? (CAT_I18N_ZH[cat] || cat) : (lang==='hi' ? (CAT_I18N_HI[cat] || cat) : (lang==='ar' ? (CAT_I18N_AR[cat] || cat) : (lang==='de' ? (CAT_I18N_DE[cat] || cat) : cat)))));
  return slug(translated);
}




function compareCats(a,b){
  try{
    const la = (typeof catLabel === 'function') ? String(catLabel(a)||'') : String(a||'');
    const lb = (typeof catLabel === 'function') ? String(catLabel(b)||'') : String(b||'');
    return la.localeCompare(lb, undefined, {sensitivity:'base'});
  }catch(e){
    return String(a||'').localeCompare(String(b||''), undefined, {sensitivity:'base'});
  }
}
const I18N = {
  pt: {
    brand:"A Biblioteca de Aprendizado de Idiomas",
    by:"por",
    and:"e",
    search:"Buscar por nome",
    allCats:"Todas as categorias",
    visit:"Acesse",
    total:"Total",
    items:"itens",
    noResults:"Nenhum resultado.",
    footerLeadPre:"",
    projectName:"A Biblioteca de Aprendizado de Idiomas",
    footerLeadPost:"foi idealizada por Julio Cesar Prava e Aline Lima e construída com a ajuda de IA. O projeto reúne itens selecionados e revisados por curadores humanos.",
    bookmarkShare:"Salve esse projeto nos seus favoritos e compartilhe!",
    thanks:"Obrigado pela visita!",
    lastUpdate:"Última atualização: Março/2026",
    footernav:"Acesse as bibliotecas de outros temas úteis no <strong class=\"bverse-strong\">BiblioVerse</strong>.",
    share:"Compartilhar",
    copied:"Link copiado!",
    favHelp:"Use Ctrl+D (Windows) ou Cmd+D (Mac) para favoritar esta página.",
    kbdTitle:
"Atalhos de teclado\n/ – Ativa a barra de busca\nT – Alterna cor do tema\nL – Alterna idioma\n\n★ – Destaque"
  },
  en: {
    brand:"The Language Learning Library",
    by:"by",
    and:"and",
    search:"Search by name",
    allCats:"All categories",
    visit:"Visit",
    total:"Total",
    items:"items",
    noResults:"No results.",
    footerLeadPre:"",
    projectName:"The Language Learning Library",
    footerLeadPost:"was conceived by Julio Cesar Prava and Aline Lima and built with the help of AI. The project showcases items selected and reviewed by human curators.",
    bookmarkShare:"Bookmark this project and share it!",
    thanks:"Thanks for visiting!",
    lastUpdate:"Last update: March/2026",
    footernav:"Access libraries on other useful topics at <strong class=\"bverse-strong\">BiblioVerse</strong>.",
    share:"Share",
    copied:"Link copied!",
    favHelp:"Use Ctrl+D (Windows) or Cmd+D (Mac) to bookmark this page.",
    kbdTitle:
"Keyboard shortcuts\n/ – Focus the search bar\nT – Toggle theme color\nL – Toggle language\n\n★ – Featured"
  },
  es: {
    brand:"La Biblioteca de Aprendizaje de Idiomas",
    by:"por",
    and:"y",
    search:"Buscar por nombre",
    allCats:"Todas las categorías",
    visit:"Visitar",
    total:"Total",
    items:"elementos",
    noResults:"Sin resultados.",
    footerLeadPre:"",
    projectName:"La Biblioteca de Aprendizaje de Idiomas",
    footerLeadPost:"fue concebida por Julio Cesar Prava y Aline Lima y construida con la ayuda de IA. El proyecto reúne elementos seleccionados y revisados por curadores humanos.",
    bookmarkShare:"¡Guarda este proyecto en tus favoritos y compártelo!",
    thanks:"¡Gracias por tu visita!",
    lastUpdate:"Última actualización: Marzo/2026",
    footernav:"Accede a las bibliotecas de otros temas útiles en <strong class=\"bverse-strong\">BiblioVerse</strong>.",
    share:"Compartir",
    copied:"¡Enlace copiado!",
    favHelp:"Usa Ctrl+D (Windows) o Cmd+D (Mac) para marcar esta página.",
    kbdTitle:
"Atajos de teclado\n/ – Activar la barra de búsqueda\nT – Cambiar color del tema\nL – Cambiar idioma\n\n★ – Destacado"
  },
  zh: {
    brand:"语言学习图书馆",
    by:"作者",
    and:"和",
    search:"按名称搜索",
    allCats:"所有类别",
    visit:"访问",
    total:"总计",
    items:"项目",
    noResults:"无结果。",
    footerLeadPre:"",
    projectName:"语言学习图书馆",
    footerLeadPost:"由 Julio Cesar Prava 和 Aline Lima 构想，并在 AI 的协助下构建。该项目收录了由人工编辑精选和审核的内容。",
    bookmarkShare:"将此项目加入收藏并分享！",
    thanks:"感谢您的访问！",
    lastUpdate:"最后更新：2026年3月",
    footernav:"在 <strong class=\"bverse-strong\">BiblioVerse</strong> 上访问其他有用主题的图书馆。",
    share:"分享",
    copied:"链接已复制！",
    favHelp:"使用 Ctrl+D（Windows）或 Cmd+D（Mac）将此页面加入书签。",
    kbdTitle:
"键盘快捷键\n/ – 激活搜索栏\nT – 切换主题颜色\nL – 切换语言\n\n★ – 精选"
  },
  hi: {
    brand:"भाषा सीखने की लाइब्रेरी",
    by:"द्वारा",
    and:"और",
    search:"नाम से खोजें",
    allCats:"सभी श्रेणियां",
    visit:"देखें",
    total:"कुल",
    items:"आइटम",
    noResults:"कोई परिणाम नहीं।",
    footerLeadPre:"",
    projectName:"भाषा सीखने की लाइब्रेरी",
    footerLeadPost:"Julio Cesar Prava और Aline Lima द्वारा परिकल्पित, और AI की सहायता से निर्मित। यह परियोजना मानव क्यूरेटर द्वारा चुने और समीक्षित आइटम प्रस्तुत करती है।",
    bookmarkShare:"इस परियोजना को बुकमार्क करें और साझा करें!",
    thanks:"आपकी यात्रा के लिए धन्यवाद!",
    lastUpdate:"अंतिम अपडेट: मार्च/2026",
    footernav:"<strong class=\"bverse-strong\">BiblioVerse</strong> पर अन्य उपयोगी विषयों की लाइब्रेरी देखें।",
    share:"साझा करें",
    copied:"लिंक कॉपी हो गया!",
    favHelp:"इस पृष्ठ को बुकमार्क करने के लिए Ctrl+D (Windows) या Cmd+D (Mac) का उपयोग करें।",
    kbdTitle:
"कीबोर्ड शॉर्टकट\n/ – सर्च बार सक्रिय करें\nT – थीम रंग बदलें\nL – भाषा बदलें\n\n★ – विशेष"
  },
  ar: {
    brand:"مكتبة تعلم اللغات",
    by:"بقلم",
    and:"و",
    search:"البحث بالاسم",
    allCats:"جميع الفئات",
    visit:"زيارة",
    total:"الإجمالي",
    items:"عناصر",
    noResults:"لا توجد نتائج.",
    footerLeadPre:"",
    projectName:"مكتبة تعلم اللغات",
    footerLeadPost:"تم تصورها من قبل Julio Cesar Prava و Aline Lima وبُنيت بمساعدة الذكاء الاصطناعي. يجمع المشروع عناصر مختارة ومراجعة من قبل منسقين بشريين.",
    bookmarkShare:"احفظ هذا المشروع في المفضلة وشاركه!",
    thanks:"شكراً على زيارتك!",
    lastUpdate:"آخر تحديث: مارس/2026",
    footernav:"تصفح مكتبات مواضيع مفيدة أخرى في <strong class=\"bverse-strong\">BiblioVerse</strong>.",
    share:"مشاركة",
    copied:"تم نسخ الرابط!",
    favHelp:"استخدم Ctrl+D (ويندوز) أو Cmd+D (ماك) لحفظ هذه الصفحة في المفضلة.",
    kbdTitle:
"اختصارات لوحة المفاتيح\n/ – تفعيل شريط البحث\nT – تبديل لون السمة\nL – تبديل اللغة\n\n★ – مميز"
  },
  de: {
    brand:"Die Sprachlernbibliothek",
    by:"von",
    and:"und",
    search:"Nach Name suchen",
    allCats:"Alle Kategorien",
    visit:"Besuchen",
    total:"Gesamt",
    items:"Einträge",
    noResults:"Keine Ergebnisse.",
    footerLeadPre:"",
    projectName:"Die Sprachlernbibliothek",
    footerLeadPost:"wurde von Julio Cesar Prava und Aline Lima konzipiert und mit Hilfe von KI entwickelt. Das Projekt vereint von menschlichen Kuratoren ausgewählte und geprüfte Einträge.",
    bookmarkShare:"Speichere dieses Projekt in deinen Lesezeichen und teile es!",
    thanks:"Danke für deinen Besuch!",
    lastUpdate:"Letzte Aktualisierung: März/2026",
    footernav:"Entdecke Bibliotheken zu anderen nützlichen Themen auf <strong class=\"bverse-strong\">BiblioVerse</strong>.",
    share:"Teilen",
    copied:"Link kopiert!",
    favHelp:"Benutze Strg+D (Windows) oder Cmd+D (Mac), um diese Seite zu bookmarken.",
    kbdTitle:
"Tastenkürzel\n/ – Suchleiste fokussieren\nT – Design wechseln\nL – Sprache wechseln\n\n★ – Hervorgehoben"
  }
};

// Labels for the top superbar items
const SUPERBAR_I18N = {
  pt: {
    design: "Design",
    games: "Games",
    language: "Idiomas",
    ai: "IA",
    music: "Música",
    coding: "Programação",
    social: "Redes Sociais"
  },
  en: {
    design: "Design",
    games: "Games",
    language: "Language",
    ai: "AI",
    music: "Music",
    coding: "Coding",
    social: "Social"
  },
  es: {
    design: "Diseño",
    games: "Juegos",
    language: "Idiomas",
    ai: "IA",
    music: "Música",
    coding: "Programación",
    social: "Redes Sociales"
  },
  zh: {
    design: "设计",
    games: "游戏",
    language: "语言",
    ai: "人工智能",
    music: "音乐",
    coding: "编程",
    social: "社交"
  },
  hi: {
    design: "डिज़ाइन",
    games: "गेम्स",
    language: "भाषाएं",
    ai: "AI",
    music: "संगीत",
    coding: "कोडिंग",
    social: "सोशल"
  },
  ar: {
    design: "التصميم",
    games: "الألعاب",
    language: "اللغات",
    ai: "الذكاء الاصطناعي",
    music: "الموسيقى",
    coding: "البرمجة",
    social: "التواصل الاجتماعي"
  },
  de: {
    design: "Design",
    games: "Spiele",
    language: "Sprachen",
    ai: "KI",
    music: "Musik",
    coding: "Programmierung",
    social: "Soziale Medien"
  }
};

function getLang(){ try{ const saved=localStorage.getItem('libia-lang'); if(saved) return saved; const bl=(navigator.language||'pt').toLowerCase(); return bl.startsWith('en')?'en':(bl.startsWith('es')?'es':(bl.startsWith('zh')?'zh':(bl.startsWith('hi')?'hi':(bl.startsWith('ar')?'ar':(bl.startsWith('de')?'de':'pt'))))); }catch(e){ return 'pt'; } }
function setLang(lang){
  const dict = I18N[lang] || I18N.pt;
  try{ localStorage.setItem('libia-lang', lang); }catch(e){}
  document.querySelectorAll('.i18n-brand').forEach(el=>el.textContent=dict.brand);
  const search = document.getElementById('search'); if(search) search.placeholder = dict.search;
  const catSel = document.getElementById('categoryFilter');
  if(catSel && catSel.options.length) catSel.options[0].textContent = dict.allCats;
  // visit buttons removed; no-op
  const totalEl = document.querySelector('.i18n-total'); if(totalEl) totalEl.textContent = dict.total;
  const itemsEl = document.querySelector('.i18n-items'); if(itemsEl) itemsEl.textContent = dict.items;
  const byEl = document.querySelector('.i18n-by'); if(byEl) byEl.textContent = dict.by;
  const andEl = document.querySelector('.i18n-and'); if(andEl) andEl.textContent = dict.and;

  const leadPre = document.querySelector('.i18n-footer-lead-pre'); if(leadPre) leadPre.textContent = dict.footerLeadPre;
  const proj = document.querySelector('.i18n-project-name'); if(proj) proj.textContent = dict.projectName;
  const leadPost = document.querySelector('.i18n-footer-lead-post'); if(leadPost) leadPost.textContent = dict.footerLeadPost;

  const fNote = document.querySelector('.i18n-bookmarkShare'); if(fNote) fNote.textContent = dict.bookmarkShare;
  const fNav = document.querySelector('.i18n-footernav'); if(fNav) fNav.innerHTML = dict.footernav;
  const lastUp = document.querySelector('.i18n-lastupdate'); if(lastUp) lastUp.textContent = dict.lastUpdate;

  const fThanks = document.querySelector('.i18n-thanks'); if(fThanks) fThanks.textContent = dict.thanks;
  const shareBtn = document.getElementById('shareBtn'); if(shareBtn) shareBtn.querySelector('.i18n-share').textContent = dict.share;

  const tip = document.getElementById('infoTip'); if(tip) tip.textContent = dict.kbdTitle;

  document.documentElement.setAttribute('lang', lang==='en' ? 'en' : (lang==='es' ? 'es' : (lang==='zh' ? 'zh-CN' : (lang==='hi' ? 'hi' : (lang==='ar' ? 'ar' : (lang==='de' ? 'de' : 'pt-br'))))));
  document.documentElement.setAttribute('dir', lang==='ar' ? 'rtl' : 'ltr');
  const _curLangFlag = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸', zh: '🇨🇳', hi: '🇮🇳', ar: '🇸🇦', de: '🇩🇪' };
  const langBtn=document.getElementById('langToggle'); if(langBtn){ langBtn.textContent = _curLangFlag[lang] || '🇧🇷'; }

  // Localize tooltips / aria-labels for toggle buttons and select title
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){ themeBtn.setAttribute('aria-label', lang==='en' ? 'Toggle theme' : (lang==='es' ? 'Cambiar tema' : (lang==='zh' ? '切换主题' : (lang==='hi' ? 'थीम बदलें' : (lang==='ar' ? 'تبديل السمة' : (lang==='de' ? 'Design wechseln' : 'Alternar tema')))))); }
  const langBtn2 = document.getElementById('langToggle');
  if(langBtn2){ langBtn2.setAttribute('aria-label', lang==='en' ? 'Toggle language' : (lang==='es' ? 'Cambiar idioma' : (lang==='zh' ? '切换语言' : (lang==='hi' ? 'भाषा बदलें' : (lang==='ar' ? 'تبديل اللغة' : (lang==='de' ? 'Sprache wechseln' : 'Alternar idioma')))))); }
  const infoBtn2 = document.getElementById('infoBtn');
  if(infoBtn2){ infoBtn2.setAttribute('aria-label', lang==='en' ? 'Information' : (lang==='es' ? 'Información' : (lang==='zh' ? '信息' : (lang==='hi' ? 'जानकारी' : (lang==='ar' ? 'معلومات' : (lang==='de' ? 'Informationen' : 'Informações')))))); }
  const catSel2 = document.getElementById('categoryFilter');
  if(catSel2){ catSel2.setAttribute('title', lang==='en' ? 'Filter by category' : (lang==='es' ? 'Filtrar por categoría' : (lang==='zh' ? '按类别筛选' : (lang==='hi' ? 'श्रेणी के अनुसार फ़िल्टर करें' : (lang==='ar' ? 'تصفية حسب الفئة' : (lang==='de' ? 'Nach Kategorie filtern' : 'Filtrar por categoria')))))); }

// Update superbar labels
  try{
    const labels = SUPERBAR_I18N[lang] || SUPERBAR_I18N.pt;
    document.querySelectorAll('.superbar-list [data-key]').forEach(function(a){
      const key = a.getAttribute('data-key');
      if (key && labels[key]) { a.textContent = labels[key]; }
    });
  }catch(e){}


// Localize superbar mobile toggle title
try{
  var st = document.querySelector('.superbar .superbar-toggle .i18n-superbar-title');
  if(st){
    st.textContent = lang==='en'
      ? 'BiblioVerse - The Library of Everything'
      : (lang==='es' ? 'BiblioVerse - La Biblioteca de Todo' : (lang==='zh' ? 'BiblioVerse - 万物图书馆' : (lang==='hi' ? 'BiblioVerse - सब कुछ की लाइब्रेरी' : (lang==='ar' ? 'BiblioVerse - مكتبة كل شيء' : (lang==='de' ? 'BiblioVerse - Die Bibliothek von Allem' : 'BiblioVerse - A Biblioteca de Tudo')))));
  }
}catch(e){}

}


// --- Favicons (fast-first with smart fallbacks) ---
const FAVICON_CACHE = new Map();

function domainFromUrl(url){
  if(!url) return '';
  try{ return new URL(url).hostname; }catch(e){
    try{ return new URL('https://' + url).hostname; }catch(e2){ return ''; }
  }
}

function faviconUrlFor(host, provider){
  if(!host) return '';
  switch(provider){
    case 'google': return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64';
    case 'clearbit':    return 'https://icons.duckduckgo.com/ip3/' + host + '.ico';
    case 'direct': return 'https://' + host + '/favicon.ico';
    default: return '';
  }
}

/**
 * Heuristic for "bad" icons:
 * - broken load (onerror)
 * - intrinsic size <= 16x16 (generic globe / low-res)
 */
function isLowResFavicon(img){
  try{
    const w = img.naturalWidth||0, h = img.naturalHeight||0;
    return (w <= 16 || h <= 16);
  }catch(e){ return false; }
}

function createFaviconEl(url, name){
  const span = document.createElement('span');
  span.className = 'favicon';

  const host = domainFromUrl(url);
  if(!host){
    span.classList.add('fallback');
    span.textContent = (name||'?').trim().charAt(0).toUpperCase() || '?';
    return span;
  }

  const img = document.createElement('img');
  img.alt = ''; 
  img.referrerPolicy = 'no-referrer';
  img.decoding = 'async';
  img.loading = 'lazy';

  const providers = ['google','clearbit','direct'];
  let step = 0;

  // If we already discovered a good provider for this host, use it first.
  if(FAVICON_CACHE.has(host)){
    const cached = FAVICON_CACHE.get(host);
    const idx = providers.indexOf(cached);
    if(idx > 0){ providers.splice(idx,1); providers.unshift(cached); }
  }

  function tryNextProvider(){
    if(step >= providers.length){
      // Final fallback: text initial
      span.classList.add('fallback');
      span.textContent = (name||'?').trim().charAt(0).toUpperCase() || '?';
      if(img.parentNode) img.remove();
      return;
    }
    const prov = providers[step++];
    img.dataset.provider = prov;
    img.src = faviconUrlFor(host, prov);
  }

  img.addEventListener('error', ()=>{
    tryNextProvider();
  });

  img.addEventListener('load', ()=>{
    if(isLowResFavicon(img) && img.dataset.provider !== 'direct'){
      // 16x16 from Google or DDG is likely generic; try a different source
      tryNextProvider();
      return;
    }
    // Good icon: remember and keep
    FAVICON_CACHE.set(host, img.dataset.provider || 'google');
  });

  span.appendChild(img);
  tryNextProvider();
  return span;
}


function createCard(item){
  // Make the whole card a clickable link (like the old "Acesse" button)
  const d = document.createElement('a');
  d.className = 'card card-link';
  d.href = item.url || '#';
  if (item.url){
    d.target = '_blank';
    d.rel = 'noopener noreferrer';
    d.setAttribute('aria-label', (parseCompanyItem(item.name).item || item.name) + ' — abrir site');
  }else{
    d.setAttribute('aria-disabled','true');
    d.addEventListener('click', (e)=> e.preventDefault());
    const _dl=getLang();d.title=(_dl==='en'?'No link available':(_dl==='es'?'Sin enlace disponible':(_dl==='de'?'Kein Link verfügbar':'Sem link disponível')));
  }

  const parsed = parseCompanyItem(item.name);

  // Title with favicon
  const title = document.createElement('p'); title.className='title-line';
  
  // Defer favicon creation to idle time to keep main thread snappy
  (window.requestIdleCallback || window.requestAnimationFrame)(function(){
    try{
      const ico = createFaviconEl(item.url, parsed.item);
      title.insertBefore(ico, title.firstChild);
    }catch(e){ /* noop */ }
  });

  const m = parsed.item.match(/^(.*?)(\s*\(.*\)\s*)$/);
  if(m){
    title.appendChild(document.createTextNode(' '+m[1].trim()));
    const par=document.createElement('span'); par.className='paren'; par.textContent=m[2]; title.appendChild(par);
  }else{
    title.appendChild(document.createTextNode(' '+parsed.item));
  }
  if(isFeatured(item)){
    var star=document.createElement('span');
    star.className='featured-star';
    const _sl=getLang && getLang();star.title=(_sl==='en'?'Featured':(_sl==='es'?'Destacado':(_sl==='de'?'Hervorgehoben':'Destaque')));
    star.textContent='★';
    title.appendChild(star);
  }
  
  
  // Add tombstone badge for ended items
  if (isEnded(item)) {
    var ended = document.createElement('span');
    ended.className = 'featured-star ended-badge';
    const _el=getLang && getLang();ended.title=(_el==='en'?'Ended':(_el==='es'?'Finalizado':(_el==='de'?'Beendet':'Encerrado')));
    ended.textContent = '🪦';
    title.appendChild(ended);
  }

  /* align badges right */
  (function(){
    try{
      var starEl = title.querySelector('.featured-star');
      var endedEl = title.querySelector('.ended-badge');
      if(endedEl){
        if(starEl){
          endedEl.style.right = '0px'; // move left when star is present
          // increase padding-right to avoid text under badges
          title.style.paddingRight = '56px';
        }else{
          endedEl.style.right = '0px'; // stick to right edge like star
        }
      }
    }catch(e){}
  })();
d.appendChild(title);

  // Subtitle: company (smaller)
  if(parsed.company){
    const sub=document.createElement('p'); sub.className='subtitle'; sub.textContent=parsed.company; d.appendChild(sub);
  }

  // No actions/visit button anymore — the card itself is the link
  return d;
}


function buildCategory(name, items){
  const sec=document.createElement('section');sec.className='category';sec.id=catSlugFor(name);

  const h2=document.createElement('h2');
  const icoEl = catIconEl(name);
  const titleSpan=document.createElement('span');
  titleSpan.className='cat-title';
  titleSpan.textContent=catLabel(name);

  const anchor=document.createElement('a');
  anchor.className='cat-anchor';
  anchor.href = '#' + catSlugFor(name);
  const _bl=getLang();anchor.setAttribute('aria-label', (_bl==='en' ? 'Copy link to category' : (_bl==='es' ? 'Copiar enlace de categoría' : (_bl==='de' ? 'Kategorielink kopieren' : 'Copiar link da categoria'))));
  anchor.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.59 13.41a1 1 0 0 0 1.41 1.41l4.24-4.24a3 3 0 0 0-4.24-4.24l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-4.24 4.24Zm2.82-2.82a1 1 0 0 0-1.41-1.41L7.35 13.4a3 3 0 1 0 4.24 4.24l1.06-1.06a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41l4.24-4.24Z"/>
    </svg>
  `;

  anchor.addEventListener('click', async (e)=>{
    e.preventDefault();
    const id = catSlugFor(name);
    // update hash
    if(history.replaceState){ history.replaceState(null, '', '#'+id); } else { location.hash = id; }
    // scroll
    const sec = document.getElementById(id); if(sec){ smoothScrollToId(sec.id); }
    // copy full URL
    try{
      await navigator.clipboard.writeText(location.origin + location.pathname + '#' + id);
      const _cl=getLang();showToast(_cl==='en'?I18N.en.copied:(_cl==='es'?I18N.es.copied:(_cl==='de'?I18N.de.copied:I18N.pt.copied)));
    }catch(err){ /* ignore */ }
  });

  h2.appendChild(icoEl);
  h2.appendChild(titleSpan);
  h2.appendChild(anchor);
  sec.appendChild(h2);

  const grid=document.createElement('div');grid.className='grid';
  sortFeaturedAlpha(items).forEach((it,i)=>{ const c=createCard(it); c.style.animationDelay=(i*30)+'ms'; grid.appendChild(c); });
  sec.appendChild(grid);
  // --- gradient separator after the cards ---
  const sep = document.createElement('div');
  sep.className = 'category-sep';
  sec.appendChild(sep);

  return sec;
}


function populateSelect(categories){
  const sel=document.querySelector('#categoryFilter');clear(sel);
  const _pl=getLang();const all=document.createElement('option');all.value='all';all.textContent=(I18N[_pl]||I18N.pt).allCats;sel.appendChild(all);
  Object.keys(categories).sort(compareCats).forEach(cat=>{
    const op=document.createElement('option'); op.value=catSlugFor(cat); op.textContent=catLabel(cat); sel.appendChild(op);
  });
}


function applyFilters(data){
  const q=document.getElementById('search').value.trim().toLowerCase();
  const catSlug=document.getElementById('categoryFilter').value;
  const root=document.getElementById('root');
  const cats=groupBy(data.filter(item=>{
    const hay=(item.name+' '+(item.category||'')).toLowerCase();
    const okQ=q===''||hay.includes(q);
    const okC=catSlug==='all'||catSlugFor(item.category)===catSlug;
    return okQ && okC;
  }),'category');
  const names=Object.keys(cats).sort(compareCats);
  // Update footer counter with the number of items currently visible (search + category)
  const totalCount = Object.values(cats).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const countEl = document.getElementById('count'); if(countEl) countEl.textContent = totalCount;

  if(names.length===0){const p=document.createElement('p');p.className='no-results';const _l=getLang();p.textContent=(_l==='en'?I18N.en.noResults:(_l==='es'?I18N.es.noResults:(_l==='de'?I18N.de.noResults:I18N.pt.noResults)));root.appendChild(p);return;}
  const frag=document.createDocumentFragment(); names.forEach(n=>frag.appendChild(buildCategory(n,cats[n])));
  // Replace all at once to avoid empty-state jank
  root.replaceChildren(frag);
  // Remove skeleton if present
  var sk = document.getElementById('skeleton'); if(sk && sk.parentElement===root){ try{ sk.remove(); }catch(e){} }
}

function setTheme(theme){
  const html=document.documentElement;
  html.setAttribute('data-theme', theme);
  try{ localStorage.setItem('libia-theme', theme); }catch(e){}
  const btn=document.getElementById('themeToggle');
  if(btn){ btn.textContent = theme==='light' ? '🌙' : '☀️'; }
}

function initTheme(){
  let theme='dark';
  try{
    const saved=localStorage.getItem('libia-theme');
    if(saved==='light' || saved==='dark'){ theme=saved; }
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){ theme='light'; }
  }catch(e){}
  setTheme(theme);
}


function ensureToastContainer(){
  let t=document.getElementById('toast');
  if(!t){
    t=document.createElement('div'); t.id='toast'; document.body.appendChild(t);
  }
  return t;
}
function showToast(msg){
  const t=ensureToastContainer();
  t.textContent=msg;
  t.classList.remove('show');
  void t.offsetWidth; // reflow
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 1600);
}

function getHeaderOffset(){
  const h=document.querySelector('.site-header');
  return (h ? h.offsetHeight : 0) + 12; // small breathing space
}
function smoothScrollToId(id){
  const el=document.getElementById(id);
  if(!el) return;
  const off=getHeaderOffset();
  const rect=el.getBoundingClientRect();
  const y=window.scrollY + rect.top - off;
  requestAnimationFrame(()=>window.scrollTo({top: Math.max(0,y), behavior:'smooth'}));
}

function ensureTopButton(){
  let b=document.getElementById('toTopBtn');
  if(!b){
    b=document.createElement('button');
    b.id='toTopBtn';
    const _tl=getLang();b.setAttribute('title', _tl==='en' ? 'Back to top' : (_tl==='es' ? 'Volver arriba' : (_tl==='de' ? 'Nach oben' : 'Voltar ao topo')));
    b.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-7 7h4v9h6v-9h4z"/></svg>`;
    document.body.appendChild(b);
    b.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }
  return b;
}
function updateDocTitleAndMeta(){
  const lang=getLang();
  const name = lang==='en' ? 'BiblioVerse — The Language Learning Library' : (lang==='es' ? 'BiblioVerse — La Biblioteca de Aprendizaje de Idiomas' : (lang==='de' ? 'BiblioVerse — Die Sprachlernbibliothek' : 'BiblioVerse — A Biblioteca de Aprendizado de Idiomas'));
  const desc = lang==='en' ? 'Searchable catalog of the best language learning resources by category' : (lang==='es' ? 'Catálogo buscable de los mejores recursos para aprender idiomas por categoría' : (lang==='de' ? 'Durchsuchbarer Katalog der besten Sprachlernressourcen nach Kategorie' : 'Catálogo pesquisável dos melhores recursos para aprender idiomas por categoria'));
  document.title = name + ' — ' + desc;
  const meta=document.querySelector('meta[name="description"]'); if(meta){ meta.setAttribute('content', desc); }
}


function setupShare(){
  const shareBtn = document.getElementById('shareBtn');
  const url = location.href;
  const text = document.title;
  shareBtn.addEventListener('click', async () => {
    if(navigator.share){
      try{ await navigator.share({ title: document.title, text, url }); return; }catch(e){ /* ignore */ }
    }
    try{ await navigator.clipboard.writeText(url); const _l=getLang(); alert(_l==='en'?I18N.en.copied:(_l==='es'?I18N.es.copied:(_l==='de'?I18N.de.copied:I18N.pt.copied))); }catch(e){}
  });
}

function setupFavorite(){
  const favBtn = document.getElementById('favBtn');
  favBtn.addEventListener('click', () => {
    if(window.external && 'AddFavorite' in window.external){
      try{ window.external.AddFavorite(location.href, document.title); return; }catch(e){}
    }
    const _lf=getLang(); alert(_lf==='en'?I18N.en.favHelp:(_lf==='es'?I18N.es.favHelp:(_lf==='de'?I18N.de.favHelp:I18N.pt.favHelp)));
  });
}

function setupInfo(){
  const infoBtn = document.getElementById('infoBtn');
  const tip = document.getElementById('infoTip');
  if(!infoBtn || !tip) return;
  // initial content
  const _li=getLang(); tip.textContent = _li==='en' ? I18N.en.kbdTitle : (_li==='es' ? I18N.es.kbdTitle : (_li==='de' ? I18N.de.kbdTitle : I18N.pt.kbdTitle));
  // show on hover/focus
  const show = ()=> tip.setAttribute('aria-hidden','false');
  const hide = ()=> tip.setAttribute('aria-hidden','true');
  infoBtn.addEventListener('mouseenter', show);
  infoBtn.addEventListener('focus', show);
  infoBtn.addEventListener('mouseleave', hide);
  infoBtn.addEventListener('blur', hide);
}

(function init(){
  initTheme();
  const savedLang = getLang(); setLang(savedLang);

  // Data
  let data=[]; const preload=document.getElementById('preloaded-data'); if(preload&&preload.textContent.trim()){ try{ data=JSON.parse(preload.textContent); }catch(e){} }
  document.getElementById('count').textContent=data.length;

  // Build UI
  
  // Build UI
  const cats=groupBy(data,'category'); populateSelect(cats);
  const sel=document.getElementById('categoryFilter');

  // initial selection based on hash or default
  const initialHash = (location.hash||'').replace(/^#/, '');
  const defaultCat = (window.DEFAULT_CATEGORY==='__ALL__') ? 'all' : slug(window.DEFAULT_CATEGORY||'');
  if(initialHash && document.getElementById(initialHash)){
    sel.value = initialHash;
  }else{
    sel.value = defaultCat || 'all';
  }
  applyFilters(data);
  // extras: toast + top button + dynamic title/meta
  ensureToastContainer();
  const toTop=ensureTopButton();
  updateDocTitleAndMeta();
      // Scroll main page to top and reset sidebar scroll as if 'back to top' was clicked
      window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollSidebarToId('all');
      var sideScroll = document.getElementById('sideScroll');
      if (sideScroll) { try { sideScroll.scrollTo({ top: 0, behavior: 'auto' }); } catch(e) { sideScroll.scrollTop = 0; } }

  window.addEventListener('scroll', ()=>{
    const y = window.scrollY||document.documentElement.scrollTop;
    if(y>200){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
  });

  if(initialHash){ setTimeout(()=>{ const sec=document.getElementById(initialHash); if(sec){ smoothScrollToId(sec.id); } },0); }
// Events
  document.getElementById('search').addEventListener('input',()=>applyFilters(data));
  
  sel.addEventListener('change',()=>{
    const v = sel.value;
    applyFilters(data);
    if(v==='all'){
      if(history.replaceState){ history.replaceState(null,'',location.pathname + location.search); } else { location.hash=''; }
      window.scrollTo({top:0, behavior:'smooth'});
      // NEW: reveal 'All categories' at the top of the sidebar
      scrollSidebarToId('all');
    }else{
      const newHash = '#'+v;
      if(newHash!==location.hash){
        if(history.replaceState){ history.replaceState(null,'',newHash); } else { location.hash=newHash; }
      }
      const sec=document.getElementById(v); if(sec){ smoothScrollToId(sec.id); }
      scrollSidebarToId(v);
      // NEW: ensure sidebar reveals the selected category
      scrollSidebarToId(v);
    }
  try{ if(typeof window.__rebuildSideMenu==='function'){ window.__rebuildSideMenu(); } }catch(e){}
    });

  document.getElementById('themeToggle').addEventListener('click',()=>{
    const html=document.documentElement;
    const now=html.getAttribute('data-theme')==='light'?'dark':'light';
    setTheme(now);
  });
  // Language picker dropdown
  const _langFlagMap = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸', zh: '🇨🇳', hi: '🇮🇳', ar: '🇸🇦', de: '🇩🇪' };
  const langPicker = document.getElementById('langPicker');
  const langBtn = document.getElementById('langToggle');
  if(langBtn){
    langBtn.textContent = _langFlagMap[getLang()] || '🇧🇷';
    langBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      langPicker.classList.toggle('open');
      // mark active option
      document.querySelectorAll('.lang-option').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.lang === getLang());
      });
    });
  }
  function _applyLang(lang){
    setLang(lang);
    if(langBtn) langBtn.textContent = _langFlagMap[lang] || '🇧🇷';
    // rebuild categories/select with language-specific slugs
    const cats2=groupBy(data,'category'); populateSelect(cats2);
    sel.value = 'all';
    applyFilters(data);
    if(history.replaceState){ history.replaceState(null,'',location.pathname + location.search); } else { location.hash=''; }
    updateDocTitleAndMeta();
    // Rebuild sidebar immediately with translated slugs and updated icons
    if(typeof window.__rebuildSideMenu === 'function'){ window.__rebuildSideMenu(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    scrollSidebarToId('all');
    var sideScroll = document.getElementById('sideScroll');
    if (sideScroll) { try { sideScroll.scrollTo({ top: 0, behavior: 'auto' }); } catch(e) { sideScroll.scrollTop = 0; } }
  }
  document.querySelectorAll('.lang-option').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      langPicker.classList.remove('open');
      _applyLang(btn.dataset.lang);
    });
  });
  document.addEventListener('click', ()=>{ if(langPicker) langPicker.classList.remove('open'); });

  
  // hash navigation sync
  window.addEventListener('hashchange', ()=>{
    const h=(location.hash||'').replace(/^#/, '');
    if(h && sel.value!==h){
      sel.value=h; applyFilters(data);
      const sec=document.getElementById(h); if(sec){ smoothScrollToId(sec.id); }
    // NEW: ensure sidebar scrolls to active item on hash change
    scrollSidebarToId(h);
    }
    if(!h && sel.value!=='all'){
      sel.value='all'; applyFilters(data); window.scrollTo({top:0, behavior:'smooth'});
      // NEW: reveal 'All categories' at the top of the sidebar
      scrollSidebarToId('all');
    }
  });

  setupShare();

  setupFavorite();
  setupInfo();

  document.addEventListener('keydown',(e)=>{
    const inField = e.target.matches('input,textarea,[contenteditable="true"]');
    if(e.key==='/'&&!inField){ e.preventDefault(); document.querySelector('#search').focus(); }
    if(!inField && e.key && e.key.toLowerCase()==='t'){ e.preventDefault(); const html=document.documentElement; const now=html.getAttribute('data-theme')==='light'?'dark':'light'; setTheme(now); }
    if(!inField && e.key && e.key.toLowerCase()==='l'){ e.preventDefault(); if(langPicker){ langPicker.classList.toggle('open'); document.querySelectorAll('.lang-option').forEach(btn=>{ btn.classList.toggle('active', btn.dataset.lang === getLang()); }); } }
  });
})();


// ===== Side Push Sidebar Logic =====
(function(){
  function ensureSmoothScroll(){
    if(typeof window.smoothScrollToId === 'function') return;
    window.smoothScrollToId = function(id){
      var el = (typeof id === 'string') ? document.getElementById(id) : id;
      if(!el) return;
      var y = el.getBoundingClientRect().top + window.scrollY - 70; // offset from sticky header
      window.scrollTo({top:y, behavior:'smooth'});
    };
  }

  
  // Emoji icons for categories (clean + consistent)
const ICONS = {
  // Home
  'home': '🏠',
  'default': '🏠',

  // Agents
  'ai-agents': '🤖',
  'agentes-de-ia': '🤖',

  // Presentations
  'ai-presentations': '📊',
  'apresentacoes-com-ia': '📊',

  // Automation
  'ai-automation': '⚙️',
  'automacao-com-ia': '⚙️',

  // Avatars
  'ai-avatars': '🧑‍🚀',
  'avatar-com-ia': '🧑‍🚀',

  // Audio (music tools)
  'ai-audio': '🎧',
  'audio-com-ia': '🎧',

  // Stock images (databases)
  'ai-stock-images': '🌌',
  'banco-de-imagens-com-ia': '🌌',

  // Benchmarks / leaderboards
  'ai-benchmarks': '📈',
  'benchmarks-de-ia': '📈',

  // Libraries/directories
  'ai-libraries': '📌',
  'bibliotecas-de-ias': '📌',

  // Chat
  'ai-chatbots': '💬',
  'chat-com-ia': '💬',

  // Resumes
  'ai-resumes': '📄',
  'curriculo-com-ia': '📄',

  // Design / image creation suites
  'ai-design': '🎨',
  'design-com-ia': '🎨',

  // Detective / OSINT-like
  'ai-detective': '🕵️',
  'detetive-com-ia': '🕵️',

  // Curators / promoters
  'ai-curators': '🚀',
  'divulgadores-de-ias': '🚀',

  // Education
  'ai-education': '🎓',
  'educacao-com-ia': '🎓',

  // Writing
  'ai-writing': '✍️',
  'escrita-com-ia': '✍️',

  // Speech / TTS / voice
  'ai-speech': '🗣️',
  'fala-com-ia': '🗣️',

  // Leaders / key figures
  'ai-leaders': '🌟',
  'figuras-chave-da-ia': '🌟',

  // Management / organization
  'ai-management': '🗂️',
  'gerenciamento-com-ia': '🗂️',

  // Big tech companies
  'ai-big-techs': '🏢',
  'grandes-empresas-de-ia': '🏢',

  // General-purpose
  'general-purpose-ais': '🧠',
  'ia-de-uso-geral': '🧠',

  // Language learning
  'ai-language-learning': '📘',
  'idiomas-com-ia': '📘',

  // Image (creation/editing)
  'ai-image': '🖌️',
  'imagem-com-ia': '🖌️',

  // Labs
  'ai-labs': '🧪',
  'laboratorios-de-ia': '🧪',

  // Marketing
  'ai-marketing': '📣',
  'marketing-com-ia': '📣',

  // Math
  'ai-math-learning': '➗',
  'matematica-com-ia': '➗',

  // Browsers
  'ai-browsers': '🌐',
  'navegador-com-ia': '🌐',

  // Bundles
  'ai-bundles': '📦',
  'pacotes-de-ias': '📦',

  // Research tools
  'ai-research-tools': '🔬',
  'pesquisa-com-ia': '🔬',

  // Service platforms
  'ai-service-platforms': '🧰',
  'plataforma-de-servicos-com-ia': '🧰',

  // Coding
  'ai-coding': '💻',
  'programacao-com-ia': '💻',

  // Prompting
  'ai-prompting': '🖥',
  'prompting-para-ia': '🖥',

  // Portraits
  'ai-portraits': '🧑‍🦰',
  'retratos-com-ia': '🧑‍🦰',

  // Healthcare
  'ai-healthcare': '🩺',
  'saude-com-ia': '🩺',

  // Translation
  'ai-translation': '🌍',
  'traducao-com-ia': '🌍',

  // Transcription
  'ai-transcription': '📝',
  'transcricao-com-ia': '📝',

  // Video
  'ai-video': '🎬',
  'video-com-ia': '🎬',

// Synthographers
'ai-synthographers': '📷',
'sintografistas-de-ia': '📷',

// AI glossary
'ai-glossary': '📖',
'termos-de-ia': '📖',

// AI finances
'ai-finances': '💹',
'financas-com-ia': '💹'
};

function iconFor(slug){
  var s = String(slug||'').toLowerCase();

  // 1) Try new mapping via CAT_I18N (PT->*) + CAT_ICON (emoji by PT)
  try{
    const _allMaps = [CAT_I18N, CAT_I18N_ES, CAT_I18N_ZH, CAT_I18N_HI, CAT_I18N_AR, CAT_I18N_DE];
    // Build reverse lookup: translated-slug -> ptCat
    for (var ptCat in CAT_I18N){
      if (!Object.prototype.hasOwnProperty.call(CAT_I18N, ptCat)) continue;
      if (slugify(ptCat) === s){
        if (CAT_ICON && CAT_ICON[ptCat]) return CAT_ICON[ptCat];
      }
      for (var _mi = 0; _mi < _allMaps.length; _mi++){
        var _map = _allMaps[_mi];
        if (_map && Object.prototype.hasOwnProperty.call(_map, ptCat)){
          if (slugify(_map[ptCat]) === s){
            if (CAT_ICON && CAT_ICON[ptCat]) return CAT_ICON[ptCat];
          }
        }
      }
    }
  }catch(e){ /* noop */ }

  // 2) Legacy ICONS table (old IA slugs)
  if (typeof ICONS !== 'undefined' && ICONS[s]) return ICONS[s];

  // 3) Heuristics (safety net)
  if(s.includes('leader') || s.includes('figuras')) return '👑';
  if(s.includes('research') || s.includes('pesquisa') || s.includes('lab')) return '🧪';
  if(s.includes('audio') || s.includes('music')) return '🎧';
  if(s.includes('speech') || s.includes('voice') || s.includes('tts') || s.includes('fala')) return '🗣️';
  if(s.includes('image') || s.includes('imagem') || s.includes('design')) return '🖌️';
  if(s.includes('video') || s.includes('filme')) return '🎬';
  if(s.includes('agent')) return '🤖';
  if(s.includes('chat')) return '💬';
  if(s.includes('write') || s.includes('escrita')) return '✍️';
  if(s.includes('bench')) return '📈';
  if(s.includes('browser') || s.includes('navegador')) return '🌐';
  if(s.includes('market')) return '🛍️';
  if(s.includes('resume') || s.includes('curriculo')) return '📄';
  if(s.includes('translate') || s.includes('traducao')) return '🌍';
  if(s.includes('transcri')) return '📝';
  if(s.includes('auto')) return '⚙️';
  if(s.includes('code') || s.includes('prog')) return '💻';
  if(s.includes('health') || s.includes('saude')) return '🩺';
  if(s.includes('manage') || s.includes('gerenc')) return '🗂️';

  return (typeof ICONS !== 'undefined' && ICONS['default']) ? ICONS['default'] : '📦';
}

// local slugify identical to slug(), but shielded if slug() is renamed
function slugify(str){
  return (str||'Outros')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'');
}

function collectCategories(){
  // Prefer the select options so the sidebar always lists ALL categories,
  // even when the main content is filtered down to one.
  var sel = document.getElementById('categoryFilter');
  if(sel && sel.options && sel.options.length){
    var arr = [];
    for(var i=0;i<sel.options.length;i++){
      var op = sel.options[i];
      if(!op || op.value === 'all') continue;
      arr.push({ id: op.value, label: op.textContent.trim() });
    }
    return arr;
  }
  // Fallback: read from DOM if select is unavailable
  var sections = Array.from(document.querySelectorAll('section.category')) || [];
  return sections.map(function(sec){
    var id = sec.id || '';
    var labelEl = sec.querySelector('.cat-title') || sec.querySelector('h2');
    var label = labelEl ? labelEl.textContent.trim() : id;
    return { id, label };
  });
}

function buildSideMenu(){
    ensureSmoothScroll();
    var ul = document.getElementById('sideMenu'); if(!ul) return;
    ul.innerHTML = '';
    var cats = collectCategories();
// Active detection by hash
var hash = (location.hash||'').replace('#','');

// Add 'All categories' home item at top
(function(){
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = '#';
  a.className = 'sidepush-item';
  a.innerHTML = '<span class="ico">'+iconFor('home')+'</span><span class="label">'+(I18N[getLang()]||I18N.pt).allCats+'</span>';
  a.addEventListener('click', function(ev){
    ev.preventDefault();
    // expand menu on icon click to reveal labels
    document.body.classList.add('side-open');
    updateMenuToggleUi();
    // clear active
    document.querySelectorAll('.sidepush-item.active').forEach(function(el){ el.classList.remove('active'); });
    a.classList.add('active');
    // set select to all and trigger change
    var sel = document.getElementById('categoryFilter');
    if(sel){ sel.value = 'all'; sel.dispatchEvent(new Event('change')); }
    // close on small
    if(window.innerWidth < 900){ document.body.classList.remove('side-open'); }
  });
  li.appendChild(a); ul.appendChild(li);
  // Mark as active by default when no specific category is selected
  try{
    var hashNow = (location.hash||'').replace('#','');
    var selNow = document.getElementById('categoryFilter');
    var isAll = !hashNow && (selNow ? (selNow.value==='all' || !selNow.value) : true);
    if(isAll){ a.classList.add('active'); }
  }catch(e){}
})();cats.forEach(function(c){
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + c.id;
      a.className = 'sidepush-item';
      a.innerHTML = '<span class="ico">'+iconFor(c.id)+'</span><span class="label">'+c.label+'</span>';
      if(hash && hash === c.id) a.classList.add('active');
      a.addEventListener('click', function(ev){
        ev.preventDefault();
        // expand menu on icon click to reveal labels
        document.body.classList.add('side-open');
        updateMenuToggleUi();
        // update active state
        document.querySelectorAll('.sidepush-item.active').forEach(function(el){ el.classList.remove('active'); });
        a.classList.add('active');
        // update hash & smooth scroll
        if(history.replaceState){ history.replaceState(null, '', '#'+c.id); } else { location.hash = c.id; }
        var sel = document.getElementById('categoryFilter'); if(sel){ sel.value = c.id; sel.dispatchEvent(new Event('change')); }
        // On small screens, close after click
        if(window.innerWidth < 900){ document.body.classList.remove('side-open'); }
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  // Toggle button
  function initToggle(){
    var btn = document.getElementById('menuToggle'); if(!btn) return;
    // Initial UI
    updateMenuToggleUi();
    btn.addEventListener('click', function(){
      document.body.classList.toggle('side-open');
      // Recompute active item visibility
      setTimeout(buildSideMenu, 10);
      updateMenuToggleUi();
    });
  }

  // Hook into language changes to re-render labels
  if(typeof window.setLang === 'function'){
    var _setLang = window.setLang;
    window.setLang = function(lang){
      _setLang(lang);
      // delay to let main content rebuild translations if any
      setTimeout(buildSideMenu, 50);
      var title = document.querySelector('.sidepush-title.i18n-brand');
      if(title){
        title.textContent = (I18N[lang]||I18N.pt).brand;
      }
      var hb = document.getElementById('menuToggle');
      if(hb){
        updateMenuToggleUi();
      }
    };
  }

  window.addEventListener('hashchange', function(){ 
    // keep active state in sync
    var hash = (location.hash||'').replace('#','');
    var items = document.querySelectorAll('.sidepush-item');
    items.forEach(function(a){
      var href = a.getAttribute('href') || '';
      var id = (href.startsWith('#') ? href.slice(1) : href);
      a.classList.toggle('active', id===hash);
    });
    if(!hash){
      // Ensure 'Home / All categories' shows as active when no hash
      var home = document.querySelector('.sidepush-item[href="#"]') || document.querySelector('.sidepush-item');
      if(home){ items.forEach(function(a){a.classList.remove('active');}); home.classList.add('active'); }
    }
  });

  // Build after main content is mounted
  document.addEventListener('DOMContentLoaded', function(){
    initToggle();
    // slight delay to ensure categories are rendered by existing script
    setTimeout(function(){ buildSideMenu(); updateMenuToggleUi(); }, 80);
  });

  // Expose for manual rebuilds if needed
  window.__rebuildSideMenu = buildSideMenu;
})();


// Keep toggle label in sync on resize (no layout change)
if (typeof updateMenuToggleUi === 'function') {
  window.addEventListener('resize', updateMenuToggleUi);
}


// === 2025-09-10: Mobile overlay behavior for sidebar ===
(function(){
  function isOverlayMode(){ return window.matchMedia('(max-width: 768px), (max-width: 1024px) and (orientation: portrait)').matches; }

  // Create scrim once
  var scrim = document.querySelector('.side-scrim');
  if(!scrim){
    scrim = document.createElement('div');
    scrim.className = 'side-scrim';
    document.body.appendChild(scrim);
  }
  scrim.addEventListener('click', function(){
    document.body.classList.remove('side-open');
  }, { passive: true });

  // Close on Escape
  window.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape'){
      document.body.classList.remove('side-open');
    }
  });

  // Lock/unlock body scroll on state/resize
  function syncScrollLock(){
    if (document.body.classList.contains('side-open') && isOverlayMode()){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Hook into potential existing toggle function
  var origToggle = window.toggleSidebar;
  window.toggleSidebar = function(force){
    var willOpen;
    if(typeof force === 'boolean'){
      willOpen = force;
    } else {
      willOpen = !document.body.classList.contains('side-open');
    }
    document.body.classList.toggle('side-open', willOpen);
    if (typeof window.updateMenuToggleUi === 'function') {
      window.updateMenuToggleUi();
    }
    syncScrollLock();
  };

  // Keep in sync with resizes
  window.addEventListener('resize', syncScrollLock);
  // Initial sync in case markup starts open or at small viewport
  syncScrollLock();
})();


// --- Scroll control to avoid starting scrolled down after filter/category changes ---
(function(){
  function scrollToTopAfterRender(){
    // Ensure it runs after layout & any async favicon loads kick in
    requestAnimationFrame(function(){
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  // Hook category <select> changes
  document.addEventListener('DOMContentLoaded', function(){
    try{
      var sel = document.getElementById('categoryFilter');
      if(sel && !sel.dataset._scrollHooked){
        sel.addEventListener('change', function(){
          scrollToTopAfterRender();
        }, { passive: true });
        sel.dataset._scrollHooked = '1';
      }
    }catch(e){}

    // Hook side menu clicks (delegate)
    try{
      var side = document.getElementById('sideMenu');
      if(side && !side.dataset._scrollHooked){
        side.addEventListener('click', function(ev){
          var t = ev.target;
          // if a link or button inside the menu triggers a filter/anchor change, scroll to top
          if(t && (t.tagName === 'A' || t.closest('a'))){
            scrollToTopAfterRender();
          }
        }, { passive: true });
        side.dataset._scrollHooked = '1';
      }
    }catch(e){}

    // When URL hash changes to a category anchor, ensure top (then smooth to the section)
    window.addEventListener('hashchange', function(){
      scrollToTopAfterRender();
    }, { passive: true });

  });
})();


// Superbar mobile toggle
document.addEventListener('DOMContentLoaded', function(){
  const superbar = document.querySelector('.superbar');
  const toggle = document.querySelector('.superbar-toggle');
  if(toggle){
    toggle.addEventListener('click', () => {
      superbar.classList.toggle('open');
    });
  }
});


// ===== Superbar compact toggle & current label =====
(function(){
  const nav = document.querySelector('.superbar');
  if(!nav) return;
  const toggle = nav.querySelector('.superbar-toggle');
  const list = nav.querySelector('.superbar-list');
  const current = nav.querySelector('.superbar-current');

  // Set current label from active item
  const active = list.querySelector('.superbar-item.active a') || list.querySelector('.superbar-item a');
  if (active && current) current.textContent = active.textContent.trim();

  if (toggle){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Close on link click (small screens)
  list.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if(!a) return;
    if (window.matchMedia('(max-width: 720px)').matches){
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (current) current.textContent = a.textContent.trim();
    }
  });
})();


// === Ensure the sidebar scrolls to reveal the active category =================
function scrollSidebarToId(idOrAll){
  try{
    var sideScroll = document.getElementById('sideScroll');
    var menu = document.getElementById('sideMenu');
    if(!sideScroll || !menu) return;
    var selector = (idOrAll && idOrAll !== 'all') ? ('#sideMenu a[href="#'+idOrAll+'"]') : '#sideMenu a[href="#"]';
    var link = document.querySelector(selector);
    if(!link) return;
    var item = link.closest('.sidepush-item') || link;

    // Update active state in the sidebar
    menu.querySelectorAll('.sidepush-item.active').forEach(function(el){ el.classList.remove('active'); });
    item.classList.add('active');

    // Compute target scroll so the item becomes visible (center-ish)
    var offsetTop = item.offsetTop - 8; // small top padding
    var itemBottom = offsetTop + item.offsetHeight;
    var viewTop = sideScroll.scrollTop;
    var viewBottom = viewTop + sideScroll.clientHeight;

    // Only scroll if item is out of view or barely visible
    if(offsetTop < viewTop || itemBottom > viewBottom){
      var target = offsetTop - Math.max(0, (sideScroll.clientHeight - item.offsetHeight)/2);
      requestAnimationFrame(()=>sideScroll.scrollTo({ top: Math.max(0, target), behavior: 'smooth' }));
    }
  }catch(e){}
}



// === Hydration flag to remove reserved min-height and close footer gap ===
window.addEventListener('load', function(){
  try{
    var r = document.getElementById('root');
    if(r){ r.classList.add('hydrated'); }
  }catch(e){}
});
