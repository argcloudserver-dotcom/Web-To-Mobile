export function DarkLuxury() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0d1825 0%, #1a2d45 50%, #0f1e30 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Geometric background accents */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 280, height: 280,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.12)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 160, height: 160,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.2)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60,
        width: 220, height: 220,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.08)",
        pointerEvents: "none",
      }} />
      {/* Subtle grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Logo block */}
      <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56,
          background: "linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)",
          borderRadius: 14,
          marginBottom: 16,
          boxShadow: "0 8px 24px rgba(201,168,76,0.35)",
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 24L14 4L24 24" stroke="#0d1825" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 18H20.5" stroke="#0d1825" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ color: "#e8e8e8", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6 }}>
          TIL Group
        </div>
        <div style={{ color: "#c9a84c", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase" }}>
          منصة ذكاء العقارات
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 360,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.18)",
        borderRadius: 20,
        padding: "28px 24px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#e8e8e8", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
            أهلاً بعودتك
          </div>
          <div style={{ color: "rgba(200,200,200,0.5)", fontSize: 13 }}>
            سجّل الدخول إلى حسابك
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "rgba(200,200,200,0.7)", fontSize: 12, marginBottom: 8, letterSpacing: "0.5px" }}>
            البريد الإلكتروني
          </div>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "rgba(200,200,200,0.4)",
            fontSize: 14,
          }}>
            you@company.com
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "rgba(200,200,200,0.7)", fontSize: 12, marginBottom: 8, letterSpacing: "0.5px" }}>
            كلمة المرور
          </div>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "rgba(200,200,200,0.4)",
            fontSize: 14,
          }}>
            ••••••••
          </div>
        </div>

        {/* Button */}
        <button style={{
          width: "100%",
          padding: "14px",
          background: "linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)",
          border: "none",
          borderRadius: 12,
          color: "#0d1825",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(201,168,76,0.4)",
          letterSpacing: "0.3px",
        }}>
          تسجيل الدخول
        </button>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <span style={{ color: "#c9a84c", fontSize: 12, cursor: "pointer" }}>نسيت كلمة المرور؟</span>
          <span style={{ color: "#c9a84c", fontSize: 12, cursor: "pointer" }}>إنشاء حساب</span>
        </div>
      </div>
    </div>
  );
}
