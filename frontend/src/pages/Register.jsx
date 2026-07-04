import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    try { await register(name, email, password); }
    catch (err) { setError(err.message); }
    setLoading(false);
  };

  const s = {
    page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6FB", fontFamily: "'Inter', sans-serif", padding: 24 },
    card: { background: "#fff", borderRadius: 24, padding: "44px 40px", maxWidth: 420, width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0" },
    input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 15, color: "#0F172A", outline: "none", fontFamily: "inherit", marginBottom: 18 },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 },
    btn: { width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4F46E5, #2563EB)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", opacity: loading ? 0.7 : 1 },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #4F46E5, #2563EB, #0891B2)", fontSize: 20 }}>💻</div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#0F172A" }}>CodeSkill</span>
        </div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 26, color: "#0F172A", textAlign: "center", marginBottom: 8 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "#94A3B8", textAlign: "center", marginBottom: 28 }}>Start solving 300 curated problems today</p>

        {error && <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 10, padding: "10px 16px", fontSize: 13, marginBottom: 18 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={s.input} />
          <label style={s.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={s.input} />
          <label style={s.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required style={s.input} />
          <label style={s.label}>Confirm Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" required style={s.input} />
          <button type="submit" disabled={loading} style={s.btn}>{loading ? "Creating account..." : "Create Account"}</button>
        </form>

        <p style={{ display: "block", textAlign: "center", marginTop: 22, fontSize: 14, color: "#94A3B8" }}>
          Already have an account? <Link to="/login" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
