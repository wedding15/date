import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import floralBg from "./assets/floral-bg.png";
import musicFile from "./assets/wedding-music.mp3";

// ══════════ GOLD CALLIGRAPHIC SVG DIVIDER ══════════
function GoldDivider() {
  return (
    <div className="gold-divider">
      <svg width="200" height="20" viewBox="0 0 240 24" fill="none">
        <defs>
          <linearGradient id="gold-shimmer-divider" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bda06a" />
            <stop offset="25%" stopColor="#dfc089" />
            <stop offset="50%" stopColor="#fffdf5" />
            <stop offset="75%" stopColor="#dfc089" />
            <stop offset="100%" stopColor="#bda06a" />
          </linearGradient>
        </defs>
        <path d="M120 4 L128 12 L120 20 L112 12 Z" fill="url(#gold-shimmer-divider)" />
        <path d="M10 12 H100 M20 12 L30 6 M20 12 L30 18" stroke="url(#gold-shimmer-divider)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M140 12 H230 M220 12 L210 6 M220 12 L210 18" stroke="url(#gold-shimmer-divider)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ══════════ TYPES & COMMENTS ══════════
interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
  emoji: string;
}

interface BgHeart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  emoji: string;
}

const fleeingComments = [
  "ما في مهرب! 😜",
  "جربي كمان إذا بتقدري 😂",
  "مستحيل تضغطي لا! 🤫",
  "الخميس يعني الخميس! 🥳",
  "نعم هي الخيار الوحيد 🥰",
  "لا مفر! 💘",
  "قدامك خيار واحد بس 🤭",
];

export default function App() {
  const [opened, setOpened] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Floating Background Hearts
  const [bgHearts, setBgHearts] = useState<BgHeart[]>([]);
  
  // Confetti particles
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  
  // Flee state for NO button
  const [fleeState, setFleeState] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [fleeCount, setFleeCount] = useState(0);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Next Thursday Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 1. Initialize background hearts (now background flowers)
  useEffect(() => {
    const list: BgHeart[] = [];
    const emojis = ["🌸", "🌹", "🌺", "🌷", "🌻", "🌼", "💐", "💮", "🍃", "🌿", "🏵️", "🥀", "🌱", "🍀"];
    for (let i = 0; i < 140; i++) {
      list.push({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 26,
        delay: Math.random() * -30, // Pre-distributed negative delay
        duration: 6 + Math.random() * 10,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setBgHearts(list);
  }, []);

  // 2. Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.45;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 3. Countdown timer logic (Next Thursday at 7:00 PM)
  useEffect(() => {
    const getNextThursday = () => {
      const now = new Date();
      const resultDate = new Date();
      // Calculate days to next Thursday (4 is Thursday)
      const daysToThursday = (7 + 4 - now.getDay()) % 7;
      resultDate.setDate(now.getDate() + (daysToThursday === 0 && now.getHours() >= 19 ? 7 : daysToThursday));
      resultDate.setHours(19, 0, 0, 0);
      return resultDate.getTime();
    };

    const targetTime = getNextThursday();

    const updateTimer = () => {
      const now = Date.now();
      const difference = Math.max(0, targetTime - now);
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [yesClicked]);

  // Audio Toggling
  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
      setIsPlaying(true);
    }
  };

  // Open Invitation
  const handleOpenInvitation = () => {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Music autoplay failed:", err));
    }
  };

  // Flee logic for No Button
  const handleFlee = () => {
    const btnWidth = 120;
    const btnHeight = 45;
    const padding = 50;

    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    const newX = padding + Math.random() * (maxX - padding);
    const newY = padding + Math.random() * (maxY - padding);

    setFleeState({
      x: newX,
      y: newY,
      active: true,
    });
    setFleeCount((prev) => prev + 1);
  };

  // Yes Button Trigger
  const handleYes = () => {
    setYesClicked(true);
    
    // Spawn heart explosion particles
    const emojis = ["❤️", "💖", "💝", "🌸", "💕", "✨", "🌹", "🥰", "🍬", "🍭"];
    const list: HeartParticle[] = [];
    for (let i = 0; i < 70; i++) {
      list.push({
        id: i + Math.random(),
        x: 0,
        y: 0,
        size: 16 + Math.random() * 24,
        angle: Math.random() * 360,
        speed: 3 + Math.random() * 7,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setParticles(list);
  };

  return (
    <>
      {/* Background Frame and Pattern */}
      <div className="app-bg">
        <img src={floralBg} className="app-bg__img" alt="" style={{ opacity: 0.2, objectFit: 'cover' }} />
        <div className="app-bg__overlay" />
      </div>
      <div className="page-frame" />

      {/* Floating background hearts */}
      <div className="heart-bg">
        {bgHearts.map((h) => (
          <div
            key={h.id}
            className="floating-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
            }}
          >
            {h.emoji}
          </div>
        ))}
      </div>

      {/* Floating Music Controls Button */}
      {opened && (
        <button
          className={`music-toggle-btn ${isPlaying ? "playing" : ""}`}
          onClick={handlePlayToggle}
          aria-label="Toggle Background Music"
        >
          <div className="music-toggle-btn__ripple" />
          <svg
            className="music-toggle-btn__icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            {isPlaying ? (
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z" />
            ) : (
              <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.18l5.45 5.45L21 21.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z" />
            )}
          </svg>
        </button>
      )}

      {/* Confetti Explosion rendering */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "fixed",
              left: "50%",
              top: "40%",
              fontSize: p.size,
              pointerEvents: "none",
              zIndex: 9999,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * (p.speed * 85),
              y: Math.sin((p.angle * Math.PI) / 180) * (p.speed * 85) - 250, // Floating up
              opacity: 0,
              scale: 1.6,
              rotate: p.angle * 2.5,
            }}
            transition={{ duration: 1.8 + Math.random() * 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <div className="app-container">
        <AnimatePresence mode="wait">
          {!opened ? (
            /* ENVELOPE / ENTRANCE CARD */
            <motion.div
              key="envelope"
              className="card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: 90 }}
              transition={{ duration: 0.6 }}
            >
              {/* Floral Corner Decorations */}
              <div className="card-flower-corner top-left">🌸</div>
              <div className="card-flower-corner top-right">🌹</div>
              <div className="card-flower-corner bottom-left">🌷</div>
              <div className="card-flower-corner bottom-right">🌺</div>
              <div className="envelope-crest">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h1 className="envelope-title">وصلتكِ رسالة جديدة 🌸</h1>
              <p className="envelope-subtitle">دعوة خاصة ومميزة تم تصميمها لكِ خصيصاً</p>
              <button className="btn-gold-shimmer" onClick={handleOpenInvitation}>
                افتح الرسالة 💌
              </button>
            </motion.div>
          ) : !yesClicked ? (
            /* MAIN CARD - POETRY AND YES/NO QUESTIONS */
            <motion.div
              key="invitation"
              className="card"
              initial={{ opacity: 0, scale: 0.85, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Floral Corner Decorations */}
              <div className="card-flower-corner top-left">🌸</div>
              <div className="card-flower-corner top-right">🌹</div>
              <div className="card-flower-corner bottom-left">🌷</div>
              <div className="card-flower-corner bottom-right">🌺</div>
              {/* User requested poetic sentence */}
              <p className="poetry-text">
                "أنتِ النعيمُ لقلبي والعذابُ لهُ... فما أمرّكِ في قلبي وأحلاكِ!"
              </p>

              <GoldDivider />

              <h2 className="main-greeting">كل عام وأنتِ بخير يا أطيب إنسانة وأجمل أقداري 💖</h2>
              
              {/* Question changes with every click attempt */}
              <p className="main-question" style={{ fontSize: fleeCount === 0 ? "1.08rem" : "1.25rem", fontWeight: fleeCount === 0 ? "500" : "700" }}>
                {fleeCount === 0 
                  ? "إلى المشاكسة التي تسرق هدوئي، وتثير جنوني، وتزعم دائماً أنني أتلهى بقلبها.. بينما هي النعيم والدنيا بأسرها في عينيّ. الخميس ينتظرنا لنضحك معاً ونستعيد بهجة الأيام، فهل ترافقينني؟ 🌸"
                  : fleeingComments[(fleeCount - 1) % fleeingComments.length]
                }
              </p>

              <div className="btn-container">
                <motion.button
                  className="btn btn-yes"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                >
                  نعم 😍
                </motion.button>

                <motion.button
                  className="btn btn-no"
                  style={
                    fleeState.active
                      ? {
                          position: "fixed",
                          left: fleeState.x,
                          top: fleeState.y,
                          zIndex: 1000,
                        }
                      : {}
                  }
                  animate={fleeState.active ? { left: fleeState.x, top: fleeState.y } : {}}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  onMouseEnter={handleFlee}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleFlee();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleFlee();
                  }}
                >
                  لا 😢
                </motion.button>
              </div>

              <footer className="footer">
                <p className="footer__text">
                  صُمم بكل <span className="footer__heart">♥</span>
                </p>
              </footer>
            </motion.div>
          ) : (
            /* SUCCESS VIEW */
            <motion.div
              key="success"
              className="card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              {/* Floral Corner Decorations */}
              <div className="card-flower-corner top-left">🌸</div>
              <div className="card-flower-corner top-right">🌹</div>
              <div className="card-flower-corner bottom-left">🌷</div>
              <div className="card-flower-corner bottom-right">🌺</div>
              <span className="success-icon">💖</span>
              <h2 className="success-title">يا عيني! 😍 اتفقنا إذن! ✨</h2>
              <p className="success-message">
                الخميس رح يكون أحلى يوم 🌸✨
                <br />
                تجهزي لأجمل مشوار ونقاهة وتغيير جو! 💖🥳
              </p>

              <div className="countdown-box">
                <p className="countdown-title">⏳ المتبقي على لقائنا المنتظر:</p>
                <div className="countdown-grid">
                  <div className="countdown-unit">
                    <span className="countdown-val">{timeLeft.days}</span>
                    <span className="countdown-lbl">يوم</span>
                  </div>
                  <span className="countdown-divider">:</span>
                  <div className="countdown-unit">
                    <span className="countdown-val">{timeLeft.hours}</span>
                    <span className="countdown-lbl">ساعة</span>
                  </div>
                  <span className="countdown-divider">:</span>
                  <div className="countdown-unit">
                    <span className="countdown-val">{timeLeft.minutes}</span>
                    <span className="countdown-lbl">دقيقة</span>
                  </div>
                  <span className="countdown-divider">:</span>
                  <div className="countdown-unit">
                    <span className="countdown-val">{timeLeft.seconds}</span>
                    <span className="countdown-lbl">ثانية</span>
                  </div>
                </div>
              </div>

              <footer className="footer" style={{ marginTop: "32px" }}>
                <p className="footer__text">
                  بانتظاركِ بكل شوق 🌸✨
                </p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
