export type Lang = 'en' | 'ru' | 'uz';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hi, I'm",
      name: 'Bjamshid',
      role: 'Frontend Developer',
      bio: 'Crafting high-performance web experiences for 2 years. Passionate about clean code, intuitive interfaces, and modern design.',
      cta: 'View Projects',
      ctaSecondary: 'Get in Touch',
      since: 'Developer since 2009',
    },
    about: {
      title: 'About Me',
      subtitle: 'Who I am',
      p1: "I'm a frontend developer with 2 years of hands-on experience building web applications. I started my journey in 2009 and have been deeply passionate about creating elegant, user-focused digital products.",
      p2: 'I specialize in React, Next.js, and Tailwind CSS — writing clean, maintainable code and translating complex designs into pixel-perfect interfaces.',
      github: 'View GitHub',
    },
    skills: {
      title: 'Skills',
      subtitle: 'My tech stack',
    },
    projects: {
      title: 'Projects',
      subtitle: 'What I have built',
      viewCode: 'Code',
      viewLive: 'Live',
    },
    experience: {
      title: 'Experience',
      subtitle: 'My journey',
    },
    services: {
      title: 'Services',
      subtitle: 'What I offer',
      items: [
        { title: 'Custom Web Apps', desc: 'Scalable, high-performance applications built with modern frameworks.' },
        { title: 'UI / UX Design', desc: 'Pixel-perfect, responsive interfaces that delight users.' },
        { title: 'API Integration', desc: 'Seamless connection of front-ends to any backend or third-party API.' },
      ],
    },
    testimonials: {
      title: 'Testimonials',
      subtitle: 'What clients say',
    },
    contact: {
      title: 'Get in Touch',
      subtitle: "Let's work together",
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      send: 'Send Message',
      sent: 'Message sent!',
    },
    footer: {
      rights: 'All rights reserved.',
      built: 'Built with React & Tailwind',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'Обо мне',
      skills: 'Навыки',
      projects: 'Проекты',
      experience: 'Опыт',
      contact: 'Контакт',
    },
    hero: {
      greeting: 'Привет, я',
      name: 'Bjamshid',
      role: 'Frontend Разработчик',
      bio: '2 года создаю высокопроизводительные веб-приложения. Люблю чистый код, интуитивные интерфейсы и современный дизайн.',
      cta: 'Смотреть Проекты',
      ctaSecondary: 'Связаться',
      since: 'Разработчик с 2009 года',
    },
    about: {
      title: 'Обо Мне',
      subtitle: 'Кто я',
      p1: 'Я frontend разработчик с 2-летним практическим опытом создания веб-приложений. Начал свой путь в 2009 году и глубоко увлечён созданием элегантных цифровых продуктов.',
      p2: 'Специализируюсь на React, Next.js и Tailwind CSS — пишу чистый, поддерживаемый код и воплощаю сложные дизайны в пиксельно-точные интерфейсы.',
      github: 'GitHub Профиль',
    },
    skills: {
      title: 'Навыки',
      subtitle: 'Мой стек технологий',
    },
    projects: {
      title: 'Проекты',
      subtitle: 'Что я создал',
      viewCode: 'Код',
      viewLive: 'Демо',
    },
    experience: {
      title: 'Опыт',
      subtitle: 'Мой путь',
    },
    services: {
      title: 'Услуги',
      subtitle: 'Что я предлагаю',
      items: [
        { title: 'Веб-приложения', desc: 'Масштабируемые, высокопроизводительные приложения на современных фреймворках.' },
        { title: 'UI / UX Дизайн', desc: 'Пиксельно-точные, адаптивные интерфейсы, которые восхищают пользователей.' },
        { title: 'Интеграция API', desc: 'Бесшовное подключение фронтенда к любому бэкенду или стороннему API.' },
      ],
    },
    testimonials: {
      title: 'Отзывы',
      subtitle: 'Что говорят клиенты',
    },
    contact: {
      title: 'Связаться',
      subtitle: 'Давайте работать вместе',
      name: 'Ваше имя',
      email: 'Ваш Email',
      message: 'Ваше сообщение',
      send: 'Отправить',
      sent: 'Сообщение отправлено!',
    },
    footer: {
      rights: 'Все права защищены.',
      built: 'Создано на React и Tailwind',
    },
  },
  uz: {
    nav: {
      home: 'Bosh sahifa',
      about: 'Men haqimda',
      skills: 'Ko\'nikmalar',
      projects: 'Loyihalar',
      experience: 'Tajriba',
      contact: 'Aloqa',
    },
    hero: {
      greeting: 'Salom, men',
      name: 'Bjamshid',
      role: 'Frontend Dasturchi',
      bio: '2 yildan beri yuqori samarali veb ilovalar yaratib kelaman. Toza kod, intuitiv interfeys va zamonaviy dizayn mening yo\'ldoshlarim.',
      cta: 'Loyihalarni Ko\'rish',
      ctaSecondary: 'Bog\'lanish',
      since: '2009 yildan dasturchi',
    },
    about: {
      title: 'Men Haqimda',
      subtitle: 'Kim ekanman',
      p1: 'Men 2 yillik amaliy tajribaga ega frontend dasturchisman. 2009 yilda kodlash yo\'lini boshlagan va elegantli, foydalanuvchiga yo\'naltirilgan raqamli mahsulotlar yaratishga chuqur mehr qo\'yganman.',
      p2: 'React, Next.js va Tailwind CSS da ixtisoslashganman — toza, saqlanadigan kod yozaman va murakkab dizaynlarni piksel-mukammal interfeyslarga aylantiram.',
      github: 'GitHub Profil',
    },
    skills: {
      title: 'Ko\'nikmalar',
      subtitle: 'Texnologiya stackim',
    },
    projects: {
      title: 'Loyihalar',
      subtitle: 'Nima qurdim',
      viewCode: 'Kod',
      viewLive: 'Demo',
    },
    experience: {
      title: 'Tajriba',
      subtitle: 'Mening yo\'lim',
    },
    services: {
      title: 'Xizmatlar',
      subtitle: 'Nima taklif etaman',
      items: [
        { title: 'Maxsus Veb Ilovalar', desc: 'Zamonaviy freymvorklar bilan yaratilgan kengaytirilishi mumkin bo\'lgan ilovalar.' },
        { title: 'UI / UX Dizayn', desc: 'Foydalanuvchilarni quvontiruvchi piksel-mukammal, moslashuvchan interfeyslar.' },
        { title: 'API Integratsiya', desc: 'Frontend va istalgan backend yoki uchinchi tomon API ni muammosiz ulash.' },
      ],
    },
    testimonials: {
      title: 'Fikrlar',
      subtitle: 'Mijozlar nima deydi',
    },
    contact: {
      title: 'Bog\'lanish',
      subtitle: 'Birga ishlaylik',
      name: 'Ismingiz',
      email: 'Emailingiz',
      message: 'Xabaringiz',
      send: 'Yuborish',
      sent: 'Xabar yuborildi!',
    },
    footer: {
      rights: 'Barcha huquqlar himoyalangan.',
      built: 'React va Tailwind bilan yaratildi',
    },
  },
};
