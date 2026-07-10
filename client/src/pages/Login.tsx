import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"account" | "phone">("account");
  const [staffId, setStaffId] = useState("T2024001");
  const [password, setPassword] = useState("demo123456");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendCode = () => {
    if (!phone.trim()) { setError("请输入手机号"); return; }
    setError("");
    setCodeSent(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "account") {
      if (!staffId.trim()) { setError("请输入工号"); return; }
      if (!password.trim()) { setError("请输入密码"); return; }
    } else {
      if (!phone.trim()) { setError("请输入手机号"); return; }
      if (!code.trim()) { setError("请输入验证码"); return; }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation("/dashboard");
    }, 800);
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'PingFang SC','Microsoft YaHei','Segoe UI',sans-serif",
    }}>
      {/* 左侧品牌区 */}
      <div style={{
        flex: "0 0 50%",
        background: "linear-gradient(145deg, #1a56db 0%, #1e40af 50%, #1d4ed8 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "60px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 背景装饰圆 */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />

        {/* Logo */}
        <div style={{ marginBottom: "48px", width: "100%" }}>
          <img
            src="/manus-storage/reknow-logo_b7e90903.webp"
            alt="凌犀 LMS"
            style={{ maxWidth: "280px", width: "100%", display: "block", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.25))" }}
          />
        </div>

        {/* 标语 */}
        <div style={{ fontSize: "32px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "16px" }}>
          AI 驱动的教学管理<br />让每一节课产生价值
        </div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "40px" }}>
          学 · 练 · 测 · 析 全流程闭环，数据驱动持续优化
        </div>

        {/* 功能标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {["📊 智能数据分析", "🤖 AI 批改建议", "📚 课件标准化", "👨‍👩‍👧 多端协同"].map(pill => (
            <span key={pill} style={{
              padding: "6px 14px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "20px",
              fontSize: "12px",
              color: "#fff",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>{pill}</span>
          ))}
        </div>
      </div>

      {/* 右侧表单区 */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: "40px",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
            助教驻驶舱登录
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "28px" }}>
            使用工号登录您的助教账号
          </p>

          {/* Tab 切换 */}
          <div style={{
            display: "flex", background: "#f1f5f9", borderRadius: "8px",
            padding: "4px", marginBottom: "24px",
          }}>
            {(["account", "phone"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                style={{
                  flex: 1, padding: "8px", border: "none", borderRadius: "6px",
                  fontSize: "13px", cursor: "pointer", transition: "all .2s",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#1e293b" : "#64748b",
                  fontWeight: tab === t ? 600 : 400,
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                }}
              >
                {t === "account" ? "工号登录" : "手机验证码"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            {tab === "account" ? (
              <>
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>工号</label>
                  <input
                    type="text"
                    placeholder="请输入工号（如 T2024001）"
                    value={staffId}
                    onChange={e => setStaffId(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px", color: "#1e293b", outline: "none",
                      boxSizing: "border-box", transition: "border-color .2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#1a56db"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div style={{ marginBottom: "18px", position: "relative" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>密码</label>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="请输入密码"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 40px 11px 14px", border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px", color: "#1e293b", outline: "none",
                      boxSizing: "border-box", transition: "border-color .2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#1a56db"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{
                      position: "absolute", right: "12px", bottom: "11px",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", padding: 0, display: "flex",
                    }}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>手机号</label>
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px", color: "#1e293b", outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#1a56db"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div style={{ marginBottom: "18px", display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    style={{
                      flex: 1, padding: "11px 14px", border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px", color: "#1e293b", outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#1a56db"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={countdown > 0}
                    style={{
                      padding: "11px 16px", border: "1.5px solid #1a56db", borderRadius: "8px",
                      background: countdown > 0 ? "#f1f5f9" : "#fff", color: countdown > 0 ? "#94a3b8" : "#1a56db",
                      fontSize: "13px", cursor: countdown > 0 ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap", fontWeight: 500,
                    }}
                  >
                    {countdown > 0 ? `${countdown}s` : "获取验证码"}
                  </button>
                </div>
              </>
            )}

            {/* 记住我 + 忘记密码 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: "#1a56db" }}
                />
                记住登录状态（7天）
              </label>
              <button type="button" style={{ fontSize: "12px", color: "#1a56db", background: "none", border: "none", cursor: "pointer" }}>
                忘记密码？
              </button>
            </div>

            {error && (
              <div style={{
                fontSize: "13px", color: "#dc2626", background: "#fee2e2",
                border: "1px solid #fecaca", borderRadius: "8px",
                padding: "10px 14px", marginBottom: "16px",
              }}>{error}</div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", border: "none", borderRadius: "10px",
                background: loading ? "#93c5fd" : "#1a56db", color: "#fff",
                fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "20px", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px", transition: "background .2s",
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "登录中..." : "登 录"}
            </button>

            {/* 分割线 */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>或</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>

            {/* SSO */}
            <button
              type="button"
              style={{
                width: "100%", padding: "11px", border: "1.5px solid #e2e8f0",
                borderRadius: "10px", background: "#fff", color: "#334155",
                fontSize: "13px", cursor: "pointer", marginBottom: "20px",
                transition: "border-color .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#1a56db")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              🔐 企业 SSO 单点登录
            </button>

            <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
              登录即代表您同意{" "}
              <a href="#" style={{ color: "#1a56db" }}>《用户协议》</a>
              {" "}和{" "}
              <a href="#" style={{ color: "#1a56db" }}>《隐私政策》</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
