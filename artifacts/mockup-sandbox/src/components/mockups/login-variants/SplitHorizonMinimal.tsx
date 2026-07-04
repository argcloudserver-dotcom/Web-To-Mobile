export function SplitHorizonMinimal() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#faf9f6",
        overflow: "hidden",
      }}
    >
      {/* ── HERO (48%) — taller, more panoramic ── */}
      <div style={{
        height: "48vh",
        background: "linear-gradient(175deg, #0a1520 0%, #132035 30%, #1c3256 65%, #243d70 90%, #1e4060 100%)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>

        {/* Sky gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(40,70,120,0.4) 0%, transparent 70%)",
        }} />

        {/* Converging perspective lines from a central vanishing point */}
        {[-5,-3,-1.5,0,1.5,3,5].map((angle, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: "18%",
            left: "50%",
            width: "300%",
            height: "1px",
            transformOrigin: "left center",
            transform: `translateX(-50%) rotate(${angle * 6}deg)`,
            background: `rgba(255,255,255,${0.018 + (3 - Math.abs(angle)) * 0.006})`,
          }} />
        ))}

        {/* City — 3 layers with distinct silhouettes */}
        {/* Far layer — barely visible, tallest peaks */}
        <svg viewBox="0 0 400 100" style={{ position: "absolute", bottom: 5, left: 0, right: 0, width: "100%" }} preserveAspectRatio="none">
          <path
            d="M0,100 L0,65 L12,65 L12,50 L22,50 L22,38 L30,38 L30,28 L38,28 L38,38 L50,38 L50,65 L62,65 L62,48 L72,48 L72,36 L80,36 L80,26 L88,26 L88,16 L96,16 L96,26 L106,26 L106,36 L118,36 L118,55 L130,55 L130,40 L140,40 L140,30 L150,30 L150,20 L158,20 L158,30 L170,30 L170,45 L182,45 L182,32 L192,32 L192,45 L205,45 L205,60 L216,60 L216,46 L226,46 L226,36 L234,36 L234,26 L242,26 L242,36 L254,36 L254,50 L266,50 L266,38 L276,38 L276,50 L290,50 L290,60 L302,60 L302,44 L312,44 L312,34 L320,34 L320,44 L334,44 L334,58 L346,58 L346,46 L358,46 L358,58 L370,58 L370,50 L382,50 L382,60 L400,60 L400,100 Z"
            fill="rgba(255,255,255,0.03)"
          />
        </svg>

        {/* Mid layer */}
        <svg viewBox="0 0 400 85" style={{ position: "absolute", bottom: 5, left: 0, right: 0, width: "100%" }} preserveAspectRatio="none">
          <path
            d="M0,85 L0,62 L16,62 L16,50 L28,50 L28,40 L36,40 L36,32 L44,32 L44,40 L58,40 L58,62 L70,62 L70,48 L82,48 L82,38 L90,38 L90,28 L98,28 L98,20 L106,20 L106,28 L120,28 L120,44 L132,44 L132,56 L144,56 L144,42 L154,42 L154,32 L162,32 L162,42 L176,42 L176,58 L188,58 L188,46 L200,46 L200,58 L212,58 L212,44 L222,44 L222,34 L230,34 L230,44 L244,44 L244,56 L256,56 L256,44 L268,44 L268,56 L280,56 L280,62 L292,62 L292,50 L302,50 L302,40 L310,40 L310,50 L324,50 L324,62 L336,62 L336,50 L348,50 L348,62 L362,62 L362,54 L374,54 L374,62 L400,62 L400,85 Z"
            fill="rgba(255,255,255,0.06)"
          />
        </svg>

        {/* Foreground — most visible, shorter buildings at edges */}
        <svg viewBox="0 0 400 70" style={{ position: "absolute", bottom: 5, left: 0, right: 0, width: "100%" }} preserveAspectRatio="none">
          <path
            d="M0,70 L0,55 L20,55 L20,46 L32,46 L32,55 L50,55 L50,42 L60,42 L60,36 L68,36 L68,42 L84,42 L84,56 L96,56 L96,44 L106,44 L106,36 L114,36 L114,28 L122,28 L122,36 L136,36 L136,52 L148,52 L148,60 L160,60 L160,48 L170,48 L170,38 L178,38 L178,48 L192,48 L192,58 L204,58 L204,48 L216,48 L216,58 L228,58 L228,46 L238,46 L238,36 L246,36 L246,46 L260,46 L260,56 L272,56 L272,46 L284,46 L284,56 L298,56 L298,62 L310,62 L310,52 L320,52 L320,44 L328,44 L328,52 L342,52 L342,60 L356,60 L356,54 L368,54 L368,60 L384,60 L384,56 L400,56 L400,70 Z"
            fill="rgba(255,255,255,0.12)"
          />
        </svg>

        {/* Window lights */}
        {[
          [12,58],[12,68],[25,50],[38,42],[38,54],[52,34],[52,46],[66,32],
          [80,28],[80,40],[94,26],[94,38],[108,44],[120,32],[120,44],
          [134,48],[148,36],[148,50],[162,40],[176,52],[190,44],[204,52],
          [218,38],[230,46],[244,56],[256,44],[270,50],[282,54],[294,46],[308,48],
          [322,40],[334,52],[348,44],[362,56],[376,50],[390,58],
        ].map(([x, yPct], i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${x / 4}%`,
            bottom: `${yPct * 0.28}%`,
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            borderRadius: 1,
            background: `rgba(255,230,140,${0.25 + (i % 4) * 0.12})`,
          }} />
        ))}

        {/* Fog / haze fading buildings at horizon */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "40%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(30,64,96,0.55) 70%, rgba(35,62,82,0.88) 100%)",
          pointerEvents: "none",
        }} />

        {/* Subtle horizon light bloom */}
        <div style={{
          position: "absolute",
          bottom: "3%",
          left: "20%", right: "20%",
          height: "16px",
          background: "radial-gradient(ellipse at center, rgba(201,168,76,0.35) 0%, transparent 80%)",
          filter: "blur(8px)",
        }} />

        {/* Gold horizon rule */}
        <div style={{
          position: "absolute", bottom: 5,
          left: 0, right: 0, height: 1.5,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45) 15%, rgba(232,201,106,0.85) 50%, rgba(201,168,76,0.45) 85%, transparent)",
        }} />

        {/* Logo — simple, left-aligned for editorial feel */}
        <div style={{
          position: "absolute", top: 28, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(201,168,76,0.4)",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 17.5L10 2.5L17.5 17.5" stroke="#132035" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 13H14.5" stroke="#132035" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontSize: 21, fontWeight: 700, letterSpacing: "-0.2px" }}>TIL Group</span>
          </div>
          <span style={{ color: "rgba(201,168,76,0.75)", fontSize: 10.5, letterSpacing: "2px" }}>
            منصة ذكاء العقارات
          </span>
        </div>
      </div>

      {/* ── FORM PANEL — underline-style inputs ── */}
      <div style={{
        flex: 1,
        background: "#faf9f6",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -24,
        padding: "18px 28px 26px",
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Pill */}
        <div style={{
          width: 38, height: 4, borderRadius: 2,
          background: "#ccc9c3",
          margin: "0 auto 20px",
          flexShrink: 0,
        }} />

        <div style={{ marginBottom: 26, flexShrink: 0 }}>
          <div style={{ color: "#0f1e33", fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>
            أهلاً بعودتك
          </div>
          <div style={{ color: "#9e9a94", fontSize: 13 }}>
            سجّل الدخول إلى حسابك
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Email — underline input */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ color: "#7a7672", fontSize: 11, fontWeight: 600, marginBottom: 10, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              البريد الإلكتروني
            </div>
            <div style={{
              background: "transparent",
              borderBottom: "2px solid #d8d4cd",
              padding: "10px 2px",
              color: "#bfbbb5",
              fontSize: 15,
            }}>
              you@company.com
            </div>
          </div>

          {/* Password — underline with gold focus treatment */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ color: "#7a7672", fontSize: 11, fontWeight: 600, marginBottom: 10, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              كلمة المرور
            </div>
            <div style={{
              background: "transparent",
              borderBottom: "2px solid #c9a84c",
              padding: "10px 2px",
              color: "#9a9590",
              fontSize: 15,
            }}>
              ••••••••
            </div>
            {/* Focus glow line */}
            <div style={{
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
              marginTop: -2,
              filter: "blur(3px)",
            }} />
          </div>

          {/* CTA Button — richer gradient */}
          <button style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0f1e35 0%, #1e3560 50%, #243d70 100%)",
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15.5,
            cursor: "pointer",
            boxShadow: "0 6px 22px rgba(15,30,53,0.38), 0 1px 4px rgba(0,0,0,0.15)",
            letterSpacing: "0.3px",
            marginBottom: 20,
          }}>
            تسجيل الدخول
          </button>

          {/* Links — cleaner, no divider clutter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              color: "#c9a84c",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
              borderBottom: "1px solid rgba(201,168,76,0.3)",
              paddingBottom: 1,
            }}>
              نسيت كلمة المرور؟
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#0f1e35", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>إنشاء حساب</span>
              <span style={{ color: "#c9a84c", fontSize: 13, fontWeight: 700 }}>←</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
