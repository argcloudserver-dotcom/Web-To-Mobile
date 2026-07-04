export function ImmersiveGradient() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #1a1060 0%, #0e2a5e 25%, #0b4a6e 50%, #0e6b6b 72%, #1a5c3e 88%, #c9871a 100%)",
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
      {/* Ambient light orbs */}
      <div style={{
        position: "absolute", top: "8%", left: "20%",
        width: 220, height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,107,107,0.45) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "12%", right: "10%",
        width: 180, height: 180,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,135,26,0.4) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "35%", right: "5%",
        width: 120, height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,42,94,0.6) 0%, transparent 70%)",
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      {/* Star-like dots texture */}
      {[
        [15,12],[72,8],[88,22],[30,35],[60,18],[45,5],[82,40],[10,55],[65,48],
        [92,65],[20,70],[50,75],[78,28],[35,60],[55,85],[8,30]
      ].map(([x,y], i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${x}%`, top: `${y}%`,
          width: i % 3 === 0 ? 2 : 1,
          height: i % 3 === 0 ? 2 : 1,
          background: `rgba(255,255,255,${0.2 + (i % 4) * 0.1})`,
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
      ))}

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36, position: "relative" }}>
        <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
          TIL Group
        </div>
        <div style={{
          width: 40, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.9), transparent)",
          margin: "0 auto 8px",
        }} />
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, letterSpacing: "1.5px" }}>
          منصة ذكاء العقارات
        </div>
      </div>

      {/* Frosted glass card */}
      <div style={{
        width: "100%", maxWidth: 360,
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 24,
        padding: "28px 24px",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
      }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 20, fontWeight: 600, marginBottom: 5 }}>
            أهلاً بعودتك
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            سجّل الدخول إلى حسابك
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 7 }}>البريد الإلكتروني</div>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            padding: "13px 14px",
            color: "rgba(255,255,255,0.35)",
            fontSize: 14,
          }}>
            you@company.com
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 7 }}>كلمة المرور</div>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            padding: "13px 14px",
            color: "rgba(255,255,255,0.35)",
            fontSize: 14,
          }}>
            ••••••••
          </div>
        </div>

        {/* Button with aurora shimmer */}
        <button style={{
          width: "100%",
          padding: "15px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(240,235,220,0.95) 100%)",
          border: "none",
          borderRadius: 12,
          color: "#1a1060",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.2)",
          letterSpacing: "0.2px",
        }}>
          تسجيل الدخول
        </button>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer" }}>نسيت كلمة المرور؟</span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>إنشاء حساب</span>
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{ marginTop: 28, color: "rgba(255,255,255,0.2)", fontSize: 11, letterSpacing: "1px", textAlign: "center" }}>
        REAL ESTATE INTELLIGENCE
      </div>
    </div>
  );
}
