export function SplitHorizonAtmosphere() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#f5f3ef",
        overflow: "hidden",
      }}
    >
      {/* ── HERO (44%) ── */}
      <div style={{
        height: "44vh",
        background: "linear-gradient(175deg, #0f1e35 0%, #1a2f50 45%, #223968 80%, #2a4a7a 100%)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>

        {/* Vanishing-point perspective lines from horizon */}
        {[-3,-2,-1,0,1,2,3].map((i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: "22%",
            left: "50%",
            width: "200%",
            height: "1px",
            background: `rgba(255,255,255,${0.025 + Math.abs(i) * 0.005})`,
            transformOrigin: "left center",
            transform: `translateX(-50%) rotate(${i * 8}deg)`,
          }} />
        ))}

        {/* Vertical tower lines */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            position: "absolute",
            bottom: 0,
            left: `${6 + i * 12.5}%`,
            width: i % 3 === 1 ? "2px" : "1px",
            height: `${28 + (i % 4) * 14 + (i % 2) * 10}%`,
            background: `rgba(255,255,255,${0.05 + (i % 3) * 0.02})`,
          }} />
        ))}

        {/* Window lights — scattered dots on tower lines */}
        {[
          [10, 62], [10, 72], [23, 55], [23, 68], [23, 80],
          [36, 48], [36, 60], [36, 74], [48, 40], [48, 54],
          [48, 68], [61, 50], [61, 64], [73, 44], [73, 58],
          [73, 70], [86, 52], [86, 66],
        ].map(([x, y], i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${x}%`,
            bottom: `${y - 36}%`,
            width: i % 5 === 0 ? 3 : 2,
            height: i % 5 === 0 ? 3 : 2,
            borderRadius: 1,
            background: `rgba(248,220,140,${0.3 + (i % 3) * 0.18})`,
            boxShadow: `0 0 4px rgba(248,220,140,${0.2 + (i % 3) * 0.1})`,
          }} />
        ))}

        {/* City silhouette — 3 depth layers */}
        {/* Layer 1: distant (faintest, tallest) */}
        <svg viewBox="0 0 400 90" style={{ position: "absolute", bottom: 6, left: 0, right: 0, width: "100%" }} preserveAspectRatio="none">
          <path
            d="M0,90 L0,58 L15,58 L15,42 L28,42 L28,58 L42,58 L42,30 L50,30 L50,22 L58,22 L58,30 L72,30 L72,50 L85,50 L85,36 L96,36 L96,18 L104,18 L104,10 L112,10 L112,18 L128,18 L128,50 L140,50 L140,34 L152,34 L152,24 L162,24 L162,34 L176,34 L176,55 L188,55 L188,40 L200,40 L200,55 L215,55 L215,30 L225,30 L225,20 L235,20 L235,30 L250,30 L250,52 L264,52 L264,38 L276,38 L276,52 L290,52 L290,42 L302,42 L302,52 L316,52 L316,35 L328,35 L328,52 L342,52 L342,44 L358,44 L358,55 L372,55 L372,46 L386,46 L386,55 L400,55 L400,90 Z"
            fill="rgba(255,255,255,0.04)"
          />
        </svg>
        {/* Layer 2: mid-ground */}
        <svg viewBox="0 0 400 80" style={{ position: "absolute", bottom: 4, left: 0, right: 0, width: "100%" }} preserveAspectRatio="none">
          <path
            d="M0,80 L0,60 L18,60 L18,48 L30,48 L30,60 L48,60 L48,38 L56,38 L56,32 L64,32 L64,38 L80,38 L80,58 L96,58 L96,44 L108,44 L108,28 L116,28 L116,22 L124,22 L124,28 L136,28 L136,55 L150,55 L150,42 L162,42 L162,32 L170,32 L170,42 L184,42 L184,60 L196,60 L196,48 L208,48 L208,60 L222,60 L222,40 L232,40 L232,30 L242,30 L242,40 L256,40 L256,58 L268,58 L268,46 L280,46 L280,58 L296,58 L296,50 L308,50 L308,58 L322,58 L322,44 L334,44 L334,58 L350,58 L350,50 L364,50 L364,60 L378,60 L378,52 L392,52 L392,60 L400,60 L400,80 Z"
            fill="rgba(255,255,255,0.07)"
          />
        </svg>
        {/* Layer 3: foreground (clearest) */}
        <svg viewBox="0 0 400 65" style={{ position: "absolute", bottom: 4, left: 0, right: 0, width: "100%" }} preserveAspectRatio="none">
          <path
            d="M0,65 L0,50 L22,50 L22,40 L36,40 L36,50 L55,50 L55,34 L63,34 L63,28 L71,28 L71,34 L88,34 L88,50 L104,50 L104,38 L114,38 L114,50 L130,50 L130,40 L144,40 L144,50 L160,50 L160,36 L172,36 L172,28 L182,28 L182,36 L198,36 L198,50 L214,50 L214,42 L224,42 L224,50 L240,50 L240,38 L252,38 L252,30 L262,30 L262,38 L278,38 L278,52 L292,52 L292,44 L304,44 L304,52 L320,52 L320,42 L332,42 L332,52 L348,52 L348,46 L360,46 L360,52 L376,52 L376,48 L390,48 L390,52 L400,52 L400,65 Z"
            fill="rgba(255,255,255,0.11)"
          />
        </svg>

        {/* Atmospheric haze — fades hero bottom into the form panel color */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "38%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(36,55,85,0.5) 60%, rgba(44,66,95,0.85) 100%)",
          pointerEvents: "none",
        }} />

        {/* Horizon glow */}
        <div style={{
          position: "absolute",
          bottom: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "20px",
          background: "radial-gradient(ellipse at center, rgba(201,168,76,0.28) 0%, transparent 70%)",
          filter: "blur(6px)",
        }} />

        {/* Gold horizon line */}
        <div style={{
          position: "absolute",
          bottom: 4,
          left: 0, right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 20%, rgba(232,201,106,0.9) 50%, rgba(201,168,76,0.4) 80%, transparent 100%)",
        }} />

        {/* Logo — centered, icon above text */}
        <div style={{
          position: "absolute",
          top: 28,
          left: 0, right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, rgba(201,168,76,0.95) 0%, rgba(232,201,106,0.9) 100%)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 19L11 3L19 19" stroke="#1a2f50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 14.5H16" stroke="#1a2f50" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>TIL Group</div>
            <div style={{ color: "rgba(201,168,76,0.8)", fontSize: 10, letterSpacing: "2.5px", marginTop: 2, textTransform: "uppercase" }}>
              منصة ذكاء العقارات
            </div>
          </div>
        </div>
      </div>

      {/* ── FORM PANEL ── */}
      <div style={{
        flex: 1,
        background: "#f5f3ef",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        marginTop: -22,
        padding: "20px 26px 28px",
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Pill */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: "#d4cfc8",
          margin: "0 auto 22px",
          flexShrink: 0,
        }} />

        <div style={{ marginBottom: 22, flexShrink: 0 }}>
          <div style={{ color: "#131f33", fontSize: 23, fontWeight: 800, marginBottom: 5, letterSpacing: "-0.4px" }}>
            أهلاً بعودتك
          </div>
          <div style={{ color: "#9a9490", fontSize: 13 }}>
            سجّل الدخول إلى حسابك
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {/* Email input */}
          <div>
            <div style={{ color: "#6b6660", fontSize: 11.5, fontWeight: 600, marginBottom: 7, letterSpacing: "0.4px", textTransform: "uppercase" }}>
              البريد الإلكتروني
            </div>
            <div style={{
              background: "#fff",
              border: "1.5px solid #e4e0da",
              borderRadius: 12,
              padding: "13px 14px",
              color: "#c4c0ba",
              fontSize: 14,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05), inset 0 1px 2px rgba(0,0,0,0.02)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                right: 0, top: 0, bottom: 0,
                width: 3,
                borderRadius: "0 11px 11px 0",
                background: "transparent",
              }} />
              you@company.com
            </div>
          </div>

          {/* Password input — shown as "active" with gold accent */}
          <div>
            <div style={{ color: "#6b6660", fontSize: 11.5, fontWeight: 600, marginBottom: 7, letterSpacing: "0.4px", textTransform: "uppercase" }}>
              كلمة المرور
            </div>
            <div style={{
              background: "#fff",
              border: "1.5px solid #c9a84c",
              borderRadius: 12,
              padding: "13px 14px",
              color: "#8a8480",
              fontSize: 14,
              boxShadow: "0 0 0 3px rgba(201,168,76,0.1), 0 1px 4px rgba(0,0,0,0.05)",
            }}>
              ••••••••
            </div>
          </div>

          {/* Button */}
          <button style={{
            width: "100%",
            padding: "15px",
            background: "linear-gradient(135deg, #1B2A4A 0%, #253d6a 100%)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 5px 18px rgba(27,42,74,0.35), 0 1px 3px rgba(0,0,0,0.15)",
            letterSpacing: "0.2px",
          }}>
            تسجيل الدخول
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "#e4e0da" }} />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="3" fill="#c9a84c" opacity="0.7"/>
              <circle cx="6" cy="6" r="1.5" fill="#c9a84c"/>
            </svg>
            <div style={{ flex: 1, height: 1, background: "#e4e0da" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#c9a84c", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>نسيت كلمة المرور؟</span>
            <span style={{ color: "#131f33", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>إنشاء حساب ←</span>
          </div>
        </div>
      </div>
    </div>
  );
}
