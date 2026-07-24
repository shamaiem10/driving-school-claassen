import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];
const viewport = { once: true, amount: 0.22 };
const springButton = { type: 'spring', stiffness: 220, damping: 24, mass: 0.8 };
const springIcon = { type: 'spring', stiffness: 300, damping: 18, mass: 0.6 };

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Kurse', href: '#kurse' },
  { label: 'Theoriezeiten', href: '#theoriezeiten' },
  { label: 'News', href: '#news' },
  { label: 'Anmeldung & Kontakt', href: '#kontakt' }
];

const routeSteps = [
  { number: '01', title: 'Anmeldung', icon: 'bi bi-clipboard-check' },
  { number: '02', title: 'Theorie', icon: 'bi bi-book' },
  { number: '03', title: 'Praxis', icon: 'bi bi-cone-striped' },
  { number: '04', title: 'Prüfung', icon: 'bi bi-flag' }
];

const newsItems = [
  {
    title: 'The Cost of Insurance',
    category: 'General',
    image: 'https://fahrschule-claassen.de/wp-content/uploads/2019/01/blogpost-newlegislation.jpg'
  },
  {
    title: 'The Old Fashioned 10 and 2',
    category: 'General',
    image: 'https://fahrschule-claassen.de/wp-content/uploads/2019/01/blogpost-ten.jpg'
  },
  {
    title: 'New Driver Legislation',
    category: 'Legislation',
    image: 'https://fahrschule-claassen.de/wp-content/uploads/2019/01/blog-newdriver.jpg'
  }
];

function imageError(event) {
  event.currentTarget.style.display = 'none';
  const fallback = event.currentTarget.nextElementSibling;
  if (fallback) fallback.style.display = 'grid';
}

function RevealImage({ src, alt, className = '', style }) {
  return (
    <div className={`image-shell ${className}`}>
      <motion.img src={src} alt={alt} onError={imageError} style={style} />
      <div className="image-fallback" aria-hidden="true">
        <i className="bi bi-car-front" />
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.header
      className="site-header"
      initial={{ opacity: 0, y: reduced ? 0 : -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.45, ease: reduced ? 'linear' : ease }}
    >
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label="Fahrschule Joh. Claassen – Home">
          <div className="brand-image-shell">
            <img
              src="https://fahrschule-claassen.de/wp-content/uploads/2024/12/Fahrschule-300x115.png"
              alt="Fahrschule Joh. Claassen Logo"
              onError={imageError}
            />
            <span className="brand-fallback">Joh. Claassen</span>
          </div>
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: reduced ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.2 : 0.45, delay: reduced ? 0 : index * 0.055, ease }}
              whileHover={reduced ? {} : { y: -2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        <motion.button
          className="menu-button"
          type="button"
          aria-label="Navigation öffnen"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          animate={reduced ? {} : { rotate: open ? 90 : 0, scale: open ? [1, 0.92, 1] : 1 }}
          transition={{ duration: 0.32, ease }}
        >
          <i className={open ? 'bi bi-x-lg' : 'bi bi-list'} />
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: reduced ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={{ duration: reduced ? 0.2 : 0.28, ease }}
          >
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rawImageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-8, 8]);
  const imageY = useSpring(rawImageY, { stiffness: 120, damping: 24, mass: 0.7 });
  const rawContentY = useTransform(scrollYProgress, [0.55, 1], reduced ? [0, 0] : [0, -12]);
  const contentY = useSpring(rawContentY, { stiffness: 120, damping: 26 });
  const contentOpacity = useTransform(scrollYProgress, [0.55, 1], reduced ? [1, 1] : [1, 0.72]);
  const words = ['Willkommen', 'bei', 'der', 'Fahrschule', 'Joh.', 'Claassen'];

  return (
    <section id="home" ref={ref} className="hero">
      <motion.div
        className="hero-mesh"
        animate={reduced ? {} : { backgroundSize: ['100% 100%', '108% 108%', '100% 100%'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="container hero-grid">
        <motion.div className="hero-copy" style={{ y: contentY, opacity: contentOpacity }}>
          <motion.p
            className="eyebrow location-label"
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.6, ease }}
          >
            <motion.i className="bi bi-geo-alt" whileHover={reduced ? {} : { y: -3, rotate: -6 }} transition={springIcon} />
            Deine Fahrschule in Kleve
          </motion.p>
          <h1>
            {words.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: reduced ? 0 : 18, rotate: reduced ? 0 : 1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: reduced ? 0.2 : 0.55, delay: reduced ? 0 : index * 0.065, ease }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.5, delay: reduced ? 0 : 0.51, ease: 'easeOut' }}
          >
            Dein Weg zum Führerschein! Bei uns lernst du sicher und entspannt fahren.
          </motion.p>
          <div className="roadline" aria-hidden="true">
            <svg viewBox="0 0 500 30" preserveAspectRatio="none">
              <motion.path
                d="M2 15 H470"
                pathLength="1"
                strokeDasharray="0.08 0.05"
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : 0.16, ease: 'easeOut' }}
              />
              <motion.path
                d="M462 7 L476 15 L462 23"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: reduced ? 0 : [0, 5, 0] }}
                transition={{ opacity: { delay: 0.8 }, x: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
              />
            </svg>
          </div>
          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: reduced ? 0 : 0.34 } }
            }}
          >
            <motion.a
              className="button button-primary"
              href="#kontakt"
              variants={{
                hidden: { opacity: 0, x: reduced ? 0 : 24, scale: reduced ? 1 : 0.98 },
                visible: { opacity: 1, x: 0, scale: 1, transition: reduced ? { duration: 0.2 } : springButton }
              }}
              whileHover={reduced ? {} : { y: -3, scale: 1.03 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
            >
              Jetzt anmelden <i className="bi bi-arrow-right" />
            </motion.a>
            <motion.a
              className="button phone-pill"
              href="tel:+491722623660"
              variants={{
                hidden: { opacity: 0, x: reduced ? 0 : 24, scale: reduced ? 1 : 0.98 },
                visible: { opacity: 1, x: 0, scale: 1, transition: reduced ? { duration: 0.2 } : springButton }
              }}
              whileHover={reduced ? {} : { y: -2, scale: 1.03 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
            >
              <motion.i
                className="bi bi-telephone"
                whileHover={reduced ? {} : { rotate: [0, -10, 8, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
              />
              +49 (172) 2623660
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-image-frame"
          initial={{ opacity: 0, x: reduced ? 0 : 36, scale: reduced ? 1 : 1.04 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.9, delay: reduced ? 0 : 0.12, ease }}
          whileHover={reduced ? {} : { y: -4, scale: 1.008 }}
        >
          <RevealImage
            src="https://fahrschule-claassen.de/wp-content/uploads/2019/02/blog-choosecar.jpg"
            alt="Auto auf der Straße"
            className="hero-photo"
            style={{ y: imageY }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function RouteSection({ id = 'home-route', courses = false }) {
  const reduced = useReducedMotion();
  return (
    <section id={id} className={`section route-section ${courses ? 'courses-route' : ''}`}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: reduced ? 0.2 : 0.55, ease }}
        >
          <span className="eyebrow">{courses ? 'So läuft’s ab' : 'Schritt für Schritt'}</span>
          <h2>{courses ? 'Deine Route' : 'Route zum Führerschein'}</h2>
        </motion.div>
        <div className="route-wrap">
          <motion.div
            className="route-road"
            initial={{ scaleX: reduced ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: reduced ? 0.2 : 0.9, delay: reduced ? 0 : 0.15, ease: 'easeOut' }}
          />
          <motion.div
            className="route-grid"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{ visible: { transition: { staggerChildren: reduced ? 0 : courses ? 0.11 : 0.12 } } }}
          >
            {routeSteps.map((step) => (
              <motion.article
                key={step.title}
                className="route-card"
                tabIndex="0"
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : 28, scale: reduced ? 1 : 0.96 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0.2 : 0.58, ease } }
                }}
                whileHover={reduced ? {} : { y: -6, scale: 1.02 }}
              >
                <span className="route-number">{step.number}</span>
                <motion.span
                  className="route-icon"
                  initial={{ scale: reduced ? 1 : 0.7, rotate: reduced ? 0 : -12 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={viewport}
                  transition={springIcon}
                >
                  <i className={step.icon} />
                </motion.span>
                <h3>{step.title}</h3>
              </motion.article>
            ))}
          </motion.div>
        </div>
        {courses && (
          <motion.a
            className="button button-dark route-enroll"
            href="#kontakt"
            whileHover={reduced ? {} : { y: -3, scale: 1.03 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
          >
            Zur Anmeldung <i className="bi bi-arrow-right" />
          </motion.a>
        )}
      </div>
    </section>
  );
}

function CourseTeasers() {
  const reduced = useReducedMotion();
  const cards = [
    { title: 'Auto', icon: 'bi bi-car-front', line: 'Sicher und entspannt fahren.' },
    { title: 'Motorrad', icon: 'bi bi-helmet', line: 'Schritt für Schritt zum Führerschein.' }
  ];

  return (
    <section id="kurse" className="section course-teasers">
      <div className="container">
        <motion.div className="section-heading" initial={{ opacity: 0, y: reduced ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: reduced ? 0.2 : 0.5, ease }}>
          <span className="eyebrow">Kurse</span>
          <h2>Auto oder Motorrad</h2>
          <p>Wir bieten die folgenden Kurse an.</p>
        </motion.div>
        <motion.div className="course-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.14 } } }}>
          {cards.map((card) => (
            <motion.article
              key={card.title}
              className="course-card"
              tabIndex="0"
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 30, scale: reduced ? 1 : 0.95, rotate: reduced ? 0 : -1 },
                visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: reduced ? 0.2 : 0.62, ease } }
              }}
              whileHover={reduced ? {} : { y: -8, scale: 1.025, rotate: -0.4 }}
            >
              <motion.i className={card.icon} whileHover={reduced ? {} : card.title === 'Auto' ? { x: [0, 7, 0], rotate: [0, 2, 0] } : { rotate: -7, scale: 1.1 }} transition={card.title === 'Auto' ? { duration: 0.55 } : springIcon} />
              <h3>{card.title}</h3>
              <ul className="check-list">
                <li><i className="bi bi-check-lg" /> {card.line}</li>
                <li><i className="bi bi-check-lg" /> Unsere Fahrlehrer begleiten dich.</li>
              </ul>
              <motion.a className="button button-primary course-link" href={card.title === 'Auto' ? '#courses-auto' : '#courses-motorcycle'} whileHover={reduced ? {} : { scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.96 }}>
                Kursinfo <i className="bi bi-arrow-right" />
              </motion.a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TheoryStrip() {
  const reduced = useReducedMotion();
  return (
    <section id="theoriezeiten" className="section theory-section">
      <div className="container">
        <motion.div
          className="theory-strip"
          initial={{ opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduced ? 0.2 : 0.55, ease }}
        >
          <motion.div className="fact-block" whileHover={reduced ? {} : { y: -4 }}>
            <motion.i className="bi bi-calendar-event" whileHover={reduced ? {} : { rotate: -5, scale: 1.1 }} transition={springIcon} />
            <div>
              <span>Unterricht</span>
              <h2>Montags und Donnerstags ab <strong>19 Uhr</strong></h2>
            </div>
          </motion.div>
          <motion.div className="lane-divider" initial={{ scaleY: reduced ? 1 : 0 }} whileInView={{ scaleY: 1 }} viewport={viewport} transition={{ duration: reduced ? 0.2 : 0.5, delay: reduced ? 0 : 0.18 }} />
          <motion.div className="fact-block" whileHover={reduced ? {} : { y: -4 }}>
            <motion.i className="bi bi-geo-alt" whileHover={reduced ? {} : { y: [0, -4, 0] }} transition={{ duration: 0.45 }} />
            <div>
              <span>Fahrschule Joh. Claassen</span>
              <h2>Emmericherstraße 270<br />47533 Kleve</h2>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ target, suffix }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.28 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!visible || reduced || target === 0) {
      if (visible || reduced) setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const run = (now) => {
      const progress = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, target]);

  return <span ref={ref} className="stat-value">{value}{suffix}</span>;
}

function Dashboard() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-14, 14]);
  const imageY = useSpring(rawY, { stiffness: 90, damping: 26 });
  const stats = [
    { target: 98, label: 'Bestehensquote', icon: 'bi bi-speedometer' },
    { target: 100, label: 'Weiterempfehlungsrate', icon: 'bi bi-patch-check' },
    { target: 0, label: 'Unfallrate', icon: 'bi bi-shield-check' }
  ];

  return (
    <section id="home-dashboard" ref={ref} className="section dashboard-section">
      <div className="dashboard-media">
        <RevealImage
          src="https://fahrschule-claassen.de/wp-content/uploads/2019/02/blog-safety.jpg"
          alt="Armaturen eines Autos"
          className="dashboard-image"
          style={{ y: imageY }}
        />
      </div>
      <div className="dashboard-duotone" />
      <motion.div className="scan-line" animate={reduced ? {} : { y: [-20, 260] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
      <div className="container dashboard-content">
        <motion.div className="dashboard-heading" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.28 }} transition={{ duration: reduced ? 0.2 : 0.45 }}>
          <span className="eyebrow eyebrow-light">Auf einen Blick</span>
          <h2>Dein Weg. Unsere Begleitung.</h2>
        </motion.div>
        <motion.div className="stats-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.28 }} variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.13 } } }}>
          {stats.map((stat) => (
            <motion.article
              key={stat.label}
              className="stat-card"
              tabIndex="0"
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.94 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0.2 : 0.6, ease } }
              }}
              whileHover={reduced ? {} : { y: -6, scale: 1.025 }}
            >
              <motion.i className={stat.icon} whileHover={reduced ? {} : { scale: 1.1, rotate: stat.target === 100 ? 8 : 0 }} transition={springIcon} />
              <Counter target={stat.target} suffix="%" />
              <strong>{stat.label}</strong>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function QuickContact() {
  const reduced = useReducedMotion();
  return (
    <section id="kontakt" className="section contact-section">
      <div className="container">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: reduced ? 0 : 34, scale: reduced ? 1 : 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduced ? 0.2 : 0.65, ease }}
          whileHover={reduced ? {} : { y: -5, rotate: -0.25 }}
        >
          <div>
            <span className="eyebrow">Schnellkontakt</span>
            <h2>Rufe uns an, um alles zu besprechen.</h2>
            <p>Du möchtest dich anmelden oder hast Fragen? Melde dich bei uns. Wir melden uns umgehend bei dir.</p>
          </div>
          <div className="contact-actions">
            <motion.a className="button button-primary contact-phone" href="tel:+491722623660" whileHover={reduced ? {} : { y: -3, scale: 1.035 }} whileTap={reduced ? {} : { scale: 0.96 }}>
              <motion.i className="bi bi-telephone" whileHover={reduced ? {} : { rotate: [0, -10, 8, 0], scale: [1, 1.14, 1] }} transition={{ duration: 0.4 }} />
              +49 (172) 2623660
            </motion.a>
            <motion.a className="form-link" href="mailto:info@fahrschule-claassen.de" whileHover={reduced ? {} : { x: 4 }} whileTap={reduced ? {} : { scale: 0.97 }}>
              <motion.i className="bi bi-envelope" whileHover={reduced ? {} : { x: 4, rotate: -4 }} transition={springIcon} />
              info@fahrschule-claassen.de <i className="bi bi-arrow-right" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AutoCourse() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-10, 10]);
  const imageY = useSpring(rawY, { stiffness: 100, damping: 25 });

  return (
    <section id="courses-auto" ref={ref} className="section auto-course">
      <div className="container course-overview-grid">
        <motion.div className="course-copy-surface" initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: reduced ? 0.2 : 0.58, ease }} whileHover={reduced ? {} : { y: -4 }}>
          <span className="course-badge"><i className="bi bi-car-front" /> Auto</span>
          <h2>Auto — Kursüberblick</h2>
          <p>Bereit für die Straße? Bei uns lernst du sicher und entspannt fahren.</p>
          <ul className="check-list">
            <li><i className="bi bi-check-lg" /> Dein Weg zum Führerschein</li>
            <li><i className="bi bi-check-lg" /> Schritt für Schritt begleitet</li>
          </ul>
          <motion.a className="button button-primary" href="#kontakt" whileHover={reduced ? {} : { y: -3, scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.97 }}>Zur Anmeldung <i className="bi bi-arrow-right" /></motion.a>
        </motion.div>
        <motion.div className="auto-image-frame" initial={{ opacity: 0, x: reduced ? 0 : 34, y: reduced ? 0 : 12, scale: reduced ? 1 : 0.95, rotate: reduced ? 0 : 1.5 }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }} viewport={viewport} transition={{ duration: reduced ? 0.2 : 0.75, ease }}>
          <div className="backing-plate" />
          <RevealImage
            src="https://fahrschule-claassen.de/wp-content/uploads/2019/01/blogpost-10and2.jpg"
            alt="Mann am Steuer eines Autos"
            className="auto-photo"
            style={{ y: imageY }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function MotorcycleCourse() {
  const reduced = useReducedMotion();
  return (
    <section id="courses-motorcycle" className="section motorcycle-section">
      <div className="container">
        <motion.article
          className="motorcycle-card"
          initial={{ opacity: 0, y: reduced ? 0 : 28, scale: reduced ? 1 : 0.96, rotate: reduced ? 0 : -0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          viewport={viewport}
          transition={{ duration: reduced ? 0.2 : 0.62, ease }}
          whileHover={reduced ? {} : { y: -7, scale: 1.02 }}
        >
          <motion.div className="motorcycle-icon" whileHover={reduced ? {} : { rotate: -8, scale: 1.12 }} transition={springIcon}><i className="bi bi-helmet" /></motion.div>
          <div>
            <span className="eyebrow eyebrow-light">Motorrad</span>
            <h2>Motorrad — Kursüberblick</h2>
            <p>Egal ob Auto oder Motorrad: Unsere Fahrlehrer begleiten dich Schritt für Schritt zum Führerschein.</p>
            <ul className="check-list dark-list">
              <li><i className="bi bi-check-lg" /> Sicher und entspannt lernen</li>
              <li><i className="bi bi-check-lg" /> Dein Weg zum Führerschein</li>
            </ul>
          </div>
          <motion.a className="button button-primary" href="#kontakt" whileHover={reduced ? {} : { y: -3, scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.97 }}>Zur Anmeldung <i className="bi bi-speedometer" /></motion.a>
        </motion.article>
      </div>
    </section>
  );
}

function News() {
  const reduced = useReducedMotion();
  return (
    <section id="news" className="section news-section">
      <div className="container">
        <motion.div className="section-heading" initial={{ opacity: 0, y: reduced ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: reduced ? 0.2 : 0.5, ease }}>
          <span className="eyebrow">News</span>
          <h2>Aus dem Archiv</h2>
        </motion.div>
        <motion.div className="news-grid" initial="hidden" whileInView="visible" viewport={viewport} variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.12 } } }}>
          {newsItems.map((item) => (
            <motion.article key={item.title} className="news-card" variants={{ hidden: { opacity: 0, y: reduced ? 0 : 24 }, visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0.2 : 0.55, ease } } }} whileHover={reduced ? {} : { y: -6 }}>
              <RevealImage src={item.image} alt={item.title} className="news-image" />
              <div className="news-copy">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>Fahrschule Joh. Claassen</strong>
          <p>Deine Fahrschule in Kleve.</p>
        </div>
        <address>
          Emmericherstraße 270<br />
          47533 Kleve<br />
          <a href="tel:+491722623660">+49 (172) 2623660</a><br />
          <a href="mailto:info@fahrschule-claassen.de">info@fahrschule-claassen.de</a>
        </address>
        <div>
          <strong>Unterricht</strong>
          <p>Montags und Donnerstags ab 19 Uhr</p>
          <a className="footer-top" href="#home">Nach oben <i className="bi bi-arrow-up" /></a>
        </div>
      </div>
      <div className="container copyright">©2026 Joh. Claassen</div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#home">Zum Inhalt springen</a>
      <Header />
      <main>
        <Hero />
        <RouteSection />
        <CourseTeasers />
        <TheoryStrip />
        <Dashboard />
        <QuickContact />
        <AutoCourse />
        <MotorcycleCourse />
        <RouteSection id="courses-route" courses />
        <News />
      </main>
      <Footer />
    </>
  );
}
