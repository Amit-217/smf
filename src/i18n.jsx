import { createContext, useContext, useEffect, useState } from 'react';

// All public-facing text lives here, one object per language with identical shape.
const en = {
  logo: { src: '/logo-en.webp', alt: 'Save Maharashtra — Protect Nature, Protect Future.' },
  switchTo: 'मराठी',
  switchLabel: 'मराठीत पहा',
  locale: 'en-IN',
  nav: { issues: 'Issues', about: 'About', focus: 'Focus Areas', campaigns: 'Campaigns', privacy: 'Privacy Policy', menu: 'Menu', admin: 'Admin', login: 'Login', logout: 'Logout', hi: 'Hi', friend: 'friend' },
  footer: {
    tagline: 'Protect Nature, Protect Future.',
    note: 'Information on issue pages is compiled from published news reports and public documents, with every source linked. Government and company positions are included. Found an error? Tell us.',
    status: 'Save Maharashtra is a citizen initiative started in November 2026. It is not yet a registered organisation.',
  },
  notFound: 'Page not found.',
  goHome: 'Go home',
  home: {
    title: 'Development should not cost us our rivers, forests and hills.',
    intro: 'Save Maharashtra is a new citizen initiative, started in November 2026. This website brings together publicly reported information about environmental issues across Maharashtra — what is happening, why, what it could destroy, and what people on the ground are recording — with links to every source.',
    ctaIssues: 'See the issues',
    ctaAbout: 'About us',
    pillarsTitle: 'What we want to do',
    pillars: [
      { name: 'Protect', text: 'Forests, rivers, wildlife and natural resources.' },
      { name: 'Investigate', text: 'Pollution, mining, water consumption and environmental violations.' },
      { name: 'Act', text: 'Awareness, complaints, conservation and legal advocacy.' },
    ],
    hotTitle: 'Hot topics',
    hotBadge: 'Hot',
    issuesTitle: 'Environmental issues in Maharashtra',
    all: 'All',
    priority: { high: 'Urgent', medium: 'Active', watch: 'Watch' },
    status: 'Status',
  },
  issue: {
    back: '← All issues',
    loading: 'Loading issue…',
    status: 'Status',
    notReported: 'Not reported',
    overview: 'Overview',
    proposed: 'What is proposed',
    cause: 'Why it is happening',
    effects: 'Potential impacts',
    gov: 'Government / developer position',
    disputed: 'Disputed points',
    questions: 'Open questions',
    timeline: 'Timeline',
    sources: 'Sources',
    news: 'Latest news',
    background: 'Background',
    keyFacts: 'Key facts',
    source: 'Source',
    sourcesNote: 'Each source is labelled by type. Advocacy sources show the position of campaigners, not established fact.',
    sourceTypes: { government: 'Government', court: 'Court', company: 'Company', news: 'News', advocacy: 'Advocacy', research: 'Research' },
    media: 'Photos & videos from citizens',
    noMedia: 'No photos or videos have been published for this issue yet.',
    noVideoSupport: 'Your browser does not support video playback.',
    report: 'Report',
    reported: 'Report received. Thank you.',
    shareTitle: 'Share a photo or video',
    shareIntro: 'Seen this on the ground? Share it. Every upload is checked before it is published, and your name is never shown publicly.',
    loginToShare: 'Log in to share photos or videos',
    file: 'Photo or video',
    fileHelp: (imgMb, vidMb) => `Photos (JPG, PNG, WebP, HEIC) up to ${imgMb} MB · videos (MP4, WebM, MOV) up to ${vidMb} MB`,
    fileType: 'Please choose a photo or a video file.',
    titleLabel: 'Title',
    descLabel: 'What does it show? Where and when was it taken? (optional)',
    submit: 'Upload for review',
    uploading: (pct) => `Uploading… ${pct}%`,
    uploaded: 'Thank you! Your upload will appear here after it has been reviewed.',
  },
  login: {
    title: 'Log in',
    intro: 'We’ll email you a one-time sign-in code. No password needed.',
    sent: 'If the address is valid, a sign-in code has been sent. Check your inbox and spam folder.',
    email: 'Email address',
    sending: 'Sending…',
    send: 'Send sign-in code',
    code: 'Six-digit code',
    verifying: 'Verifying…',
    verify: 'Verify and log in',
    otherEmail: 'Use a different email',
    back: 'Back to issues',
  },
  about: {
    title: 'About Save Maharashtra',
    lead: 'Save Maharashtra is a new citizen initiative, started in November 2026, that wants to help protect Maharashtra’s forests, rivers, hills, wildlife, biodiversity and natural resources.',
    leadMore: 'We are just getting started.',
    nowTitle: 'Where we are today',
    now: [
      'We started in November 2026.',
      'We are not yet a registered organisation (not a trust, society or Section 8 company). We may register in the future.',
      'We do not accept donations or membership fees.',
      'We have not yet carried out any field investigations, complaints, legal cases or campaigns.',
      'Today, this website brings together publicly reported information about environmental issues, with links to every source, and lets citizens share photos and videos.',
    ],
    sections: [
      { h: 'Our aim', p: 'To help protect Maharashtra’s natural environment through research, public participation, awareness and evidence-based advocacy.' },
      { h: 'Our vision', p: 'A greener, cleaner and environmentally responsible Maharashtra where development respects nature, natural resources are protected, industries operate responsibly and future generations inherit a healthy environment.' },
      { h: 'Our approach', p: 'We believe in informed environmental action. We want to research, document and raise concerns through transparent, scientific and lawful methods, working with citizens, experts, communities and government authorities.' },
      { h: 'Our stand', p: 'We are not against development. We stand against irresponsible development that destroys forests, pollutes rivers, exhausts water resources, damages biodiversity and compromises the future of our environment.' },
    ],
    principlesTitle: 'Our principles',
    principles: [
      'Nature must be protected.',
      'Natural resources must not be exploited irresponsibly.',
      'Environmental laws must be respected.',
      'Industries must be accountable for environmental impacts.',
      'Government decisions should be transparent.',
      'Citizens should have access to environmental information.',
      'Environmental claims must be supported by evidence.',
      'Development and conservation should coexist.',
    ],
    methodTitle: 'How we plan to work',
    methodLead: 'This is how we intend to work as the initiative grows. These steps have not been carried out yet.',
    method: [
      { h: 'Identify', p: 'Issues raised by citizens, news, government reports, researchers and field visits.' },
      { h: 'Investigate', p: 'Photographs, videos, locations, official documents, public records and expert opinion.' },
      { h: 'Verify', p: 'RTI applications, government portals, environmental clearances, MPCB records and scientific reports — before any allegation is published.' },
      { h: 'Report', p: 'Verified reports covering the issue, location, impact, evidence, applicable rules and responsible authorities.' },
      { h: 'Act', p: 'Official complaints, representations to authorities, public awareness and, where legally justified, the National Green Tribunal.' },
    ],
    evidenceNote: 'We will always distinguish between suspected violations, documented violations and officially established violations.',
    commitment: 'Protecting nature is not just an environmental responsibility. It is a responsibility towards every generation.',
  },
  focus: {
    title: 'Our focus areas',
    lead: 'Six areas where we believe Maharashtra’s natural heritage is under the most pressure, and where we want to focus.',
    areas: [
      { h: 'Forest & tree conservation', items: ['Illegal deforestation and unauthorised tree cutting', 'Forest land encroachment', 'Destruction of natural habitats', 'Protection of the Western Ghats', 'Native tree plantation'] },
      { h: 'Water resource protection', items: ['Groundwater depletion', 'Excessive industrial water use', 'River and lake pollution', 'Industrial wastewater discharge', 'Wetland destruction and rural water scarcity'] },
      { h: 'Industrial pollution monitoring', items: ['Air and water pollution', 'Hazardous waste and chemical discharge', 'Noise pollution', 'Environmental compliance', 'Community health risks'] },
      { h: 'Mining & hill protection', items: ['Illegal mining and stone quarrying', 'Excessive sand and riverbed mining', 'Hill cutting', 'Damage to eco-sensitive zones'] },
      { h: 'Wildlife & biodiversity', items: ['Wildlife habitats and endangered species', 'Birds and animals', 'Wetlands and grasslands', 'Ecological corridors'] },
      { h: 'Sustainable development', items: ['Environmentally responsible infrastructure', 'Renewable energy and water-efficient industry', 'Transparent Environmental Impact Assessments', 'Sustainable urban planning'] },
    ],
    dcTitle: 'Special focus: data centres and water',
    dcText: 'Large data centres can need significant water, especially where water-based cooling is used. We want transparency on actual consumption, water source, groundwater extraction, recycling, wastewater management, environmental permissions and the impact on nearby communities.',
    sectorsTitle: 'What we want to look into',
    sectorHead: ['Sector', 'Questions we want answered'],
    sectors: [
      ['Data centres', 'Water consumption, electricity use, cooling systems'],
      ['Mining', 'Illegal mining, hill destruction, environmental permissions'],
      ['Industries', 'Air pollution, water pollution, waste disposal'],
      ['Construction', 'Tree cutting, land-use change, environmental clearances'],
      ['Infrastructure', 'Forest diversion, biodiversity impact'],
      ['Rivers', 'Industrial discharge, sewage, contamination'],
      ['Agriculture', 'Groundwater depletion, soil degradation'],
      ['Urban development', 'Green spaces, tree cover, water resources'],
    ],
  },
  campaigns: {
    title: 'Planned campaigns',
    lead: 'Campaigns we hope to start in the future. None of them has started yet.',
    list: [
      { h: 'Save Our Forests', p: 'Forest protection.' },
      { h: 'Save Our Rivers', p: 'River conservation.' },
      { h: 'Save Our Hills', p: 'Preventing illegal mining and hill destruction.' },
      { h: 'Water Watch Maharashtra', p: 'Monitoring water consumption and conservation.' },
      { h: 'Industrial Pollution Watch', p: 'Documenting industrial pollution.' },
      { h: 'Green Maharashtra', p: 'Tree and biodiversity conservation.' },
      { h: 'Wildlife Protection Maharashtra', p: 'Protecting wildlife habitats.' },
      { h: 'Environmental Transparency Initiative', p: 'Public access to environmental information.' },
    ],
    phasesTitle: 'Where we hope to work',
    phases: ['Phase 1 — Pune and Latur', 'Phase 2 — Major districts of Maharashtra', 'Phase 3 — A statewide environmental network', 'Phase 4 — Collaboration with environmental organisations and research institutions'],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 1 November 2026',
    intro: 'Save Maharashtra is a citizen initiative started in November 2026. It is not yet a registered organisation. This page explains, in plain words, what information this website collects, why, and what control you have over it.',
    sections: [
      { h: 'If you only read the website', items: [
        'You do not need an account to read the website.',
        'Your language choice (English or Marathi) is saved in your own browser so the site remembers it. It is not sent to us.',
        'We do not use advertising or tracking cookies, and we do not use analytics tools.',
        'To show fonts and the map, your browser loads them from Google Fonts and OpenStreetMap. Like any website, those services receive your IP address when your browser contacts them.',
      ] },
      { h: 'If you log in', items: [
        'We ask for your email address only to send you a one-time login code. We store your email address so you can log in again.',
        'Login codes are stored only in scrambled (hashed) form and expire after 10 minutes.',
        'After you log in, we place one cookie in your browser to keep you logged in for up to 30 days. Logging out removes it.',
        'Your email address is never shown publicly and is never given to other visitors.',
      ] },
      { h: 'If you share a photo or video', items: [
        'We store the file together with the title and description you give it, the issue it belongs to, and which account uploaded it.',
        'Nothing you upload is shown publicly until it has been reviewed and approved.',
        'The public website never shows who uploaded a photo or video. Only the site administrators can see which account uploaded it, so that misuse can be handled.',
        'Do not upload anything that shows people’s faces, homes or private details without their consent. Photos and videos can contain hidden location data. Please remove it before uploading if you do not want to share it.',
        'If an upload is rejected or removed, the file is deleted; a short record (title, date, account) is kept. Unfinished uploads are deleted automatically after 24 hours.',
        'If logged-in visitors report a published photo or video, we record which accounts reported it, so the same person cannot report it twice.',
      ] },
      { h: 'Services that store data for us', items: [
        'Our database hosting provider stores accounts, issue pages and upload records.',
        'Cloudinary stores and delivers uploaded photos and videos.',
        'Our email provider sends login codes.',
        'Our web hosting provider runs the website and may keep standard technical logs (such as IP addresses) for security.',
        'News articles about environmental issues are summarised automatically using AI services (Google Gemini or Groq). Only public news articles are sent to them, never your personal information.',
      ] },
      { h: 'What we do not do', items: [
        'We do not sell or rent your information.',
        'We do not use your information for advertising.',
        'We do not accept donations, so we hold no payment information.',
      ] },
      { h: 'Your choices', items: [
        'You can ask us to delete your account, your uploads, or both. You can also ask what information we hold about you.',
        'To make a request, reply to any login-code email you have received from us, from the same email address.',
      ] },
      { h: 'Changes to this policy', items: [
        'We are a new initiative and the website will change. If this policy changes, we will update this page and the date at the top.',
      ] },
    ],
  },
};

const mr = {
  logo: { src: '/logo-mr.webp', alt: 'सेव्ह महाराष्ट्र — निसर्ग वाचवा, भविष्य वाचवा.' },
  switchTo: 'English',
  switchLabel: 'View in English',
  locale: 'mr-IN',
  nav: { issues: 'प्रश्न', about: 'आमच्याबद्दल', focus: 'कार्यक्षेत्रे', campaigns: 'मोहिमा', privacy: 'गोपनीयता धोरण', menu: 'मेनू', admin: 'ॲडमिन', login: 'लॉग इन', logout: 'लॉग आउट', hi: 'नमस्कार', friend: 'मित्रा' },
  footer: {
    tagline: 'निसर्ग वाचवा, भविष्य वाचवा.',
    note: 'प्रश्नांविषयीची माहिती प्रकाशित बातम्या आणि सार्वजनिक कागदपत्रांतून संकलित केली असून प्रत्येक स्रोताची लिंक दिली आहे. शासन व कंपन्यांची भूमिकाही दिली आहे. काही चूक आढळल्यास आम्हाला कळवा.',
    status: 'सेव्ह महाराष्ट्र हा नोव्हेंबर 2026 मध्ये सुरू झालेला नागरिकांचा उपक्रम आहे. ही अद्याप नोंदणीकृत संस्था नाही.',
  },
  notFound: 'पान सापडले नाही.',
  goHome: 'मुख्यपृष्ठावर जा',
  home: {
    title: 'विकासाची किंमत आपल्या नद्या, जंगले आणि डोंगरांनी मोजू नये.',
    intro: 'सेव्ह महाराष्ट्र हा नोव्हेंबर 2026 मध्ये सुरू झालेला नागरिकांचा नवा उपक्रम आहे. महाराष्ट्रातील पर्यावरणीय प्रश्नांबाबत सार्वजनिकरीत्या प्रसिद्ध झालेली माहिती — काय घडत आहे, का घडत आहे, त्यातून काय नष्ट होऊ शकते आणि स्थानिक नागरिक काय नोंदवत आहेत — ही वेबसाइट प्रत्येक स्रोताच्या लिंकसह एकत्र मांडते.',
    ctaIssues: 'प्रश्न पहा',
    ctaAbout: 'आमच्याबद्दल',
    pillarsTitle: 'आम्हाला काय करायचे आहे',
    pillars: [
      { name: 'संरक्षण', text: 'जंगले, नद्या, वन्यजीव आणि नैसर्गिक संसाधने.' },
      { name: 'तपास', text: 'प्रदूषण, खाणकाम, पाण्याचा वापर आणि पर्यावरणीय उल्लंघने.' },
      { name: 'कृती', text: 'जनजागृती, तक्रारी, संवर्धन आणि कायदेशीर पाठपुरावा.' },
    ],
    hotTitle: 'चर्चेतील प्रश्न',
    hotBadge: 'चर्चेत',
    issuesTitle: 'महाराष्ट्रातील पर्यावरणीय प्रश्न',
    all: 'सर्व',
    priority: { high: 'तातडीचे', medium: 'सक्रिय', watch: 'लक्ष ठेवून' },
    status: 'स्थिती',
  },
  issue: {
    back: '← सर्व प्रश्न',
    loading: 'माहिती लोड होत आहे…',
    status: 'स्थिती',
    notReported: 'नोंद नाही',
    overview: 'आढावा',
    proposed: 'काय प्रस्तावित आहे',
    cause: 'हे का होत आहे',
    effects: 'संभाव्य परिणाम',
    gov: 'शासन / विकासकाची भूमिका',
    disputed: 'वादग्रस्त मुद्दे',
    questions: 'अनुत्तरित प्रश्न',
    timeline: 'घटनाक्रम',
    sources: 'स्रोत',
    news: 'ताज्या बातम्या',
    background: 'पार्श्वभूमी',
    keyFacts: 'महत्त्वाची माहिती',
    source: 'स्रोत',
    sourcesNote: 'प्रत्येक स्रोताचा प्रकार नमूद केला आहे. आंदोलक/स्वयंसेवी संघटनांचे स्रोत त्यांची भूमिका दर्शवतात, सिद्ध तथ्य नव्हे.',
    sourceTypes: { government: 'शासकीय', court: 'न्यायालय', company: 'कंपनी', news: 'बातमी', advocacy: 'आंदोलक संघटना', research: 'संशोधन' },
    media: 'नागरिकांनी पाठवलेले फोटो व व्हिडिओ',
    noMedia: 'या प्रश्नावर अद्याप कोणताही फोटो किंवा व्हिडिओ प्रकाशित झालेला नाही.',
    noVideoSupport: 'तुमचा ब्राउझर व्हिडिओ प्ले करू शकत नाही.',
    report: 'तक्रार करा',
    reported: 'तक्रार मिळाली. धन्यवाद.',
    shareTitle: 'फोटो किंवा व्हिडिओ शेअर करा',
    shareIntro: 'तुम्ही हे प्रत्यक्ष पाहिले आहे का? शेअर करा. प्रत्येक फाइल तपासूनच प्रकाशित केली जाते, आणि तुमचे नाव कधीही सार्वजनिकरीत्या दाखवले जात नाही.',
    loginToShare: 'फोटो किंवा व्हिडिओ शेअर करण्यासाठी लॉग इन करा',
    file: 'फोटो किंवा व्हिडिओ',
    fileHelp: (imgMb, vidMb) => `फोटो (JPG, PNG, WebP, HEIC) ${imgMb} MB पर्यंत · व्हिडिओ (MP4, WebM, MOV) ${vidMb} MB पर्यंत`,
    fileType: 'कृपया फोटो किंवा व्हिडिओ फाइल निवडा.',
    titleLabel: 'शीर्षक',
    descLabel: 'यात काय दिसते? कुठे आणि केव्हा घेतले? (ऐच्छिक)',
    submit: 'तपासणीसाठी अपलोड करा',
    uploading: (pct) => `अपलोड होत आहे… ${pct}%`,
    uploaded: 'धन्यवाद! तपासणीनंतर तुमची फाइल येथे दिसेल.',
  },
  login: {
    title: 'लॉग इन',
    intro: 'आम्ही तुम्हाला ईमेलवर एकदाच वापरता येणारा कोड पाठवू. पासवर्डची गरज नाही.',
    sent: 'ईमेल पत्ता योग्य असल्यास लॉग इन कोड पाठवला आहे. इनबॉक्स आणि स्पॅम फोल्डर तपासा.',
    email: 'ईमेल पत्ता',
    sending: 'पाठवत आहे…',
    send: 'लॉग इन कोड पाठवा',
    code: 'सहा अंकी कोड',
    verifying: 'तपासत आहे…',
    verify: 'तपासा आणि लॉग इन करा',
    otherEmail: 'दुसरा ईमेल वापरा',
    back: 'प्रश्नांकडे परत',
  },
  about: {
    title: 'सेव्ह महाराष्ट्रबद्दल',
    lead: 'सेव्ह महाराष्ट्र हा नोव्हेंबर 2026 मध्ये सुरू झालेला नागरिकांचा नवा उपक्रम आहे. महाराष्ट्रातील जंगले, नद्या, डोंगर, वन्यजीव, जैवविविधता आणि नैसर्गिक संसाधनांच्या रक्षणासाठी हातभार लावणे हा आमचा उद्देश आहे.',
    leadMore: 'आम्ही नुकतीच सुरुवात केली आहे.',
    nowTitle: 'आज आम्ही कुठे आहोत',
    now: [
      'आम्ही नोव्हेंबर 2026 मध्ये सुरुवात केली.',
      'आम्ही अद्याप नोंदणीकृत संस्था नाही (ट्रस्ट, सोसायटी किंवा सेक्शन 8 कंपनी नाही). भविष्यात नोंदणी करू शकतो.',
      'आम्ही कोणत्याही प्रकारच्या देणग्या किंवा सदस्यत्व शुल्क स्वीकारत नाही.',
      'आम्ही अद्याप कोणतीही प्रत्यक्ष पाहणी, तक्रार, कायदेशीर प्रकरण किंवा मोहीम राबवलेली नाही.',
      'सध्या ही वेबसाइट पर्यावरणीय प्रश्नांबाबत सार्वजनिकरीत्या प्रसिद्ध झालेली माहिती प्रत्येक स्रोताच्या लिंकसह एकत्र मांडते आणि नागरिकांना फोटो व व्हिडिओ शेअर करू देते.',
    ],
    sections: [
      { h: 'आमचा उद्देश', p: 'संशोधन, लोकसहभाग, जनजागृती आणि पुराव्यांवर आधारित पाठपुरावा यांद्वारे महाराष्ट्राच्या नैसर्गिक पर्यावरणाच्या रक्षणासाठी हातभार लावणे.' },
      { h: 'आमची दृष्टी', p: 'एक हिरवागार, स्वच्छ आणि पर्यावरणाबाबत जबाबदार महाराष्ट्र — जिथे विकास निसर्गाचा आदर करतो, नैसर्गिक संसाधने सुरक्षित राहतात, उद्योग जबाबदारीने चालतात आणि पुढच्या पिढ्यांना निरोगी पर्यावरण मिळते.' },
      { h: 'आमचा दृष्टिकोन', p: 'आमचा विश्वास माहितीपूर्ण पर्यावरणीय कृतीवर आहे. पारदर्शक, शास्त्रीय आणि कायदेशीर मार्गाने संशोधन, दस्तऐवजीकरण करून प्रश्न मांडण्याची आमची इच्छा आहे — नागरिक, तज्ज्ञ, समुदाय आणि शासकीय यंत्रणांसोबत काम करून.' },
      { h: 'आमची भूमिका', p: 'आम्ही विकासाच्या विरोधात नाही. जंगले नष्ट करणाऱ्या, नद्या प्रदूषित करणाऱ्या, जलस्रोत संपवणाऱ्या, जैवविविधतेची हानी करणाऱ्या आणि पर्यावरणाचे भविष्य धोक्यात आणणाऱ्या बेजबाबदार विकासाच्या विरोधात आम्ही उभे आहोत.' },
    ],
    principlesTitle: 'आमची तत्त्वे',
    principles: [
      'निसर्गाचे रक्षण झालेच पाहिजे.',
      'नैसर्गिक संसाधनांचे बेजबाबदार शोषण होऊ नये.',
      'पर्यावरण कायद्यांचा आदर झाला पाहिजे.',
      'उद्योगांनी पर्यावरणीय परिणामांची जबाबदारी घेतली पाहिजे.',
      'शासकीय निर्णय पारदर्शक असावेत.',
      'नागरिकांना पर्यावरणविषयक माहिती उपलब्ध असावी.',
      'पर्यावरणविषयक दावे पुराव्यांवर आधारित असावेत.',
      'विकास आणि संवर्धन एकत्र नांदले पाहिजेत.',
    ],
    methodTitle: 'आम्ही कसे काम करण्याचे ठरवले आहे',
    methodLead: 'उपक्रम वाढत जाईल तसे आम्ही अशा पद्धतीने काम करू इच्छितो. यातील कोणतीही पायरी अद्याप राबवलेली नाही.',
    method: [
      { h: 'ओळख', p: 'नागरिक, बातम्या, शासकीय अहवाल, संशोधक आणि प्रत्यक्ष पाहणीतून समोर आलेले प्रश्न.' },
      { h: 'तपास', p: 'छायाचित्रे, व्हिडिओ, ठिकाणांची माहिती, अधिकृत कागदपत्रे, सार्वजनिक नोंदी आणि तज्ज्ञांची मते.' },
      { h: 'पडताळणी', p: 'कोणताही आरोप प्रकाशित करण्यापूर्वी माहिती अधिकार अर्ज, शासकीय पोर्टल, पर्यावरण परवानग्या, MPCB च्या नोंदी आणि शास्त्रीय अहवाल.' },
      { h: 'अहवाल', p: 'प्रश्न, ठिकाण, परिणाम, पुरावे, लागू नियम आणि जबाबदार यंत्रणा यांचा समावेश असलेले पडताळलेले अहवाल.' },
      { h: 'कृती', p: 'अधिकृत तक्रारी, यंत्रणांकडे निवेदने, जनजागृती आणि कायदेशीरदृष्ट्या योग्य असल्यास राष्ट्रीय हरित लवाद.' },
    ],
    evidenceNote: 'संशयित उल्लंघन, दस्तऐवजीकृत उल्लंघन आणि अधिकृतरीत्या सिद्ध झालेले उल्लंघन यांतील फरक आम्ही नेहमी स्पष्ट ठेवू.',
    commitment: 'निसर्गाचे रक्षण ही केवळ पर्यावरणीय जबाबदारी नाही. ती प्रत्येक पिढीप्रती असलेली जबाबदारी आहे.',
  },
  focus: {
    title: 'आमची कार्यक्षेत्रे',
    lead: 'महाराष्ट्राच्या नैसर्गिक वारशावर सर्वाधिक दबाव आहे असे आम्हाला वाटते आणि ज्यांवर आम्ही लक्ष केंद्रित करू इच्छितो अशी सहा क्षेत्रे.',
    areas: [
      { h: 'जंगल व वृक्ष संवर्धन', items: ['बेकायदा जंगलतोड आणि अनधिकृत वृक्षतोड', 'वनजमिनीवरील अतिक्रमण', 'नैसर्गिक अधिवासांचा नाश', 'पश्चिम घाटाचे संरक्षण', 'देशी वृक्षलागवड'] },
      { h: 'जलस्रोत संरक्षण', items: ['भूजल पातळीतील घट', 'उद्योगांचा अतिरिक्त पाणीवापर', 'नदी व तलाव प्रदूषण', 'औद्योगिक सांडपाणी', 'पाणथळींचा नाश आणि ग्रामीण पाणीटंचाई'] },
      { h: 'औद्योगिक प्रदूषणावर लक्ष', items: ['हवा व जल प्रदूषण', 'घातक कचरा आणि रासायनिक विसर्ग', 'ध्वनी प्रदूषण', 'पर्यावरणीय नियमांचे पालन', 'समुदायाच्या आरोग्याला धोका'] },
      { h: 'खाणकाम व डोंगर संरक्षण', items: ['बेकायदा खाणकाम आणि दगडखाणी', 'अतिरिक्त वाळू उपसा व नदीपात्रातील खाणकाम', 'डोंगर फोड', 'पर्यावरण-संवेदनशील क्षेत्रांची हानी'] },
      { h: 'वन्यजीव व जैवविविधता', items: ['वन्यजीव अधिवास आणि संकटग्रस्त प्रजाती', 'पक्षी आणि प्राणी', 'पाणथळी आणि गवताळ प्रदेश', 'वन्यजीव भ्रमणमार्ग'] },
      { h: 'शाश्वत विकास', items: ['पर्यावरणपूरक पायाभूत सुविधा', 'अक्षय ऊर्जा आणि पाणी-कार्यक्षम उद्योग', 'पारदर्शक पर्यावरण परिणाम मूल्यांकन', 'शाश्वत नगररचना'] },
    ],
    dcTitle: 'विशेष लक्ष: डेटा सेंटर आणि पाणी',
    dcText: 'मोठ्या डेटा सेंटरना, विशेषतः पाण्यावर आधारित शीतकरण वापरल्यास, मोठ्या प्रमाणात पाणी लागू शकते. प्रत्यक्ष पाणीवापर, पाण्याचा स्रोत, भूजल उपसा, पुनर्वापर, सांडपाणी व्यवस्थापन, पर्यावरण परवानग्या आणि आसपासच्या समुदायांवरील परिणाम याबाबत पारदर्शकता असावी, असे आम्हाला वाटते.',
    sectorsTitle: 'आम्हाला कशाचा अभ्यास करायचा आहे',
    sectorHead: ['क्षेत्र', 'आम्हाला उत्तरे हवी असलेले प्रश्न'],
    sectors: [
      ['डेटा सेंटर', 'पाणीवापर, वीजवापर, शीतकरण यंत्रणा'],
      ['खाणकाम', 'बेकायदा खाणकाम, डोंगरांचा नाश, पर्यावरण परवानग्या'],
      ['उद्योग', 'हवा प्रदूषण, जल प्रदूषण, कचरा विल्हेवाट'],
      ['बांधकाम', 'वृक्षतोड, जमीनवापरातील बदल, पर्यावरण मंजुरी'],
      ['पायाभूत सुविधा', 'वनजमीन वळवणे, जैवविविधतेवरील परिणाम'],
      ['नद्या', 'औद्योगिक विसर्ग, सांडपाणी, प्रदूषण'],
      ['शेती', 'भूजल घट, जमिनीची धूप व ऱ्हास'],
      ['नागरी विकास', 'हरित क्षेत्रे, वृक्षाच्छादन, जलस्रोत'],
    ],
  },
  campaigns: {
    title: 'नियोजित मोहिमा',
    lead: 'भविष्यात सुरू करण्याची आमची इच्छा असलेल्या मोहिमा. यातील कोणतीही मोहीम अद्याप सुरू झालेली नाही.',
    list: [
      { h: 'आपली जंगले वाचवा', p: 'जंगलांचे संरक्षण.' },
      { h: 'आपल्या नद्या वाचवा', p: 'नद्यांचे संवर्धन.' },
      { h: 'आपले डोंगर वाचवा', p: 'बेकायदा खाणकाम आणि डोंगर फोड रोखणे.' },
      { h: 'वॉटर वॉच महाराष्ट्र', p: 'पाणीवापर आणि जलसंवर्धनावर लक्ष.' },
      { h: 'औद्योगिक प्रदूषण वॉच', p: 'औद्योगिक प्रदूषणाचे दस्तऐवजीकरण.' },
      { h: 'हरित महाराष्ट्र', p: 'वृक्ष आणि जैवविविधता संवर्धन.' },
      { h: 'वन्यजीव संरक्षण महाराष्ट्र', p: 'वन्यजीव अधिवासांचे रक्षण.' },
      { h: 'पर्यावरण पारदर्शकता उपक्रम', p: 'पर्यावरणविषयक माहिती जनतेसाठी खुली करणे.' },
    ],
    phasesTitle: 'आम्ही कुठे काम करू इच्छितो',
    phases: ['टप्पा १ — पुणे आणि लातूर', 'टप्पा २ — महाराष्ट्रातील प्रमुख जिल्हे', 'टप्पा ३ — राज्यव्यापी पर्यावरण नेटवर्क', 'टप्पा ४ — पर्यावरण संस्था आणि संशोधन संस्थांसोबत सहकार्य'],
  },
  privacy: {
    title: 'गोपनीयता धोरण',
    updated: 'शेवटचा बदल: 1 नोव्हेंबर 2026',
    intro: 'सेव्ह महाराष्ट्र हा नोव्हेंबर 2026 मध्ये सुरू झालेला नागरिकांचा उपक्रम आहे. ही अद्याप नोंदणीकृत संस्था नाही. ही वेबसाइट कोणती माहिती गोळा करते, का करते आणि त्यावर तुमचे कोणते नियंत्रण आहे, हे या पानावर सोप्या भाषेत सांगितले आहे.',
    sections: [
      { h: 'तुम्ही फक्त वेबसाइट वाचत असाल तर', items: [
        'वेबसाइट वाचण्यासाठी खाते लागत नाही.',
        'तुम्ही निवडलेली भाषा (इंग्रजी किंवा मराठी) तुमच्याच ब्राउझरमध्ये जतन केली जाते, जेणेकरून साइट ती लक्षात ठेवते. ती आमच्याकडे पाठवली जात नाही.',
        'आम्ही जाहिरात किंवा ट्रॅकिंग कुकीज वापरत नाही आणि कोणतीही ॲनालिटिक्स साधने वापरत नाही.',
        'फॉन्ट आणि नकाशा दाखवण्यासाठी तुमचा ब्राउझर ते Google Fonts आणि OpenStreetMap वरून घेतो. इतर कोणत्याही वेबसाइटप्रमाणे, तुमचा ब्राउझर संपर्क करताना या सेवांना तुमचा IP पत्ता मिळतो.',
      ] },
      { h: 'तुम्ही लॉग इन केल्यास', items: [
        'आम्ही तुमचा ईमेल पत्ता फक्त एकदाच वापरता येणारा लॉग इन कोड पाठवण्यासाठी विचारतो. तुम्ही पुन्हा लॉग इन करू शकावे म्हणून तो जतन केला जातो.',
        'लॉग इन कोड फक्त सांकेतिक (hashed) स्वरूपात साठवले जातात आणि 10 मिनिटांत कालबाह्य होतात.',
        'लॉग इन केल्यानंतर तुम्हाला 30 दिवसांपर्यंत लॉग इन ठेवण्यासाठी तुमच्या ब्राउझरमध्ये एक कुकी ठेवली जाते. लॉग आउट केल्यावर ती काढली जाते.',
        'तुमचा ईमेल पत्ता कधीही सार्वजनिकरीत्या दाखवला जात नाही आणि इतर अभ्यागतांना दिला जात नाही.',
      ] },
      { h: 'तुम्ही फोटो किंवा व्हिडिओ शेअर केल्यास', items: [
        'आम्ही फाइलसोबत तुम्ही दिलेले शीर्षक व वर्णन, ती कोणत्या प्रश्नाशी संबंधित आहे आणि कोणत्या खात्यातून अपलोड केली, ही माहिती जतन करतो.',
        'तुम्ही अपलोड केलेली कोणतीही फाइल तपासून मंजूर होईपर्यंत सार्वजनिकरीत्या दाखवली जात नाही.',
        'फोटो किंवा व्हिडिओ कोणी अपलोड केला हे सार्वजनिक वेबसाइटवर कधीही दाखवले जात नाही. गैरवापर रोखता यावा म्हणून फक्त साइटच्या ॲडमिनना ते दिसते.',
        'लोकांचे चेहरे, घरे किंवा खासगी माहिती त्यांच्या संमतीशिवाय अपलोड करू नका. फोटो व व्हिडिओमध्ये ठिकाणाची लपलेली माहिती असू शकते. ती शेअर करायची नसल्यास अपलोड करण्यापूर्वी काढून टाका.',
        'अपलोड नाकारल्यास किंवा काढल्यास फाइल हटवली जाते; त्याची छोटी नोंद (शीर्षक, तारीख, खाते) ठेवली जाते. अर्धवट राहिलेले अपलोड 24 तासांनंतर आपोआप हटवले जातात.',
        'लॉग इन केलेल्या अभ्यागतांनी प्रकाशित फोटो किंवा व्हिडिओची तक्रार केल्यास, एकाच व्यक्तीला दोनदा तक्रार करता येऊ नये म्हणून कोणत्या खात्यांनी तक्रार केली याची नोंद ठेवली जाते.',
      ] },
      { h: 'आमच्यासाठी माहिती साठवणाऱ्या सेवा', items: [
        'आमचा डेटाबेस होस्टिंग पुरवठादार खाती, प्रश्नांची पाने आणि अपलोडच्या नोंदी साठवतो.',
        'Cloudinary अपलोड केलेले फोटो व व्हिडिओ साठवते आणि दाखवते.',
        'आमचा ईमेल पुरवठादार लॉग इन कोड पाठवतो.',
        'आमचा वेब होस्टिंग पुरवठादार वेबसाइट चालवतो आणि सुरक्षेसाठी सामान्य तांत्रिक नोंदी (उदा. IP पत्ते) ठेवू शकतो.',
        'पर्यावरणीय प्रश्नांवरील बातम्यांचा सारांश AI सेवांद्वारे (Google Gemini किंवा Groq) आपोआप तयार केला जातो. त्यांना फक्त सार्वजनिक बातम्या पाठवल्या जातात, तुमची वैयक्तिक माहिती कधीही नाही.',
      ] },
      { h: 'आम्ही काय करत नाही', items: [
        'आम्ही तुमची माहिती विकत नाही किंवा भाड्याने देत नाही.',
        'आम्ही तुमची माहिती जाहिरातींसाठी वापरत नाही.',
        'आम्ही देणग्या स्वीकारत नाही, त्यामुळे आमच्याकडे कोणतीही पेमेंट माहिती नसते.',
      ] },
      { h: 'तुमचे पर्याय', items: [
        'तुम्ही तुमचे खाते, तुमचे अपलोड किंवा दोन्ही हटवण्याची विनंती करू शकता. आमच्याकडे तुमची कोणती माहिती आहे हेही विचारू शकता.',
        'विनंती करण्यासाठी, आमच्याकडून आलेल्या कोणत्याही लॉग इन कोड ईमेलला त्याच ईमेल पत्त्यावरून उत्तर द्या.',
      ] },
      { h: 'या धोरणातील बदल', items: [
        'आम्ही नवा उपक्रम आहोत आणि वेबसाइटमध्ये बदल होत राहतील. हे धोरण बदलल्यास आम्ही हे पान आणि वरची तारीख अद्ययावत करू.',
      ] },
    ],
  },
};

const STRINGS = { en, mr };
const STORAGE_KEY = 'sm_lang';
const LangContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved in STRINGS) return saved;
  } catch {
    // storage unavailable (private mode etc.)
  }
  return navigator.language?.toLowerCase().startsWith('mr') ? 'mr' : 'en';
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'mr' ? 'सेव्ह महाराष्ट्र' : 'Save Maharashtra';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const toggle = () => setLang((l) => (l === 'en' ? 'mr' : 'en'));
  return <LangContext.Provider value={{ lang, t: STRINGS[lang], toggle }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// Returns the issue with its Marathi text applied when viewing in Marathi.
// Field by field: anything not yet translated falls back to English.
export function localizeIssue(issue, lang) {
  if (lang !== 'mr' || !issue?.mr) return issue;
  const translated = Object.fromEntries(
    Object.entries(issue.mr).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.trim())),
  );
  return { ...issue, ...translated };
}
