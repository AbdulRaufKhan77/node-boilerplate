import { useNavigate } from "react-router-dom";
import { mediaUrl } from "../api";
import { coverGradient, initials } from "../helpers";

export function TopBar({ title, back, children }) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      {back && (
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
      <div className="title">{title}</div>
      {children}
    </header>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      Scene<em>Wave</em>
    </span>
  );
}

export function Cover({ src, seed, size = 56, className = "", fontSize, fill = false }) {
  const style = fill
    ? { fontSize: fontSize ?? 40 }
    : { width: size, height: size, fontSize: fontSize ?? size * 0.4 };
  if (src) {
    return (
      <span className={`cover ${className}`} style={style}>
        <img src={mediaUrl(src)} alt="" />
      </span>
    );
  }
  return (
    <span className={`cover ${className}`} style={{ ...style, background: coverGradient(seed) }}>
      {(seed || "?")[0].toUpperCase()}
    </span>
  );
}

export function Avatar({ name, size = 40 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials(name)}
    </span>
  );
}

export function Spinner() {
  return <div className="spinner" role="status" aria-label="Loading" />;
}

export function Empty({ glyph = "🎧", headline, children }) {
  return (
    <div className="empty">
      <div className="glyph">{glyph}</div>
      <div className="headline">{headline}</div>
      <p>{children}</p>
    </div>
  );
}
