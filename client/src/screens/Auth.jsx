import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../App";

const WaveIcon = () => (
  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M3 12v0M7 8v8M11 5v14M15 8v8M19 11v2" />
  </svg>
);

export default function Auth() {
  const { signIn } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.register(form);
      signIn(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth fade-in">
      <div className="brand">
        <span className="logo-mark">
          <WaveIcon />
        </span>
        <h1 className="display">
          Scene<span style={{ color: "var(--accent)" }}>Wave</span>
        </h1>
        <p>Your city's music scene — DJs, drops and nights out, in one place.</p>
      </div>

      <form onSubmit={submit}>
        {mode === "register" && (
          <>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" value={form.name} onChange={set("name")} placeholder="Your name" required />
            </div>
            <div className="field">
              <label>I'm here as</label>
              <div className="segmented">
                <button type="button" className={form.role === "user" ? "on" : ""} onClick={() => setForm({ ...form, role: "user" })}>
                  Listener
                </button>
                <button type="button" className={form.role === "Dj" ? "on" : ""} onClick={() => setForm({ ...form, role: "Dj" })}>
                  DJ / Artist
                </button>
              </div>
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required minLength={6} />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "One sec…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <div className="swap">
        {mode === "login" ? "New to the scene?" : "Already have an account?"}{" "}
        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </div>
    </div>
  );
}
