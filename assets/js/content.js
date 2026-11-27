/*
  Site content (Phase 1, static). Edit this file to change text, numbers, clients and projects.
  Every visible string has an English and an Arabic version, so each language stays 100% separate.
  Brand / company names written in Latin letters are shown inside <bdi dir="ltr"> in Arabic mode.
*/
window.SITE = {
  person: {
    en: {
      name: ['Abdelmoneim', 'Diab'],            // short form, used in the header
      heroName: 'ABDEL MONEIM ASHRAF',
      tagline: 'Ideas into visuals. Visuals into impact.',
      title: 'Multimedia & Visual Designer',
      portraitAlt: 'Portrait of Abdel Moneim Ashraf',
      // About copy: owner-approved, use verbatim. Each item is one paragraph (HTML allowed).
      about: [
        'I’m a Multimedia & Visual Designer passionate about turning ideas into meaningful visual experiences.',
        'With experience across corporate and creative agency environments, I work across graphic design, motion graphics, and multimedia production, combining creativity with strategic thinking to create visuals that communicate, connect, and leave an impact.',
        'My ambition is to grow beyond execution into creative direction, shaping ideas into strong visual identities and experiences.'
      ],
      lab: 'Visual & Motion Lab',
      education: 'B.A. in Media, Mansoura University'
    },
    ar: {
      name: ['عبد المنعم', 'دياب'],
      heroName: 'عبد المنعم أشرف',
      tagline: 'أفكار بتتحول لصورة، وصورة بتسيب أثر.',
      title: 'مصمم مالتي ميديا وتصميم بصري',
      portraitAlt: 'صورة عبد المنعم أشرف',
      about: [
        'أنا عبد المنعم، <bdi dir="ltr">Graphic Designer</bdi> و<bdi dir="ltr">Multimedia Specialist</bdi>، بحب أحوّل الأفكار لحاجة تتشاف وتتفتكر.',
        'شغلي بيتنوع بين التصميم، الموشن جرافيك، وصناعة المحتوى البصري. بحب أجرب، أتعلم، وأدور دايمًا على طريقة مختلفة أقدم بيها الفكرة.',
        'بالنسبالي التصميم مش مجرد شكل حلو، هو فكرة وراها هدف وطريقة توصل بيها للناس. وطموحي إني أكبر في المجال، وأوصل لمرحلة أكون فيها صاحب الرؤية اللي بتبدأ منها الفكرة وبتكمل بيها.'
      ],
      lab: 'معمل بصري وموشن',
      education: 'بكالوريوس إعلام، جامعة المنصورة'
    }
  },

  // Placeholder numbers until the owner confirms them.
  stats: [
    { value: 12, suffix: '', en: 'clients and brands', ar: 'عميل وعلامة تجارية' },
    { value: 4, suffix: '+', en: 'years of experience', ar: 'سنين خبرة' }
  ],

  // logo: path to an SVG/PNG later (e.g. 'assets/logos/mb.svg'). Until then the name is shown as a wordmark.
  // ar: Arabic name for entities that are not Latin brands; otherwise the Latin name is used in <bdi>.
  clients: [
    { id: 'mb-engineering', name: 'MB Engineering Group', logo: null },
    { id: 'ministry', name: 'Ministry of Investment', ar: 'وزارة الاستثمار', logo: null },
    { id: 'triora', name: 'TRIORA', logo: null },
    { id: 'an-marketing', name: 'AN Marketing', logo: null },
    { id: 'ag-developers', name: 'AG Developers', logo: null },
    { id: 'next-home', name: 'Next Home', logo: null },
    { id: 'concept', name: 'CON.C.E.P.T', logo: null },
    { id: 'waterway', name: 'The Waterway', logo: null },
    { id: 'maghawry', name: 'Dr. Mohamed Maghawry Media', ar: 'د. محمد مغاوري للإنتاج الإعلامي', logo: null }
  ],

  categories: [
    { id: 'social', ratio: '4:5', en: { name: 'Social Media Design', desc: 'Campaign posts, typographic pieces and series built for the feed.' }, ar: { name: 'تصميم السوشيال ميديا', desc: 'بوستات حملات وتايبوجرافي وسلاسل معمولة للفيد.' } },
    { id: 'print', ratio: '16:9', en: { name: 'Print & Advertising', desc: 'Catalogues, brochures, billboards and exhibition stands.' }, ar: { name: 'الطباعة والإعلان', desc: 'كتالوجات وبروشورات ولوحات إعلانية وأجنحة معارض.' } },
    { id: 'reels', ratio: '9:16', en: { name: 'Reels & Short Videos', desc: 'Vertical edits and motion graphics for short-form platforms.' }, ar: { name: 'الريلز والفيديوهات القصيرة', desc: 'مونتاج طولي وموشن جرافيك لمنصات الفيديو القصير.' } },
    { id: 'cinematics', ratio: '16:9', en: { name: 'Cinematics & Commercials', desc: 'Brand films and horizontal commercials.' }, ar: { name: 'السينماتك والإعلانات', desc: 'أفلام للعلامات التجارية وإعلانات أفقية.' } },
    { id: 'ai', ratio: '16:9', en: { name: 'AI Video Production', desc: 'Commercial video made with generative tools, directed shot by shot.' }, ar: { name: 'إنتاج فيديو بالذكاء الاصطناعي', desc: 'فيديو تجاري بأدوات التوليد، متوجّه لقطة بلقطة.' } }
  ],

  /*
    Projects. type 'video' uses a Google Drive file id: the poster is the Drive thumbnail (the video's
    first frame) and the player is Drive's embedded preview. type 'image' uses a local file.
    role / decision: per-project lines the owner still has to write (null shows a "to be added" note).
  */
  projects: (function () {
    var reels = [
      '18UXvuvAaAJlM3aPYRWmX8V55FmsPsESf', '1QgiHJ_azdLWruuoE9jMO9EpA9efkowOd', '1lp5RMQnuRJnQHR-aLl2tcuqhEN-VGFAz',
      '1hJqMXvNdMLRj3fLUlksenUiyVjxjkcXd', '1oZVa4bTa5WYbQypTDP_NRGKgLZYxZxBf', '1Hi5XJexd2l87ctiuf-bAPM5g0ajLsGnW',
      '1St4xGq4Of-Ov5dWYevMU9yCIpy4Is0LG', '1xX5KFgpkiWhnO1OYoYABJYazV9px5HEp', '19lrVSXw56noY0sL60evpQPWBX500dZ2r',
      '1zjFIu6UEhwSPnE2se06PUQ93EBMuh7Lk', '1g8nx_-ssLCulkF7j0xxcCyLhMCAOuLj_', '1Kxg2PZuAl_dB2qWvUwQP7NJqpJcbltvf',
      '1gMZaIyazUicjjC0GfIJoXeG3u4rWMVgf', '1V2JxlM2QpRjFbxSbrjp1pxjhezdwPxS4', '1V-fUlG8j-CgUukNDKonWIVtObP7prwr8',
      '1bimYV9NSmtYEckKv31TFJH0HPys-XjVK', '1ThRSMfmfYGoV049sy2_mH-8Gdb9--i1O', '1KFbFekSvN_tm5V_NNGoXRR4rvfDt3FKl',
      '1GH_em9gdIb_TL7HNq8PBSvYhZPN8wBDG'
    ];
    var list = reels.map(function (id, i) {
      var n = String(i + 1).padStart(2, '0');
      return {
        id: 'ag-reel-' + n, category: 'reels', type: 'video', drive: id, ratio: '9:16', client: 'ag-developers',
        en: { title: 'Reel ' + n, role: 'Editing and motion graphics', decision: null },
        ar: { title: 'ريلز ' + n, role: 'مونتاج وموشن جرافيك', decision: null }
      };
    });
    var social = [
      { file: 'social-01', en: 'Life is commitment', ar: 'الحياة التزام' },
      { file: 'social-02', en: 'Mastery and discipline', ar: 'السيادة والانضباط' },
      { file: 'social-03', en: 'Ambition and speed', ar: 'الطموح والسرعة' },
      { file: 'social-04', en: 'Action and hope', ar: 'العمل والأمل' }
    ];
    social.forEach(function (s) {
      list.push({
        id: s.file, category: 'social', type: 'image', src: 'assets/work/' + s.file + '.webp', ratio: '1:1', client: null,
        en: { title: s.en, role: 'Arabic typography and layout', decision: null },
        ar: { title: s.ar, role: 'تايبوجرافي عربي وتنسيق', decision: null }
      });
    });
    return list;
  })(),

  experience: [
    { period: { en: '2026 – Present', ar: '2026 – الآن' }, company: 'MB Engineering Group', place: { en: 'Dokki, Giza', ar: 'الدقي، الجيزة' },
      en: { role: 'Head of Graphic Design', points: ['Lead visual execution across the group’s subsidiaries.', 'Design integrated campaigns, catalogues, brochures and exhibition stands.'] },
      ar: { role: 'رئيس قسم التصميم الجرافيكي', points: ['قيادة التنفيذ البصري للشركات التابعة للمجموعة.', 'تصميم الحملات المتكاملة والكتالوجات والبروشورات وأجنحة المعارض.'] } },
    { period: { en: '2026 – Present', ar: '2026 – الآن' }, company: 'TRIORA', place: { en: 'Remote', ar: 'عن بعد' },
      en: { role: 'Multimedia Specialist, part-time', points: ['Built the agency’s visual identity and its motion campaigns.'] },
      ar: { role: 'أخصائي مالتي ميديا، دوام جزئي', points: ['بناء الهوية البصرية للوكالة وحملات الموشن الخاصة بها.'] } },
    { period: { en: 'Jan 2026 – Present', ar: 'يناير 2026 – الآن' }, company: null, companyName: { en: 'Dr. Mohamed Maghawry Media', ar: 'د. محمد مغاوري للإنتاج الإعلامي' }, place: { en: 'Remote', ar: 'عن بعد' },
      en: { role: 'Visual Identity & Video Specialist', points: ['Visual identity, social design, YouTube thumbnails and AI-assisted video.'] },
      ar: { role: 'أخصائي هوية بصرية وإنتاج فيديو', points: ['الهوية البصرية وتصميمات السوشيال وصور يوتيوب المصغّرة وفيديو بمساعدة الذكاء الاصطناعي.'] } },
    { period: { en: 'Oct 2025 – 2026', ar: 'أكتوبر 2025 – 2026' }, company: 'AN Marketing', place: { en: 'New Cairo', ar: 'القاهرة الجديدة' },
      en: { role: 'Multimedia Specialist', points: ['Reels, motion graphics and ad designs for digital campaigns.'] },
      ar: { role: 'أخصائي مالتي ميديا', points: ['ريلز وموشن جرافيك وتصميمات إعلانية للحملات الرقمية.'] } },
    { period: { en: 'May 2025 – Present', ar: 'مايو 2025 – الآن' }, company: null, companyName: { en: 'Ministry of Investment and Foreign Trade', ar: 'وزارة الاستثمار والتجارة الخارجية' }, place: { en: 'Cairo', ar: 'القاهرة' },
      en: { role: 'Visual & Multimedia Consultant', points: ['Campaigns for training programmes and international conferences, with a 75% rise in engagement.'] },
      ar: { role: 'استشاري بصري ومالتي ميديا', points: ['حملات للبرامج التدريبية والمؤتمرات الدولية، مع زيادة في التفاعل بنسبة 75%.'] } }
  ],

  // Contact: taken from the design brief. The old site listed different details; confirm before launch.
  contact: {
    email: 'abdelmoneim.ashraf.diab@gmail.com',
    phone: '+20 112 202 6078',
    whatsapp: 'https://wa.me/201122026078',
    socials: [
      { name: 'Behance', url: 'https://www.behance.net/bodadiab' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/abdelmoneimdiab/' },
      { name: 'Instagram', url: 'https://www.instagram.com/a_b_d_e_l_moneimdiab_/' },
      { name: 'YouTube', url: 'https://www.youtube.com/@abdelmoneimashraf' },
      { name: 'TikTok', url: 'https://www.tiktok.com/@abdelmoneimdiab' }
    ],
    reel: 'https://drive.google.com/drive/folders/1jIKtJWc1zTp2mR-sIEPpgVQG-CTPOdEz?usp=sharing'
  },

  ui: {
    en: {
      title: 'Abdelmoneim Diab | Visual & Motion Lab',
      nav: { home: 'Home', work: 'Work', experience: 'Experience', contact: 'Contact' },
      seeWork: 'See the work',
      getInTouch: 'Get in touch',
      clientsLabel: 'Selected clients',
      aboutTitle: 'About me',
      city: 'Cairo',
      available: 'Available for new projects',
      scroll: 'Scroll',
      workTitle: 'Work',
      workIntro: 'Five kinds of work, each shown in the format it was made for.',
      all: 'All',
      client: 'Client',
      role: 'Role',
      decision: 'Visual decision',
      toAdd: 'To be added',
      independent: 'Independent',
      emptyCat: 'Projects for this category are being prepared.',
      play: 'Play',
      view: 'View',
      close: 'Close',
      experienceTitle: 'Experience',
      experienceIntro: 'Where I have worked and what I was responsible for.',
      education: 'Education',
      contactTitle: 'Let’s make something people stop for.',
      contactIntro: 'For projects, roles and collaborations.',
      email: 'Email',
      phone: 'Phone and WhatsApp',
      elsewhere: 'Elsewhere',
      reel: 'Video reel',
      based: 'Based in Cairo, Egypt',
      ndaNote: 'Some agency and corporate work is under NDA and can be shown privately.',
      ratios: { '9:16': 'Reels', '4:5': 'Social', '16:9': 'Commercials' },
      langLabel: 'Language'
    },
    ar: {
      title: 'عبد المنعم دياب | معمل بصري وموشن',
      nav: { home: 'الرئيسية', work: 'الأعمال', experience: 'الخبرات', contact: 'تواصل' },
      seeWork: 'شوف الأعمال',
      getInTouch: 'تواصل معايا',
      clientsLabel: 'عملاء اشتغلت معاهم',
      aboutTitle: 'عنّي',
      city: 'القاهرة',
      available: 'متاح لمشاريع جديدة',
      scroll: 'انزل',
      workTitle: 'الأعمال',
      workIntro: 'خمس أنواع من الشغل، كل نوع معروض بالمقاس اللي اتعمل له.',
      all: 'الكل',
      client: 'العميل',
      role: 'دوري',
      decision: 'القرار البصري',
      toAdd: 'هيتضاف قريب',
      independent: 'شغل مستقل',
      emptyCat: 'مشاريع القسم ده بتتجهّز.',
      play: 'تشغيل',
      view: 'عرض',
      close: 'إغلاق',
      experienceTitle: 'الخبرات',
      experienceIntro: 'الأماكن اللي اشتغلت فيها وكنت مسؤول عن إيه.',
      education: 'التعليم',
      contactTitle: 'يلا نعمل حاجة توقّف اللي بيتفرج.',
      contactIntro: 'للمشاريع والوظائف والتعاون.',
      email: 'البريد الإلكتروني',
      phone: 'التليفون وواتساب',
      elsewhere: 'حساباتي',
      reel: 'فيديو الأعمال',
      based: 'مقيم في القاهرة، مصر',
      ndaNote: 'جزء من شغل الوكالات والشركات تحت اتفاقية سرية، وممكن أعرضه بشكل خاص.',
      ratios: { '9:16': 'ريلز', '4:5': 'سوشيال', '16:9': 'إعلانات' },
      langLabel: 'اللغة'
    }
  }
};
