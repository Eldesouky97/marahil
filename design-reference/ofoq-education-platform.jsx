import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  BookOpen, GraduationCap, ClipboardCheck, Award, BarChart3, Users,
  MessageSquare, PlayCircle, CheckCircle2, ArrowLeft, Star, Sparkles,
  ShieldCheck, QrCode, FileCheck, Video, ListChecks, TrendingUp, Menu, X,
  Calculator, FlaskConical, Atom, Leaf, Languages, Globe, Monitor, Palette,
  Music2, Baby, Briefcase, Stethoscope, HardHat, Megaphone, Code2,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

/* ---------------------------------------------------------------------- */
/*  Global styles — custom CSS drives all color / type / motion decisions  */
/*  (Tailwind core utilities are used only for layout, spacing & sizing)   */
/* ---------------------------------------------------------------------- */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700;800&display=swap');

.ofq { color: #E7E9F2; }
.font-display { font-family: 'Amiri', 'Traditional Arabic', serif; }
.font-body { font-family: 'Tajawal', 'Segoe UI', sans-serif; }

.bg-midnight { background-color: #0B1224; }
.bg-midnight-2 { background-color: #080D1A; }
.bg-card { background-color: #141F38; }
.bg-card-2 { background-color: #0F1729; }

.text-cream { color: #F6EFDD; }
.text-body-muted { color: #B9C2DC; }
.text-body-2 { color: #C7CEE3; }
.text-dim { color: #8A93A6; }
.text-faint { color: #5C6584; }
.text-gold { color: #E8C878; }
.text-gold-deep { color: #D4A94F; }
.text-teal { color: #3FBFAE; }
.text-seal { color: #8A6E2F; }

.border-hair { border-color: rgba(255,255,255,0.06); }
.border-hair-2 { border-color: rgba(255,255,255,0.1); }
.border-gold-soft { border-color: rgba(212,169,79,0.25); }
.border-gold-soft-2 { border-color: rgba(212,169,79,0.3); }
.bg-dim-dot { background-color: rgba(138,147,166,0.5); }

.pill-gold { border: 1px solid rgba(212,169,79,0.3); background-color: rgba(212,169,79,0.1); color: #E8C878; }

.grad-progress { background-image: linear-gradient(90deg, #D4A94F, #3FBFAE); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; border-radius: 9999px; font-weight: 700; cursor: pointer; border: none; }
.btn-gold { background-image: linear-gradient(90deg, #D4A94F, #E8C878); color: #241A05; padding: 0.9rem 1.8rem; transition: box-shadow .25s ease; }
.btn-gold:hover { box-shadow: 0 0 28px rgba(212,169,79,0.45); }
.btn-outline { border: 1px solid rgba(255,255,255,0.15); color: #E7E9F2; padding: 0.9rem 1.8rem; background: transparent; transition: border-color .25s ease, color .25s ease; }
.btn-outline:hover { border-color: rgba(63,191,174,0.6); color: #3FBFAE; }
.btn-block { color: #E7E9F2; background: transparent; padding: 0.5rem 1rem; border: none; transition: color .2s ease; }
.btn-block:hover { color: #E8C878; }

.nav-link { color: #C7CEE3; text-decoration: none; font-size: 0.875rem; transition: color .2s ease; }
.nav-link:hover { color: #E8C878; }

.cta-btn:hover .cta-arrow { transform: translateX(-4px); }
.cta-arrow { transition: transform .2s ease; }

.feature-card { background: #141F38; border: 1px solid rgba(255,255,255,0.06); transition: border-color .25s ease; }
.feature-card:hover { border-color: rgba(212,169,79,0.3); }
.feature-card:hover .feature-icon { background-color: rgba(212,169,79,0.12); color: #E8C878; }
.feature-icon { background-color: rgba(63,191,174,0.1); color: #3FBFAE; transition: background-color .25s ease, color .25s ease; }

.chain-line { position: absolute; top: 2rem; right: 12%; left: 12%; border-top: 2px dashed rgba(212,169,79,0.25); }
.step-marker { background-color: #141F38; border: 1px solid rgba(212,169,79,0.3); }

.dash-window { background-color: #0F1729; border: 1px solid rgba(255,255,255,0.1); }
.dash-titlebar { background-color: rgba(20,31,56,0.6); border-bottom: 1px solid rgba(255,255,255,0.06); }
.dash-sidebar { background-color: rgba(11,18,36,0.6); border-left: 1px solid rgba(255,255,255,0.06); width: 220px; flex-shrink: 0; }
.dash-nav-item { color: #8A93A6; }
.dash-nav-item.active { background-color: rgba(212,169,79,0.1); color: #E8C878; }
.dash-stat { background-color: #141F38; border: 1px solid rgba(255,255,255,0.06); }
.dash-course-row { background-color: #141F38; border: 1px solid rgba(255,255,255,0.06); }
.dot-red { background-color: rgba(232,107,107,0.7); }
.dot-gold { background-color: rgba(232,200,120,0.7); }
.dot-green { background-color: rgba(107,232,168,0.7); }
.progress-track { background-color: rgba(255,255,255,0.07); }

.cert-card { background-image: linear-gradient(155deg, #F6EFDD 0%, #EFE4C8 100%); box-shadow: 0 20px 60px -20px rgba(212,169,79,0.35); position: relative; overflow: hidden; }
.cert-frame { position: absolute; inset: 6px; border: 2px solid rgba(212,169,79,0.4); border-radius: 0.75rem; pointer-events: none; }
.cert-outline { position: absolute; inset: -14px; border: 1px solid rgba(212,169,79,0.15); border-radius: 1rem; z-index: -1; }
.cert-seal { background-color: rgba(43,32,19,0.92); }
.shimmer { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.55) 40%, transparent 60%); background-size: 200% 100%; animation: shimmer 4s ease-in-out infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -60% 0; } }

.glow-blob { position: absolute; pointer-events: none; width: 440px; height: 440px; border-radius: 9999px; opacity: 0.2; filter: blur(60px); background: radial-gradient(circle, #3FBFAE 0%, transparent 70%); transition: transform .3s ease-out; top: 0; left: 0; }

.hero-bg { background: radial-gradient(ellipse at 50% -10%, #1D2C4F 0%, #0B1224 55%, #080D1A 100%); }
.cta-bg { background: radial-gradient(ellipse at 50% 100%, #1D2C4F 0%, #0B1224 60%); }

.stage-tab { background-color: #141F38; border: 1px solid rgba(255,255,255,0.06); color: #8A93A6; transition: all .2s ease; cursor: pointer; }
.stage-tab:hover { border-color: rgba(212,169,79,0.3); color: #C7CEE3; }
.stage-tab.active { background-image: linear-gradient(90deg, #D4A94F, #E8C878); color: #241A05; border-color: transparent; }

.subject-chip { background-color: rgba(63,191,174,0.08); border: 1px solid rgba(63,191,174,0.2); color: #B9E8E0; display: inline-block; }

.quiz-dot { display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: rgba(255,255,255,0.15); }
.quiz-dot.active { background-color: #D4A94F; }
.quiz-dot.done { background-color: #3FBFAE; }

.quiz-option { background-color: #141F38; border: 1px solid rgba(255,255,255,0.08); color: #E7E9F2; transition: all .2s ease; cursor: pointer; }
.quiz-option:hover:not(:disabled) { border-color: rgba(212,169,79,0.35); }
.quiz-option:disabled { cursor: default; }
.quiz-option.correct { background-color: rgba(63,191,174,0.15); border-color: rgba(63,191,174,0.5); color: #BFF3EA; }
.quiz-option.incorrect { background-color: rgba(232,107,107,0.12); border-color: rgba(232,107,107,0.45); color: #F3BFBF; }

::selection { background: rgba(212,169,79,0.35); color: #F6EFDD; }
a:focus-visible, button:focus-visible { outline: 2px solid #3FBFAE; outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .shimmer { animation: none; }
}
`;

const COLORS = { gold: "#D4A94F", teal: "#3FBFAE", cream: "#F6EFDD" };

/* ---------------------------------------------------------------------- */
/*  Hooks                                                                  */
/* ---------------------------------------------------------------------- */

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCountUp(target, shouldStart, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let raf;
    let start = null;
    function frame(t) {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [shouldStart, target, duration]);
  return value;
}

/* ---------------------------------------------------------------------- */
/*  Signature element — animated knowledge constellation                  */
/* ---------------------------------------------------------------------- */

function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0, height = 0, dpr = 1, nodes = [], rafId = null;

    function initNodes() {
      const count = width < 640 ? 24 : width < 1024 ? 36 : 50;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.3 + 0.8,
        phase: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.16,
      }));
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function draw(t) {
      ctx.clearRect(0, 0, width, height);
      const maxDist = width < 640 ? 85 : 125;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!prefersReduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(147,160,190,${0.16 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const twinkle = prefersReduced ? 1 : 0.55 + 0.45 * Math.sin(t / 900 + n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.8 + twinkle * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = n.gold
          ? `rgba(212,169,79,${0.55 + twinkle * 0.45})`
          : `rgba(226,230,245,${0.35 + twinkle * 0.4})`;
        ctx.fill();
      }
      if (!prefersReduced) rafId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    if (prefersReduced) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

/* ---------------------------------------------------------------------- */
/*  Small shared bits                                                     */
/* ---------------------------------------------------------------------- */

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="28" height="28" rx="2" stroke={COLORS.gold} strokeWidth="1.4" transform="rotate(45 20 20)" />
      <rect x="6" y="6" width="28" height="28" rx="2" stroke={COLORS.teal} strokeWidth="1.4" />
      <circle cx="20" cy="20" r="2.6" fill={COLORS.gold} />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Nav                                                                    */
/* ---------------------------------------------------------------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#stages", label: "المراحل والمواد" },
    { href: "#demo", label: "جرّب بنفسك" },
    { href: "#teachers", label: "للمعلمين" },
    { href: "#dashboard", label: "لوحة التحكم" },
    { href: "#certificates", label: "الشهادات" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-midnight border-hair" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", backgroundColor: "rgba(11,18,36,0.85)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between" style={{ height: "4rem" }}>
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-cream" style={{ fontSize: "1.25rem" }}>أُفُق</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button className="btn-block" style={{ fontSize: "0.875rem" }}>تسجيل الدخول</button>
          <button className="btn btn-gold" style={{ padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}>ابدأ الآن</button>
        </div>
        <button className="md:hidden text-cream" onClick={() => setOpen(!open)} aria-label="القائمة" style={{ background: "transparent", border: "none" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-5 py-4 flex flex-col gap-4 bg-midnight border-hair" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <button className="btn btn-gold" style={{ width: "fit-content", padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}>ابدأ الآن</button>
        </div>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------------- */
/*  Hero                                                                   */
/* ---------------------------------------------------------------------- */

function Hero() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = heroRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.transform = `translate(${x - 220}px, ${y - 220}px)`;
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden hero-bg border-hair"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div ref={glowRef} className="glow-blob" />
      <Constellation />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center" style={{ paddingTop: "6rem", paddingBottom: "7rem" }}>
        <span className="pill-gold inline-flex items-center gap-2 rounded-full" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", marginBottom: "2rem" }}>
          <Sparkles size={14} /> منصة أُفُق التعليمية
        </span>
        <h1 className="font-display text-cream" style={{ fontSize: "2.5rem", lineHeight: 1.35, marginBottom: "1.5rem" }}>
          كل درس... نجمة تُضيء طريق طالب
        </h1>
        <p className="text-body-muted mx-auto" style={{ fontSize: "1.05rem", lineHeight: 2, maxWidth: "40rem", marginBottom: "2.5rem" }}>
          يبني المعلمون دروسهم ومناهجهم واختباراتهم وشهاداتهم في مكان واحد، لكل المراحل الدراسية وكل مادة، ويتنقّل الطلاب بينها كما لو كانوا يقرؤون خريطة نجوم متصلة.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn btn-gold cta-btn">
            ابدأ كمعلم
            <ArrowLeft size={18} className="cta-arrow" />
          </button>
          <button className="btn btn-outline">
            <PlayCircle size={18} /> استكشف كطالب
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-dim" style={{ marginTop: "4rem", fontSize: "0.85rem" }}>
          <span>مدارس دولية</span>
          <span className="bg-dim-dot rounded-full" style={{ width: 4, height: 4 }} />
          <span>جامعات وكليات</span>
          <span className="bg-dim-dot rounded-full" style={{ width: 4, height: 4 }} />
          <span>مراكز تدريب مهني</span>
          <span className="bg-dim-dot rounded-full" style={{ width: 4, height: 4 }} />
          <span>معاهد لغات</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Stages & subjects — every grade, every subject                         */
/* ---------------------------------------------------------------------- */

const STAGES = [
  { id: "kg", label: "رياض الأطفال", icon: Sparkles,
    subjects: ["الحروف والأرقام", "المهارات الحركية", "القصص والحكايات", "الألوان والأشكال", "الأناشيد التعليمية"] },
  { id: "primary", label: "المرحلة الابتدائية", icon: BookOpen,
    subjects: ["اللغة العربية", "الرياضيات", "العلوم", "اللغة الإنجليزية", "التربية الدينية", "الحاسوب"] },
  { id: "prep", label: "المرحلة الإعدادية", icon: ListChecks,
    subjects: ["اللغة العربية", "الرياضيات", "العلوم", "اللغة الإنجليزية", "الدراسات الاجتماعية", "الحاسوب"] },
  { id: "secondary", label: "المرحلة الثانوية", icon: GraduationCap,
    subjects: ["الفيزياء", "الكيمياء", "الأحياء", "الرياضيات", "اللغة العربية", "اللغة الإنجليزية", "الجغرافيا"] },
  { id: "university", label: "المرحلة الجامعية", icon: Award,
    subjects: ["هندسة", "طب وعلوم صحية", "إدارة أعمال", "حاسوب وبرمجة", "علوم إنسانية", "قانون"] },
  { id: "training", label: "دورات وتأهيل مهني", icon: TrendingUp,
    subjects: ["لغات أجنبية", "برمجة وتطوير", "تصميم جرافيك", "مهارات أعمال", "شهادات مهنية معتمدة"] },
];

function StagesSubjects() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];
  return (
    <section id="stages" className="bg-midnight-2 border-hair" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mx-auto max-w-xl" style={{ marginBottom: "3rem" }}>
          <p className="text-teal" style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>كل المراحل، كل المواد</p>
          <h2 className="font-display text-cream" style={{ fontSize: "2rem", marginBottom: "1rem" }}>منهج واحد لكل عمر، ولكل مادة</h2>
          <p className="text-dim" style={{ lineHeight: 1.8 }}>من رياض الأطفال إلى الجامعة والتدريب المهني، تُبنى كل مادة بنفس السهولة وتظهر بنفس الجودة.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2" style={{ marginBottom: "2.5rem" }}>
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`stage-tab${i === active ? " active" : ""} flex items-center gap-2 rounded-full`}
                style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
              >
                <Icon size={15} /> {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {stage.subjects.map((sub, i) => (
            <span key={i} className="subject-chip rounded-full" style={{ padding: "0.55rem 1.2rem", fontSize: "0.85rem" }}>
              {sub}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Interactive demo — a live, gradeable mini lesson                       */
/* ---------------------------------------------------------------------- */

const QUIZ_QUESTIONS = [
  { subject: "رياضيات", question: "ما ناتج ٧ × ٨ ؟", choices: ["54", "64", "56", "58"], correct: 2, explanation: "٧ × ٨ = ٥٦" },
  { subject: "علوم", question: "ما الغاز الذي تحتاجه خلايا الجسم للتنفس؟", choices: ["ثاني أكسيد الكربون", "الأكسجين", "النيتروجين", "الهيدروجين"], correct: 1, explanation: "الأكسجين هو الغاز الأساسي الذي تستخدمه الخلايا." },
  { subject: "لغة عربية", question: "ما جمع كلمة «كتاب»؟", choices: ["كتب", "كتائب", "كاتبون", "مكاتب"], correct: 0, explanation: "جمع «كتاب» هو «كُتُب»." },
];

function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[step];

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <section id="demo" className="bg-midnight border-hair" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="text-center" style={{ marginBottom: "2.5rem" }}>
          <p className="text-teal" style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>تجربة حيّة</p>
          <h2 className="font-display text-cream" style={{ fontSize: "2rem", marginBottom: "1rem" }}>جرّب درسًا تفاعليًا الآن</h2>
          <p className="text-dim" style={{ lineHeight: 1.8 }}>هكذا يشعر الطالب بالتفاعل الفوري في كل اختبار — إجابة، وتصحيح، وتفسير في نفس اللحظة.</p>
        </div>

        <div className="dash-window rounded-2xl" style={{ padding: "2rem" }}>
          {!finished ? (
            <>
              <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
                <span className="pill-gold rounded-full" style={{ padding: "0.3rem 0.8rem", fontSize: "0.75rem" }}>{q.subject}</span>
                <div className="flex items-center gap-1.5">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <span key={i} className={`quiz-dot${i === step ? " active" : ""}${i < step ? " done" : ""}`} />
                  ))}
                </div>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.5rem" }}>{q.question}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.choices.map((c, i) => {
                  let state = "";
                  if (selected !== null) {
                    if (i === q.correct) state = " correct";
                    else if (i === selected) state = " incorrect";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      className={`quiz-option${state} rounded-xl`}
                      style={{ padding: "0.9rem 1.1rem", fontSize: "0.9rem", textAlign: "right" }}
                      disabled={selected !== null}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ marginTop: "1.25rem" }}>
                  <p className={selected === q.correct ? "text-teal" : "text-gold"} style={{ fontSize: "0.85rem" }}>
                    {selected === q.correct ? "إجابة صحيحة — " : "إجابة غير دقيقة — "}{q.explanation}
                  </p>
                  <button onClick={next} className="btn btn-gold" style={{ padding: "0.55rem 1.4rem", fontSize: "0.85rem" }}>
                    {step + 1 < QUIZ_QUESTIONS.length ? "التالي" : "النتيجة"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center" style={{ padding: "1.5rem 0" }}>
              <Award size={36} className="text-gold" style={{ marginBottom: "1rem", marginLeft: "auto", marginRight: "auto" }} />
              <h3 className="font-display text-cream" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                نتيجتك: {score} من {QUIZ_QUESTIONS.length}
              </h3>
              <p className="text-dim" style={{ marginBottom: "1.5rem" }}>هكذا تصل نتيجة الطالب فور انتهاء أي اختبار — بلا انتظار.</p>
              <button onClick={restart} className="btn btn-outline">أعد المحاولة</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  How it works — "isnad" chain of transmission                          */
/* ---------------------------------------------------------------------- */

const STEPS = [
  { n: "١", title: "المعلّم ينشر الدرس", desc: "رفع فيديو أو ملف، إضافة شرح مكتوب، وربط مصادر إضافية للطلاب.", icon: Video },
  { n: "٢", title: "الطالب يتعلّم بذكاء", desc: "تتبّع تلقائي للتقدّم، ملاحظات تفاعلية، وأسئلة قصيرة أثناء المشاهدة.", icon: BookOpen },
  { n: "٣", title: "اختبار يقيس الفهم", desc: "أسئلة متنوعة تُصحَّح فورًا، وتحليل دقيق لنقاط القوة والضعف.", icon: ClipboardCheck },
  { n: "٤", title: "شهادة موثّقة تصدر", desc: "شهادة رقمية موقّعة، برمز تحقق فريد لكل طالب.", icon: Award },
];

function HowItWorks() {
  return (
    <section id="how" className="relative bg-midnight border-hair" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <p className="text-teal" style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>سلسلة الإسناد التعليمية</p>
          <h2 className="font-display text-cream" style={{ fontSize: "2rem" }}>من فكرة المعلّم... إلى شهادة الطالب</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          <div className="hidden md:block chain-line" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="relative flex flex-col items-center text-center" style={{ zIndex: 1 }}>
                <div className="step-marker rounded-full flex items-center justify-center" style={{ width: 64, height: 64, marginBottom: "1.25rem" }}>
                  <span className="font-display text-gold" style={{ fontSize: "1.25rem" }}>{s.n}</span>
                </div>
                <Icon size={22} className="text-teal" style={{ marginBottom: "0.75rem" }} />
                <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{s.title}</h3>
                <p className="text-dim" style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 220 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Features for teachers                                                 */
/* ---------------------------------------------------------------------- */

const FEATURES = [
  { icon: Video, title: "دروس بالفيديو والملفات", desc: "ارفع دروسك كفيديو أو PDF أو عرض تقديمي، ونظّمها في وحدات وفصول." },
  { icon: ListChecks, title: "مناهج متكاملة", desc: "ابنِ منهجًا كاملًا بترتيب واضح، من الدرس الأول حتى آخر وحدة." },
  { icon: ClipboardCheck, title: "بنك أسئلة واختبارات", desc: "أسئلة اختيار من متعدد ومقالية، وتصحيح تلقائي فوري." },
  { icon: Award, title: "شهادات رقمية موثقة", desc: "شهادة لكل طالب برمز QR فريد يمكن لأي جهة التحقق منه." },
  { icon: BarChart3, title: "تحليلات لحظية", desc: "تتبّع تقدّم كل طالب، ونسب الإتمام، ومتوسط الدرجات أولًا بأول." },
  { icon: MessageSquare, title: "تواصل مباشر", desc: "أسئلة الطلاب تصل للمعلم مباشرة، مع منتدى نقاش لكل درس." },
];

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="feature-card rounded-2xl" style={{ padding: "1.5rem" }}>
      <div className="feature-icon rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, marginBottom: "1.25rem" }}>
        <Icon size={20} />
      </div>
      <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h3>
      <p className="text-dim" style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="teachers" className="bg-midnight border-hair" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl" style={{ marginBottom: "3.5rem" }}>
          <p className="text-teal" style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>لوحة المعلّم</p>
          <h2 className="font-display text-cream" style={{ fontSize: "2rem", marginBottom: "1rem" }}>كل ما يحتاجه المعلّم في مكان واحد</h2>
          <p className="text-dim" style={{ lineHeight: 1.8 }}>من أول درس تنشره إلى آخر شهادة تصدرها، بأدوات مصمّمة لتوفير وقتك.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Dashboard preview                                                      */
/* ---------------------------------------------------------------------- */

const CHART_DATA = [
  { week: "١", value: 42 },
  { week: "٢", value: 58 },
  { week: "٣", value: 51 },
  { week: "٤", value: 74 },
  { week: "٥", value: 69 },
  { week: "٦", value: 88 },
];

const SIDEBAR_ITEMS = [
  { icon: BarChart3, label: "الرئيسية", active: true },
  { icon: BookOpen, label: "الدروس" },
  { icon: ClipboardCheck, label: "الاختبارات" },
  { icon: Award, label: "الشهادات" },
  { icon: Users, label: "الطلاب" },
];

const QUICK_STATS = [
  { label: "طلاب نشطون", value: "1,284", icon: Users },
  { label: "متوسط الإتمام", value: "82%", icon: TrendingUp },
  { label: "شهادات هذا الشهر", value: "96", icon: FileCheck },
];

const COURSES = [
  { title: "أساسيات الجبر", progress: 92 },
  { title: "قواعد اللغة العربية", progress: 68 },
  { title: "مقدمة في الفيزياء", progress: 45 },
];

function DashboardPreview() {
  return (
    <section id="dashboard" className="bg-midnight-2 border-hair" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mx-auto max-w-xl" style={{ marginBottom: "3.5rem" }}>
          <p className="text-teal" style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>لوحة التحكم</p>
          <h2 className="font-display text-cream" style={{ fontSize: "2rem", marginBottom: "1rem" }}>نظرة واحدة على كل صفوفك</h2>
          <p className="text-dim" style={{ lineHeight: 1.8 }}>تصميم واضح يعرض أداء طلابك دون أن تبحث عنه.</p>
        </div>

        <div className="dash-window rounded-2xl overflow-hidden shadow-2xl">
          <div className="dash-titlebar flex items-center gap-2" style={{ padding: "0.9rem 1.25rem" }}>
            <span className="dot-red rounded-full" style={{ width: 10, height: 10 }} />
            <span className="dot-gold rounded-full" style={{ width: 10, height: 10 }} />
            <span className="dot-green rounded-full" style={{ width: 10, height: 10 }} />
            <span className="text-dim" style={{ fontSize: "0.75rem", marginRight: "1rem" }}>لوحة تحكم المعلّم — أ. سارة يوسف</span>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="dash-sidebar hidden md:flex flex-col gap-1" style={{ padding: "1rem" }}>
              {SIDEBAR_ITEMS.map((item, i) => (
                <div key={i} className={`dash-nav-item${item.active ? " active" : ""} flex items-center gap-3 rounded-lg`} style={{ padding: "0.6rem 0.75rem", fontSize: "0.875rem" }}>
                  <item.icon size={16} /> {item.label}
                </div>
              ))}
            </div>

            <div style={{ padding: "1.5rem", flex: 1, minWidth: 0 }}>
              <div className="grid grid-cols-3 gap-3" style={{ marginBottom: "1.5rem" }}>
                {QUICK_STATS.map((s, i) => (
                  <div key={i} className="dash-stat rounded-xl" style={{ padding: "0.85rem" }}>
                    <s.icon size={15} className="text-teal" style={{ marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{s.value}</div>
                    <div className="text-dim" style={{ fontSize: "0.7rem", marginTop: "0.15rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="dash-stat rounded-xl" style={{ padding: "1rem", marginBottom: "1.25rem" }}>
                <div className="text-dim" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>نسبة إتمام الطلاب — آخر ٦ أسابيع</div>
                <div style={{ width: "100%", height: 130 }}>
                  <ResponsiveContainer>
                    <AreaChart data={CHART_DATA} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4A94F" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#D4A94F" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" hide />
                      <Tooltip
                        contentStyle={{ background: "#0F1729", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#E7E9F2" }}
                        itemStyle={{ color: "#E8C878" }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#D4A94F" strokeWidth={2} fill="url(#fillGold)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                {COURSES.map((c, i) => (
                  <div key={i} className="dash-course-row flex items-center gap-4 rounded-xl" style={{ padding: "0.75rem" }}>
                    <div className="feature-icon rounded-lg flex items-center justify-center shrink-0" style={{ width: 36, height: 36 }}>
                      <BookOpen size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: "0.4rem" }}>
                        <span className="truncate" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{c.title}</span>
                        <span className="text-dim" style={{ fontSize: "0.75rem" }}>{c.progress}%</span>
                      </div>
                      <div className="progress-track rounded-full overflow-hidden" style={{ height: 6 }}>
                        <div className="grad-progress rounded-full" style={{ height: "100%", width: `${c.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Certificate showcase                                                   */
/* ---------------------------------------------------------------------- */

function CertificateShowcase() {
  return (
    <section id="certificates" className="relative bg-midnight border-hair overflow-hidden" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-teal" style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>الشهادات</p>
          <h2 className="font-display text-cream" style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>شهادة يفخر بها الطالب، ويثق بها الجميع</h2>
          <p className="text-dim" style={{ lineHeight: 1.8, marginBottom: "1.5rem" }}>
            كل شهادة تحمل رمز تحقق فريد، فيمكن لأي مدرسة أو جهة توظيف التأكد من صحتها في ثوانٍ، دون رسائل أو مكالمات.
          </p>
          <ul className="space-y-3">
            {[
              "توقيع رقمي معتمد من المعلّم أو المؤسسة",
              "رمز QR للتحقق الفوري من صحة الشهادة",
              "تصميم قابل للتخصيص بشعار المدرسة أو المركز",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-body-2" style={{ fontSize: "0.9rem" }}>
                <CheckCircle2 size={18} className="text-teal shrink-0" style={{ marginTop: 2 }} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="cert-card rounded-2xl" style={{ padding: "2rem" }}>
            <div className="cert-frame" />
            <div className="shimmer" />
            <div className="relative flex items-start justify-between" style={{ marginBottom: "2rem" }}>
              <Logo />
              <ShieldCheck size={22} className="text-seal" />
            </div>
            <p className="relative text-seal" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>شهادة إتمام</p>
            <h3 className="relative font-display" style={{ fontSize: "1.5rem", color: "#2B2013", marginBottom: "0.25rem" }}>نورة أحمد الفهد</h3>
            <p className="relative" style={{ fontSize: "0.875rem", color: "#5B4A2A", marginBottom: "2rem" }}>أكملت بنجاح مقرر «أساسيات الجبر» بتقدير امتياز</p>
            <div className="relative flex items-end justify-between">
              <div className="text-seal" style={{ fontSize: "0.7rem" }}>
                <p>الرقم التسلسلي</p>
                <p style={{ color: "#2B2013", marginTop: 2, fontFamily: "monospace" }}>OFQ-2026-19342</p>
              </div>
              <div className="cert-seal rounded-md flex items-center justify-center" style={{ width: 56, height: 56 }}>
                <QrCode size={30} color="#F6EFDD" />
              </div>
            </div>
          </div>
          <div className="cert-outline" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Stats                                                                  */
/* ---------------------------------------------------------------------- */

const STATS = [
  { target: 48000, suffix: "+", label: "درس منشور" },
  { target: 210000, suffix: "+", label: "طالب نشط" },
  { target: 36500, suffix: "+", label: "شهادة صادرة" },
  { target: 97, suffix: "%", label: "نسبة رضا المعلمين" },
];

function StatItem({ target, suffix, label, shouldStart }) {
  const value = useCountUp(target, shouldStart);
  return (
    <div className="text-center">
      <div className="font-display text-gold" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        {value.toLocaleString("en-US")}{suffix}
      </div>
      <div className="text-dim" style={{ fontSize: "0.875rem" }}>{label}</div>
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView(0.4);
  return (
    <section ref={ref} className="bg-midnight-2 border-hair" style={{ paddingTop: "5rem", paddingBottom: "5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
        {STATS.map((s, i) => <StatItem key={i} {...s} shouldStart={inView} />)}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Testimonial                                                            */
/* ---------------------------------------------------------------------- */

function Testimonial() {
  return (
    <section className="bg-midnight border-hair" style={{ paddingTop: "6rem", paddingBottom: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="flex justify-center gap-1" style={{ marginBottom: "1.5rem" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} style={{ fill: "#D4A94F", color: "#D4A94F" }} />
          ))}
        </div>
        <p className="font-display" style={{ fontSize: "1.35rem", lineHeight: 1.9, color: "#F0F2FA", marginBottom: "2rem" }}>
          "نقلت كل مادتي الدراسية إلى أُفُق خلال أسبوع واحد. الطلاب أصبحوا يسألون متى الدرس القادم، بدل أن أطاردهم أنا."
        </p>
        <div>
          <p style={{ fontWeight: 700 }}>أ. سارة يوسف</p>
          <p className="text-dim" style={{ fontSize: "0.875rem" }}>معلمة رياضيات، المرحلة الثانوية</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Final CTA + Footer                                                     */
/* ---------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section className="cta-bg" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <h2 className="font-display text-cream" style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>ابدأ في بناء صفّك الرقمي اليوم</h2>
        <p className="text-dim" style={{ lineHeight: 1.8, marginBottom: "2.25rem" }}>بلا تكاليف إعداد، وبلا تعقيد. انشر أول درس خلال دقائق.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn btn-gold">
            <GraduationCap size={18} /> ابدأ كمعلم
          </button>
          <button className="btn btn-outline cta-btn">
            انضم كطالب <ArrowLeft size={18} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-midnight-2" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-cream" style={{ fontSize: "1.1rem" }}>أُفُق</span>
        </div>
        <p className="text-faint" style={{ fontSize: "0.75rem" }}>© ٢٠٢٦ منصة أُفُق التعليمية — نموذج تصميم أولي</p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- */
/*  App                                                                     */
/* ---------------------------------------------------------------------- */

export default function OfoqLanding() {
  return (
    <div dir="rtl" lang="ar" className="ofq font-body bg-midnight" style={{ minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <Nav />
      <Hero />
      <StagesSubjects />
      <HowItWorks />
      <Features />
      <InteractiveDemo />
      <DashboardPreview />
      <CertificateShowcase />
      <StatsSection />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </div>
  );
}
