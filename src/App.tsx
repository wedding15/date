import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import floralBg from "./assets/floral-bg.png";

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

// ══════════ TYPES ══════════
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

export default function App() {
  const [opened, setOpened] = useState(false);
  const [yesClicked, setYesClicked] = useState(false); // Represents "wish made"
  
  // Floating Background Particles (Balloons & Flowers - Neutral, no hearts)
  const [bgHearts, setBgHearts] = useState<BgHeart[]>([]);
  
  // Confetti particles
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  
  // Countdown State (to Friday, June 19th, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 5-second loading countdown state
  const [loadingCount, setLoadingCount] = useState(5);

  // 1. Initialize background floating elements (birthday mix - neutral)
  useEffect(() => {
    const list: BgHeart[] = [];
    const emojis = ["🌸", "🌹", "🌷", "🌺", "🎈", "✨", "🎉", "🍰", "🎂", "🎁", "🍬", "⭐", "🌟"];
    for (let i = 0; i < 140; i++) {
      list.push({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 24,
        delay: Math.random() * -30, // Pre-distributed negative delay
        duration: 6 + Math.random() * 10,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setBgHearts(list);
  }, []);

  // 2. Countdown timer for envelope loader (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Countdown timer logic (to Friday, June 19th, 2026 at 00:00:00)
  useEffect(() => {
    const targetTime = new Date("2026-06-19T00:00:00").getTime();

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

  // Open Invitation / Greeting Card
  const handleOpenInvitation = () => {
    setOpened(true);
  };

  // Trigger Wish / Confetti
  const handleMakeWish = () => {
    setYesClicked(true);
    
    // Spawn massive confetti / birthday items explosion (neutral, no hearts)
    const emojis = ["🌸", "🎈", "✨", "🎉", "🍰", "🎂", "🍬", "🍭", "🎁", "⭐", "🌟", "💐"];
    const list: HeartParticle[] = [];
    for (let i = 0; i < 90; i++) {
      list.push({
        id: i + Math.random(),
        x: 0,
        y: 0,
        size: 16 + Math.random() * 24,
        angle: Math.random() * 360,
        speed: 3 + Math.random() * 8,
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

      {/* Floating background particles */}
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
            /* STEP 1: ENVELOPE / ENTRANCE CARD */
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
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <h1 className="envelope-title">لديكِ بطاقة تهنئة جديدة 🌸</h1>
              <p className="envelope-subtitle">بطاقة معايدة خاصة بمناسبة عيد ميلادكِ السعيد ✨</p>
              
              <AnimatePresence mode="wait">
                {loadingCount > 0 ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: "100%" }}
                  >
                    <div className="luxury-loader">
                      <motion.div 
                        className="luxury-loader-bar" 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    </div>
                    <p className="loader-text">جاري إعداد بطاقتكِ الخاصة... {loadingCount}</p>
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="btn-gold-shimmer"
                    onClick={handleOpenInvitation}
                  >
                    افتح البطاقة ✉️
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : !yesClicked ? (
            /* STEP 2: GREETING CARD */
            <motion.div
              key="greeting-card"
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
              
              {/* Beautiful birthday poetic sentence - Neutral */}
              <p className="poetry-text">
                "سنةٌ جديدةٌ تُقبل بالبشائر والسرور... متمنين لكِ فيها السعادة وتوفيق الأمور!"
              </p>

              <GoldDivider />

              <h2 className="main-greeting">كل عام وأنتِ بخير يا أطيب وألطف إنسانة ✨</h2>
              
              <p className="main-question" style={{ fontSize: "1.08rem", fontWeight: "500" }}>
                يوم الجمعة 19 حزيران هو مناسبة مميزة للاحتفال بيوم ميلادكِ السعيد. أتمنى لكِ عاماً جميلاً مليئاً بالنجاح والتوفيق والسعادة، وتمنياتي الصادقة لكِ بتحقيق كل أمنياتكِ وطموحاتكِ. 🌸✨
              </p>

              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "16px" }}>
                <motion.button
                  className="btn-gold-shimmer"
                  style={{ minWidth: "200px" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMakeWish}
                >
                  تمنّي أمنية ✨
                </motion.button>
              </div>

              <footer className="footer">
                <p className="footer__text">
                  مع أطيب التمنيات 🌸✨
                </p>
              </footer>
            </motion.div>
          ) : (
            /* STEP 3: SUCCESS / WISH GRANTED VIEW */
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
              
              <span className="success-icon">🎂</span>
              <h2 className="success-title">سنة حلوة وسعيدة! 🍰✨</h2>
              <p className="success-message">
                كل عام وأنتِ بخير وسعادة وراحة بال! 🌸✨
                <br />
                أتمنى لكِ عاماً جميلاً مليئاً بالتوفيق والنجاح. ✨
              </p>

              <div className="countdown-box">
                <p className="countdown-title">⏳ المتبقي على يوم ميلادكِ السعيد (19 حزيران):</p>
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
                  عيد ميلاد سعيد 🌸✨
                </p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
