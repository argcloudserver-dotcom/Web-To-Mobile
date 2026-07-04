export function SplitHorizon() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#f7f6f3",
        overflow: "hidden",
      }}
    >
      {/* Top: Architectural hero — 42% of screen */}
      <div style={{
        height: "42vh",
        background: "linear-gradient(180deg, #1B2A4A 0%, #263d6b 70%, #2e4d82 100%)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Architectural grid lines */}
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            position: "absolute",
            bottom: 0,
            left: `${8 + i * 16}%`,
            width: "1px",
            height: `${40 + i * 12 + (i % 2) * 8}%`,
            background: `rgba(255,255,255,${0.06 + i * 0.015})`,
            transformOrigin: "bottom center",
          }} />
        ))}
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute",
            bottom: 0,
            right: `${6 + i * 18}%`,
            width: "1px",
            height: `${30 + i * 15}%`,
            background: `rgba(255,255,255,${0.05 + i * 0.02})`,
            transformOrigin: "bottom center",
          }} />
        ))}

        {/* Horizontal floor lines */}
        {[0,1,2].map(i => (
          <div key={i} style={{
            position: "absolute",
            bottom: `${i * 12}%`,
            left: 0, right: 0,
            height: "1px",
            background: `rgba(255,255,255,${0.04 + i * 0.02})`,
          }} />
        ))}

        {/* Gold accent band at horizon */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0, right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #c9a84c 30%, #e8c96a 50%, #c9a84c 70%, transparent)",
        }} />

        {/* Logo overlaid on the hero */}
        <div style={{
          position: "absolute",
          top: 32,
          left: 0, right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36,
              background: "rgba(201,168,76,0.9)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 16L9 2L16 16" stroke="#1B2A4A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4.5 12H13.5" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>TIL Group</span>
          </div>
          <div style={{ color: "rgba(201,168,76,0.85)", fontSize: 11, marginTop: 6, letterSpacing: "2px" }}>
            منصة ذكاء العقارات
          </div>
        </div>

        {/* City silhouette at bottom */}
        <svg
          viewBox="0 0 400 80"
          style={{ position: "absolute", bottom: 3, left: 0, right: 0, width: "100%" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 L0,55 L20,55 L20,40 L35,40 L35,55 L50,55 L50,28 L58,28 L58,20 L66,20 L66,28 L80,28 L80,50 L95,50 L95,35 L110,35 L110,15 L118,15 L118,10 L126,10 L126,15 L140,15 L140,50 L155,50 L155,38 L170,38 L170,25 L180,25 L180,38 L195,38 L195,55 L210,55 L210,42 L225,42 L225,55 L240,55 L240,32 L250,32 L250,22 L260,22 L260,32 L275,32 L275,55 L290,55 L290,40 L305,40 L305,55 L320,55 L320,44 L335,44 L335,55 L350,55 L350,38 L365,38 L365,55 L380,55 L380,50 L400,50 L400,80 Z"
            fill="rgba(255,255,255,0.06)"
          />
        </svg>
      </div>

      {/* Bottom: Form section */}
      <div style={{
        flex: 1,
        background: "#f7f6f3",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -24,
        padding: "28px 24px",
        position: "relative",
        zIndex: 2,
        overflowY: "auto",
      }}>
        {/* Pill handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "#d0ccc5",
          margin: "0 auto 20px",
        }} />

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#1B2A4A", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            أهلاً بعودتك
          </div>
          <div style={{ color: "#8a8578", fontSize: 13 }}>
            سجّل الدخول إلى حسابك
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: "#5a5650", fontSize: 12, marginBottom: 6 }}>البريد الإلكتروني</div>
          <div style={{
            background: "#fff",
            border: "1.5px solid #e2dfd9",
            borderRadius: 12,
            padding: "13px 14px",
            color: "#c0bdb8",
            fontSize: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            you@company.com
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: "#5a5650", fontSize: 12, marginBottom: 6 }}>كلمة المرور</div>
          <div style={{
            background: "#fff",
            border: "1.5px solid #e2dfd9",
            borderRadius: 12,
            padding: "13px 14px",
            color: "#c0bdb8",
            fontSize: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            ••••••••
          </div>
        </div>

        {/* Button */}
        <button style={{
          width: "100%",
          padding: "15px",
          background: "#1B2A4A",
          border: "none",
          borderRadius: 12,
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(27,42,74,0.3)",
        }}>
          تسجيل الدخول
        </button>

        {/* Gold divider accent */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e2dfd9" }} />
          <div style={{ width: 6, height: 6, background: "#c9a84c", borderRadius: "50%" }} />
          <div style={{ flex: 1, height: 1, background: "#e2dfd9" }} />
        </div>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#c9a84c", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>نسيت كلمة المرور؟</span>
          <span style={{ color: "#1B2A4A", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>إنشاء حساب ←</span>
        </div>
      </div>
    </div>
  );
}
