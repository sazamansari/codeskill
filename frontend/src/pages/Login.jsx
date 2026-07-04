import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const s = {
    page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6FB", fontFamily: "'Inter', sans-serif", padding: 24 },
    card: { background: "#fff", borderRadius: 24, padding: "48px 40px", maxWidth: 420, width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0" },
    logo: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32 },
    logoIcon: { width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #4F46E5, #2563EB, #0891B2)", fontSize: 20 },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 26, color: "#0F172A", textAlign: "center", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#94A3B8", textAlign: "center", marginBottom: 32 },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 },
    input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 15, color: "#0F172A", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s", marginBottom: 20 },
    btn: { width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4F46E5, #2563EB)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", marginTop: 4, opacity: loading ? 0.7 : 1 },
    error: { background: "#FEE2E2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 10, padding: "10px 16px", fontSize: 13, marginBottom: 20 },
    link: { display: "block", textAlign: "center", marginTop: 24, fontSize: 14, color: "#94A3B8" },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>💻</div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#0F172A" }}>CodeSkill</span>
        </div>
        <h1 style={s.title}>Welcome back</h1>
        <p style={s.subtitle}>Sign in to continue your coding journey</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={s.input} onFocus={(e) => (e.target.style.borderColor = "#4F46E5")} onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")} />

          <label style={s.label}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={s.input} onFocus={(e) => (e.target.style.borderColor = "#4F46E5")} onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")} />

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={s.link}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#CBD5E1" }}>Part of the Evolvian EdTech Ecosystem</p>
      </div>
    </div>
  );
}
