import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BADGES } from "../config/constants";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", institution: user?.profile?.institution || "", role: user?.profile?.role || "student" });

  if (!user) return null;
  const stats = user.stats || {};
  const badges = user.badges || [];

  const handleSave = async () => {
    await updateProfile({ name: form.name, bio: form.bio, profile: { institution: form.institution, role: form.role } });
    setEditing(false);
  };

  const s = {
    page: { minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Inter', sans-serif", padding: "24px" },
    container: { maxWidth: 900, margin: "0 auto" },
    card: { background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 20 },
    h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#0F172A", marginBottom: 16 },
    stat: { textAlign: "center", padding: "20px 12px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #F1F5F9" },
    statVal: { fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: "#0F172A" },
    statLabel: { fontSize: 12, color: "#94A3B8", marginTop: 4 },
    input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", fontFamily: "inherit", marginBottom: 14 },
    btn: { padding: "10px 24px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #4F46E5, #2563EB)", fontSize: 16 }}>💻</div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#0F172A" }}>CodeSkill</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/")} style={{ ...s.btn, background: "#EEF2FF", color: "#4F46E5" }}>← Back to Platform</button>
            <button onClick={logout} style={{ ...s.btn, background: "#FEE2E2", color: "#DC2626" }}>Logout</button>
          </div>
        </div>

        {/* Profile Card */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #4F46E5, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 800 }}>{user.name?.[0]?.toUpperCase()}</div>
              <div>
                {editing ? <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ ...s.input, marginBottom: 4, fontSize: 18, fontWeight: 700 }} />
                  : <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#0F172A" }}>{user.name}</h1>}
                <p style={{ fontSize: 14, color: "#94A3B8" }}>{user.email}</p>
                {editing ? <input value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Add a bio..." style={{ ...s.input, marginTop: 4 }} />
                  : user.bio && <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>{user.bio}</p>}
              </div>
            </div>
            {editing
              ? <div style={{ display: "flex", gap: 8 }}><button onClick={handleSave} style={{ ...s.btn, background: "#4F46E5", color: "#fff" }}>Save</button><button onClick={() => setEditing(false)} style={{ ...s.btn, background: "#F1F5F9", color: "#64748B" }}>Cancel</button></div>
              : <button onClick={() => setEditing(true)} style={{ ...s.btn, background: "#F1F5F9", color: "#64748B" }}>Edit Profile</button>}
          </div>

          {editing && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 8 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>Institution</label><input value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} style={s.input} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ ...s.input, cursor: "pointer" }}>
                  <option value="student">Student</option><option value="professional">Professional</option><option value="educator">Educator</option><option value="other">Other</option>
                </select></div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={s.card}>
          <h2 style={s.h2}>📊 Statistics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[["🎯", stats.totalSolved || 0, "Total Solved"], ["⚡", stats.xp || 0, "Total XP"], ["🔥", stats.currentStreak || 0, "Current Streak"], ["🏆", stats.longestStreak || 0, "Longest Streak"]].map(([ic, v, l]) =>
              <div key={l} style={s.stat}><div style={{ fontSize: 22 }}>{ic}</div><div style={s.statVal}>{v}</div><div style={s.statLabel}>{l}</div></div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[["🧮 DSA", stats.dsaSolved || 0, "/100", "#7C3AED"], ["🗄️ SQL", stats.sqlSolved || 0, "/100", "#0891B2"], ["⚡ JavaScript", stats.jsSolved || 0, "/100", "#D97706"]].map(([label, v, max, color]) =>
              <div key={label} style={{ ...s.stat, borderLeft: `4px solid ${color}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color }}>{label}</div>
                <div style={{ ...s.statVal, fontSize: 24 }}>{v}<span style={{ fontSize: 14, color: "#CBD5E1" }}>{max}</span></div>
                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(v / 100) * 100}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[["Easy", stats.easySolved || 0, "#16A34A"], ["Medium", stats.mediumSolved || 0, "#D97706"], ["Hard", stats.hardSolved || 0, "#DC2626"]].map(([label, v, color]) =>
              <div key={label} style={{ ...s.stat }}><div style={{ fontSize: 12, fontWeight: 700, color }}>{label}</div><div style={{ ...s.statVal, fontSize: 22, color }}>{v}</div></div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={s.card}>
          <h2 style={s.h2}>🏅 Badges ({badges.length}/{BADGES.length})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {BADGES.map(b => {
              const unlocked = badges.some(ub => ub.badgeId === b.id);
              return (
                <div key={b.id} style={{ padding: "14px 16px", borderRadius: 14, background: unlocked ? "#DCFCE7" : "#F8FAFC", border: `1.5px solid ${unlocked ? "#BBF7D0" : "#F1F5F9"}`, opacity: unlocked ? 1 : 0.4, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{b.icon}</span>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{b.name}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{b.desc}</div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
