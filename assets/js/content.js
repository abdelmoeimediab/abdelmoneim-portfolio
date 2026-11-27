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
      // Typographic signature: letters in {braces} are set in the italic serif.
      heroNameSig: 'ABDEL M{O}NEIM ASHR{A}F',
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
      // Arabic letters can't be mixed across typefaces without breaking their joins, so the signature
      // here is a whole word set in a different colour.
      heroNameSig: 'عبد {المنعم} أشرف',
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


  /* Creative Circle (home): people Abdelmoneim works with. Display only, no links.
     PLACEHOLDERS: replace image (e.g. 'assets/circle/name.webp', square), names and roles. */
  circle: [
    { image: null, nameEn: 'Collaborator 01', nameAr: 'شريك 01', roleEn: 'Art Director', roleAr: 'مدير فني' },
    { image: null, nameEn: 'Collaborator 02', nameAr: 'شريك 02', roleEn: 'Graphic Designer', roleAr: 'مصمم جرافيك' },
    { image: null, nameEn: 'Collaborator 03', nameAr: 'شريك 03', roleEn: 'Motion Designer', roleAr: 'مصمم موشن' },
    { image: null, nameEn: 'Collaborator 04', nameAr: 'شريك 04', roleEn: 'Social Media Specialist', roleAr: 'أخصائي سوشيال ميديا' },
    { image: null, nameEn: 'Collaborator 05', nameAr: 'شريك 05', roleEn: 'Copywriter', roleAr: 'كاتب محتوى' },
    { image: null, nameEn: 'Collaborator 06', nameAr: 'شريك 06', roleEn: 'Video Editor', roleAr: 'مونتير' },
    { image: null, nameEn: 'Collaborator 07', nameAr: 'شريك 07', roleEn: 'Photographer', roleAr: 'مصور' },
    { image: null, nameEn: 'Collaborator 08', nameAr: 'شريك 08', roleEn: 'Marketing Manager', roleAr: 'مدير تسويق' }
  ],

  /* Clients & industries (home strip) and the full-screen company view (#/client/<id>). Owner-approved copy.
     logo: full-colour logo on transparency; logoMono: the same in one ink colour (clients strip). null = name as wordmark.
     nameAr / aboutAr may contain <bdi dir="ltr"> for Latin brand names (HTML allowed).
     roleEn / roleAr: Abdelmoneim's role for that client ('' shows "To be added").
     categories: [{ key, labelEn, labelAr, introEn, introAr, items: [project ids from `projects`] }], only what was produced. */
  companies: (function () {
    var MB_ROLE_EN = 'Visual design as Head of Graphic Design at MB Engineering Group.';
    var MB_ROLE_AR = 'التصميم البصري من خلال رئاسة قسم التصميم في مجموعة <bdi dir="ltr">MB Engineering Group</bdi>.';
    function logo(id) { return { logo: 'assets/logos/' + id + '.webp', logoMono: 'assets/logos/' + id + '-mono.webp' }; }
    function co(o, l) { if (l) { o.logo = l.logo; o.logoMono = l.logoMono; } else { o.logo = null; o.logoMono = null; } o.categories = o.categories || []; return o; }
    return [
      co({ id: 'mb-engineering', nameEn: 'MB Engineering Group', nameAr: 'مجموعة إم بي للهندسة (<bdi dir="ltr">MB Engineering Group</bdi>)',
        industryEn: 'Engineering, Industrial & Electrical Holding Group', industryAr: 'مجموعة هندسية وصناعية وكهربائية',
        aboutEn: 'Founded in 1981 and listed on the Egyptian Exchange, MB Engineering Group is a leading Egyptian industrial and engineering group operating across electrical manufacturing, distribution, logistics, and EV charging, serving Egypt and over 20 export markets.',
        aboutAr: 'مجموعة هندسية وصناعية مصرية رائدة تأسست عام 1981 ومدرجة في البورصة المصرية، تعمل في تصنيع وتوزيع الأنظمة الكهربائية واللوجستيات وشحن السيارات الكهربائية، وتخدم السوق المصري وأكثر من 20 سوقاً تصديرياً.',
        roleEn: 'Head of Graphic Design: visual execution across the group’s subsidiaries.', roleAr: 'رئيس قسم التصميم: التنفيذ البصري لكل الشركات التابعة للمجموعة.' }, logo('mb-engineering')),
      co({ id: 'sha7en', nameEn: 'Sha7en EV Solutions', nameAr: 'شاحن لحلول المركبات الكهربائية (<bdi dir="ltr">Sha7en EV Solutions</bdi>)',
        industryEn: 'EV Charging Infrastructure & E-Mobility', industryAr: 'البنية التحتية لشحن السيارات الكهربائية',
        aboutEn: 'The electric mobility arm of MB Engineering Group, operating one of Egypt’s largest EV charging networks with 270+ charging points across 14 governorates, alongside charger supply, installation, and digital out-of-home (DOOH) advertising.',
        aboutAr: 'ذراع التنقل الكهربائي لمجموعة <bdi dir="ltr">MB</bdi> للهندسة، وتدير واحدة من أكبر شبكات شحن السيارات الكهربائية في مصر بأكثر من 270 نقطة شحن في 14 محافظة، بجانب توريد وتركيب الشواحن وإعلانات الشاشات الرقمية.',
        roleEn: MB_ROLE_EN, roleAr: MB_ROLE_AR }, logo('sha7en')),
      co({ id: 'mb-logistics', nameEn: 'MB Logistics', nameAr: 'إم بي للخدمات اللوجستية (<bdi dir="ltr">MB Logistics</bdi>)',
        industryEn: 'Third-Party Logistics (3PL) & Supply Chain', industryAr: 'الخدمات اللوجستية وسلاسل الإمداد',
        aboutEn: 'Established in 2017, MB Logistics delivers end-to-end warehousing, order fulfillment, and nationwide distribution across Cairo, the Delta, and Upper Egypt through 3 distribution centers and a 50+ vehicle fleet.',
        aboutAr: 'تأسست عام 2017 وتقدم حلولاً متكاملة للتخزين وتجهيز الطلبات والتوزيع على مستوى الجمهورية عبر 3 مراكز توزيع وأسطول يزيد عن 50 مركبة لخدمة التجارة الإلكترونية والشركات.',
        roleEn: MB_ROLE_EN, roleAr: MB_ROLE_AR }, logo('mb-logistics')),
      co({ id: 'mb-industrial', nameEn: 'MB Industrial (MBI)', nameAr: 'إم بي للصناعة (<bdi dir="ltr">MB Industrial</bdi>)',
        industryEn: 'Electrical Equipment & Switchgear Manufacturing', industryAr: 'تصنيع المعدات واللوحات الكهربائية',
        aboutEn: 'The manufacturing arm of MB Engineering Group, producing low-voltage switchgear, distribution boards, enclosures, and EV charging hardware, and serving as Egypt’s exclusive licensed panel builder for France’s Hager.',
        aboutAr: 'الذراع الصناعي لمجموعة <bdi dir="ltr">MB</bdi> للهندسة، وتتخصص في تصنيع لوحات الجهد المنخفض والمفاتيح الكهربائية وشواحن السيارات الكهربائية، وتُعد المصنّع الحصري المعتمد لشركة <bdi dir="ltr">Hager</bdi> الفرنسية في مصر.',
        roleEn: MB_ROLE_EN, roleAr: MB_ROLE_AR }, logo('mb-industrial')),
      co({ id: 'mb-electrical', nameEn: 'MB Electrical Systems', nameAr: 'إم بي للأنظمة الكهربائية (<bdi dir="ltr">MB Electrical Systems</bdi>)',
        industryEn: 'Electrical Trading & Commercial Distribution', industryAr: 'تجارة وتوزيع الأنظمة الكهربائية',
        aboutEn: 'The commercial trading and distribution arm of MB Engineering Group, representing global electrical brands in Egypt with over 1,000 certified SKUs serving contractors and commercial projects nationwide.',
        aboutAr: 'ذراع التجارة والتوزيع بالمجموعة، وتمثل كبرى العلامات الكهربائية العالمية في السوق المصري بكتالوج يتجاوز 1,000 منتج معتمد لخدمة المقاولين والمشروعات التجارية.',
        roleEn: MB_ROLE_EN, roleAr: MB_ROLE_AR }, logo('mb-electrical')),
      co({ id: 'beta-electric', nameEn: 'Beta Electric / BETA Cables', nameAr: 'بيتا إلكتريك وكابلات بيتا (<bdi dir="ltr">Beta Electric</bdi>)',
        industryEn: 'Electrical Cables & Low-Voltage Products', industryAr: 'تصنيع الكابلات والمنتجات الكهربائية',
        aboutEn: 'MB Engineering Group’s dedicated low-voltage product brand and cable-manufacturing subsidiary producing building wires, power cables, and control cables with a 5,000-ton annual capacity compliant with international IEC and BS standards.',
        aboutAr: 'العلامة التجارية للمنتجات الكهربائية منخفضة الجهد ومصنع كابلات <bdi dir="ltr">BETA</bdi> التابع للمجموعة، المتخصص في إنتاج أسلاك المباني وكابلات القوى والتحكم بطاقة إنتاجية 5,000 طن سنوياً وفق المعايير الدولية.',
        roleEn: MB_ROLE_EN, roleAr: MB_ROLE_AR }, logo('beta-electric')),
      co({ id: 'ag-developers', nameEn: 'AG Developments', nameAr: 'إيه جي للتطوير العقاري (<bdi dir="ltr">AG Developments</bdi>)',
        industryEn: 'Real Estate Development', industryAr: 'التطوير العقاري',
        aboutEn: 'An Egyptian real estate developer with over 15 years of market experience, specializing in commercial, administrative, and medical mall developments in El Shorouk City including Castle Mall, Capital Mall, and East Plaza Mall.',
        aboutAr: 'شركة تطوير عقاري مصرية بخبرة تتجاوز 15 عاماً في السوق، متخصصة في تطوير المولات التجارية والإدارية والطبية في مدينة الشروق ومن أبرز مشروعاتها <bdi dir="ltr">Castle Mall</bdi> و<bdi dir="ltr">Capital Mall</bdi> و<bdi dir="ltr">East Plaza Mall</bdi>.',
        roleEn: 'Video editing and motion graphics for launch and project reels.', roleAr: 'مونتاج وموشن جرافيك لريلز الإطلاق والمشاريع.',
        categories: [
          { key: 'videos', labelEn: 'Videos', labelAr: 'فيديوهات', introEn: '', introAr: '',
            items: ['ag-reel-01', 'ag-reel-02', 'ag-reel-03', 'ag-reel-04', 'ag-reel-05', 'ag-reel-06', 'ag-reel-07', 'ag-reel-08', 'ag-reel-09', 'ag-reel-10',
                    'ag-reel-11', 'ag-reel-12', 'ag-reel-13', 'ag-reel-14', 'ag-reel-15', 'ag-reel-16', 'ag-reel-17', 'ag-reel-18', 'ag-reel-19'] }
        ] }, logo('ag-developers')),
      co({ id: 'owl-properties', nameEn: 'OWL Properties', nameAr: 'أول بروبرتيز (<bdi dir="ltr">OWL Properties</bdi>)',
        industryEn: 'Real Estate Brokerage & Consultancy', industryAr: 'التسويق والاستشارات العقارية',
        aboutEn: 'A New Cairo-based real estate brokerage and advisory platform helping buyers compare projects, compounds, and payment plans across New Cairo, North Coast, Ain Sokhna, New Capital, and Sheikh Zayed.',
        aboutAr: 'شركة استشارات وتسويق عقاري في القاهرة الجديدة تساعد العملاء على مقارنة المشروعات والكمبوندات وخطط السداد في القاهرة الجديدة والساحل الشمالي والعين السخنة والعاصمة الإدارية والشيخ زايد.',
        roleEn: '', roleAr: '' }, logo('owl-properties')),
      co({ id: 'sky-city', nameEn: 'Sky City El Galala', nameAr: 'سكاي سيتي الجلالة (<bdi dir="ltr">Sky City El Galala</bdi>)',
        industryEn: 'Mountain Tourism Resort & Real Estate', industryAr: 'منتجع سياحي وتطوير عقاري',
        aboutEn: 'An integrated 282-acre mountain-top residential and tourism resort by Pyramids Developments on the Galala Plateau in Ain Sokhna, situated 750 meters above sea level with panoramic Red Sea views, lagoons, and terraced architecture.',
        aboutAr: 'منتجع سياحي وسكني متكامل على مساحة 282 فداناً من تطوير <bdi dir="ltr">Pyramids Developments</bdi> على هضبة الجلالة بالعين السخنة بارتفاع 750 متراً فوق سطح البحر بإطلالات بانورامية على البحر الأحمر وبحيرات صناعية ومصاطب متدرجة.',
        roleEn: '', roleAr: '' }, logo('sky-city')),
      co({ id: 'whwm', short: 'WHWM', nameEn: 'World Hotel World Management (WHWM)', nameAr: 'وورلد هوتيل وورلد مانجمنت (<bdi dir="ltr">WHWM</bdi>)',
        industryEn: 'Hospitality & Facility Management', industryAr: 'إدارة الفنادق والضيافة والمنشآت',
        aboutEn: 'A French-Egyptian hospitality and facility management company based at Grand Square Mall in Cairo, specializing in operating and managing hotels, resorts, commercial buildings, and residential destinations to French hospitality standards.',
        aboutAr: 'شركة مصرية فرنسية لإدارة الفنادق والمنشآت مقرها <bdi dir="ltr">Grand Square Mall</bdi>، متخصصة في تشغيل وإدارة الفنادق والمنتجعات والمباني التجارية والسكنية وفق معايير الضيافة الفرنسية.',
        roleEn: '', roleAr: '' }),
      co({ id: 'essec-solar', nameEn: 'ESSEC Solar Engineering', nameAr: 'إيسيك للطاقة الشمسية (<bdi dir="ltr">ESSEC Solar</bdi>)',
        industryEn: 'Renewable Energy & Solar Engineering', industryAr: 'الطاقة المتجددة وهندسة الطاقة الشمسية',
        aboutEn: 'An Egyptian solar energy engineering firm delivering end-to-end design, installation, and maintenance for grid-tied and off-grid solar plants, solar irrigation pumps, solar water heating, desalination, and backup UPS systems.',
        aboutAr: 'شركة مصرية متخصصة في هندسة وحلول الطاقة الشمسية، تقدم خدمات التصميم والتركيب والصيانة لمحطات الطاقة الشمسية وطلمبات الري بالطاقة الشمسية وسخانات المياه الشمسية وأنظمة التحلية والطاقة الاحتياطية.',
        roleEn: '', roleAr: '' }),
      co({ id: 'rentex', nameEn: 'Rentex', nameAr: 'رنتكس لتأجير السيارات (<bdi dir="ltr">Rentex</bdi>)',
        industryEn: 'Car Rental & Corporate Fleet Services', industryAr: 'تأجير السيارات وخدمات الأساطيل',
        aboutEn: 'Founded in 2015 in 6th of October City, Rentex is an Egyptian car rental company providing daily, monthly, and corporate vehicle rentals with or without a driver across Greater Cairo and Giza branches.',
        aboutAr: 'شركة مصرية لتأجير السيارات تأسست عام 2015 في 6 أكتوبر، تقدم خدمات التأجير اليومي والشهري وتأجير أساطيل الشركات بسائق أو بدون عبر فروعها في القاهرة الكبرى والجيزة.',
        roleEn: '', roleAr: '' }),
      co({ id: 'an-marketing', nameEn: 'AN Marketing Agency', nameAr: 'إيه إن للتسويق الرقمي (<bdi dir="ltr">AN Marketing Agency</bdi>)',
        industryEn: 'Digital Marketing & Branding Agency', industryAr: 'وكالة تسويق رقمي وبراندنج',
        aboutEn: 'A New Cairo-based full-service digital marketing and branding agency founded in 2020, specializing in social media campaigns, brand identity, content production, and strategy across real estate, healthcare, and media sectors.',
        aboutAr: 'وكالة تسويق رقمي وبراندنج متكاملة تأسست عام 2020 في القاهرة الجديدة، متخصصة في حملات السوشيال ميديا والهوية البصرية وصناعة المحتوى لقطاعات العقارات والرعاية الصحية والإعلام.',
        roleEn: 'Multimedia Specialist: reels, motion graphics and ad designs for digital campaigns.', roleAr: 'أخصائي مالتي ميديا: ريلز وموشن جرافيك وتصميمات إعلانية للحملات الرقمية.' }),
      co({ id: 'triora', nameEn: 'Triora Agency', nameAr: 'تريورا إيجنسي (<bdi dir="ltr">Triora Agency</bdi>)',
        industryEn: 'Creative & Marketing Agency', industryAr: 'وكالة إبداعية وتسويقية',
        aboutEn: 'A strategy-first creative and marketing agency based in 6th of October City, partnering with brands on social media management, content strategy, video production, brand photography, and graphic design.',
        aboutAr: 'وكالة إبداعية وتسويقية في مدينة 6 أكتوبر تعتمد منهجية استراتيجية في إدارة السوشيال ميديا وصناعة المحتوى وإنتاج الفيديو والتصوير الإعلاني والتصميم الجرافيكي.',
        roleEn: 'Multimedia Specialist (part-time): the agency’s own visual identity and motion campaigns.', roleAr: 'أخصائي مالتي ميديا (دوام جزئي): الهوية البصرية للوكالة نفسها وحملات الموشن.' }),
      co({ id: 'kosharista', nameEn: 'Kosharista', nameAr: 'كشريستا (<bdi dir="ltr">Kosharista</bdi>)',
        industryEn: 'Food & Beverage — Egyptian Restaurant', industryAr: 'مطاعم ومأكولات مصرية',
        aboutEn: 'A modern Egyptian koshary restaurant located in Champs Elysees Mall in the New Administrative Capital, serving signature koshary portions for dine-in, plaza seating, and delivery.',
        aboutAr: 'مطعم كشري مصري عصري يقع في مول شانزليزيه بالعاصمة الإدارية الجديدة، يقدم الكشري المصري بأحجام متنوعة مع خدمة الصالة والجلسات الخارجية والتوصيل.',
        roleEn: '', roleAr: '' }, logo('kosharista')),
      co({ id: 'lafah-w-lazah', nameEn: 'Lafah w Lazah', nameAr: 'لفة ولذة (<bdi dir="ltr">Lafah w Lazah</bdi>)',
        industryEn: 'Food & Beverage — Fast-Casual Street Food', industryAr: 'مطاعم ومأكولات سريعة',
        aboutEn: 'An Egyptian fast-casual restaurant at Champs Elysees Mall in the New Administrative Capital, specializing in freshly pan-cooked spiced meat and signature Egyptian street-food sandwiches.',
        aboutAr: 'مطعم مأكولات سريعة مصرية في مول شانزليزيه بالعاصمة الإدارية الجديدة، متخصص في الساندوتشات المصرية الطازجة والمطبوخة على الجريل بخلطات وصوصات مميزة.',
        roleEn: '', roleAr: '' }),
      co({ id: 'planet-of-skills', nameEn: 'Planet of Skills', nameAr: 'كوكب المهارات (<bdi dir="ltr">Planet of Skills</bdi>)',
        industryEn: 'Kids’ Education & Animated Digital Media', industryAr: 'تعليم الأطفال والإعلام الرقمي التفاعلي',
        aboutEn: 'An Egyptian kids’ educational media brand producing short-form animated podcast episodes and visual explainers that teach children life skills, social awareness, healthy habits, and science concepts in Arabic and English.',
        aboutAr: 'علامة إعلامية تعليمية مصرية للأطفال تنتج حلقات بودكاست قصيرة وفيديوهات أنيميشن تفاعلية لتنمية المهارات الحياتية والاجتماعية وتبسيط المفاهيم العلمية للأطفال بالعربية والإنجليزية.',
        roleEn: '', roleAr: '' }),
      co({ id: 'maghawry', nameEn: 'Dr. Mohamed Maghawry', nameAr: 'د. محمد مغاوري',
        industryEn: 'Public Figure — Islamic Vocalist & Content Creator', industryAr: 'شخصية عامة — منشد أزهري وصانع محتوى',
        aboutEn: 'A prominent Egyptian Al-Azhar-affiliated Islamic vocalist (Munshid), Quran reciter, and dentist with a combined audience exceeding 600K+ followers on Facebook and 140K+ subscribers on YouTube, known for nasheeds and cultural anthems.',
        aboutAr: 'منشد أزهري ومبتهل وقارئ للقرآن الكريم وطبيب أسنان مصري شهير، يتابعه أكثر من 600 ألف متابع على فيسبوك و144 ألف مشترك على يوتيوب، ويشتهر بالأناشيد الدينية والمناسبات الرمضانية والجامعية.',
        roleEn: 'Visual identity, social design, YouTube thumbnails and AI-assisted video.', roleAr: 'الهوية البصرية وتصميمات السوشيال وصور يوتيوب المصغّرة وفيديو بمساعدة الذكاء الاصطناعي.' })
    ];
  })(),

  // Projects shown in the curved carousel at the top of the Work page (ids from `projects`).
  featured: ['social-01', 'ag-reel-01', 'social-02', 'ag-reel-05', 'social-03', 'ag-reel-09', 'social-04', 'ag-reel-14'],

  /* About info list (home). type: 'text' | 'count' (animated number) | 'clock' (live Cairo time).
     PLACEHOLDERS to confirm with the owner: services wording, availability, and the fun fact. */
  info: [
    { type: 'text', en: { k: 'Services', v: 'Graphic design, motion graphics, video and AI production' }, ar: { k: 'الخدمات', v: 'تصميم جرافيك، موشن جرافيك، فيديو وإنتاج بالذكاء الاصطناعي' } },
    { type: 'count', value: 4, suffix: '+', en: { k: 'Experience', v: 'years' }, ar: { k: 'الخبرة', v: 'سنين' } },
    { type: 'count', value: 12, suffix: '', en: { k: 'Clients', v: 'brands and companies' }, ar: { k: 'العملاء', v: 'علامة وشركة' } },
    { type: 'clock', en: { k: 'Based in', v: 'Cairo, Egypt' }, ar: { k: 'مقيم في', v: 'القاهرة، مصر' } },
    { type: 'text', en: { k: 'Availability', v: 'Open for new projects' }, ar: { k: 'التوفر', v: 'متاح لمشاريع جديدة' } },
    { type: 'count', value: 250, suffix: 'K+', en: { k: 'Frames rendered', v: '' }, ar: { k: 'فريمات اتعملت', v: '' } }
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
      hello: 'Hi there',
      edition: 'Portfolio 2026',
      menu: 'Menu',
      menuClose: 'Close',
      navSig: { home: 'H{O}ME', work: 'W{O}RK', experience: 'EXPER{I}ENCE', contact: 'C{O}NTACT' },
      workGiant: 'W{O}RK',
      selected: 'Selected pieces',
      footName: 'ABDEL M{O}NEIM ASHR{A}F',
      rights: 'All rights reserved.',
      circleTitle: 'CREATIVE C{I}RCLE',
      clientsTitle: 'Clients & industries',
      clientsIntro: 'The companies I have worked with, and the industries they work in. Open one to see what I made for it.',
      open: 'Open',
      back: '← Back to Home',
      aboutCompany: 'About the company',
      industry: 'Industry',
      myRole: 'My role',
      pending: 'To be added',
      storyPending: 'The story behind this work is being written: the challenge, why it was made, and how it was produced with the team.',
      itemsPending: 'Work for this category is being prepared.',
      producedFor: 'Produced for',
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
      hello: 'أهلًا',
      edition: 'بورتفوليو 2026',
      menu: 'القائمة',
      menuClose: 'إغلاق',
      navSig: { home: 'الرئيسية', work: 'الأعمال', experience: 'الخبرات', contact: 'تواصل' },
      workGiant: 'الأعمال',
      selected: 'مختارات',
      footName: 'عبد {المنعم} أشرف',
      rights: 'كل الحقوق محفوظة.',
      circleTitle: 'شركــاء الإبــداع',
      clientsTitle: 'العملاء والمجالات',
      clientsIntro: 'الشركات اللي اشتغلت معاها، والمجالات اللي بتشتغل فيها. افتح أي شركة وشوف عملت لها إيه.',
      open: 'افتح',
      back: 'العودة للرئيسية →',
      aboutCompany: 'عن الشركة',
      industry: 'المجال',
      myRole: 'دوري',
      pending: 'هيتضاف قريب',
      storyPending: 'قصة الشغل ده بتتكتب: التحدي، وليه اتعمل، وإزاي اتنفّذ مع الفريق.',
      itemsPending: 'شغل القسم ده بيتجهّز.',
      producedFor: 'اتعمل لـ',
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
