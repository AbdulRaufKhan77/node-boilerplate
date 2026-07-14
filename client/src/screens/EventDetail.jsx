import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";
import { TopBar, Spinner, Avatar, Cover, Empty } from "../components/UI";
import {
  fmtEventDate,
  fmtEventTime,
  timeAgo,
  CATEGORY_LABELS,
} from "../helpers";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", width: 18, height: 18 };

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api.eventById(id).then(setEvent).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [id]);

  if (error && !event)
    return (
      <>
        <TopBar title="Event" back />
        <Empty glyph="🚫" headline="Can't open this event">{error}</Empty>
      </>
    );
  if (!event)
    return (
      <>
        <TopBar title="Event" back />
        <Spinner />
      </>
    );

  const attending = event.attendees?.some((a) => a._id === user?._id);

  const rsvp = async () => {
    setBusy(true);
    try {
      await api.attend(id);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setBusy(true);
    try {
      await api.addComment(id, comment.trim());
      setComment("");
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title={CATEGORY_LABELS[event.category] || "Event"} back />
      <div className="pad list-gap">
        <div className="detail-head">
          <h2>{event.title}</h2>
          <div className="sub">
            hosted by {event.user?.name || "someone in the scene"}
          </div>
        </div>

        <div className="card" style={{ flexDirection: "column", alignItems: "stretch", gap: 0 }}>
          <div className="info-row">
            <svg viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
            {fmtEventDate(event.date)} · {fmtEventTime(event.date)}
          </div>
          {event.location && (
            <div className="info-row">
              <svg viewBox="0 0 24 24" {...S}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
              {event.location}
            </div>
          )}
          {event.virtualLink && (
            <div className="info-row">
              <svg viewBox="0 0 24 24" {...S}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7L12.5 19" /></svg>
              <a href={event.virtualLink} target="_blank" rel="noreferrer">Join the stream</a>
            </div>
          )}
        </div>

        {event.description && <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{event.description}</p>}

        {error && <div className="error-msg">{error}</div>}

        <div className="card" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="avatar-stack">
              {(event.attendees || []).slice(0, 4).map((a) => (
                <Avatar key={a._id} name={a.name} size={30} />
              ))}
            </span>
            <span style={{ fontSize: 13.5, color: "var(--muted)" }}>
              {event.attendees?.length || 0} going
            </span>
          </div>
          <button className="btn btn-sm btn-primary" onClick={rsvp} disabled={busy || attending}>
            {attending ? "You're in ✓" : "I'm in"}
          </button>
        </div>

        {event.album?.length > 0 && (
          <section className="stack">
            <div className="eyebrow">On the lineup</div>
            {event.album.map((a) => (
              <Link key={a._id} to={`/album/${a._id}`} className="card">
                <Cover src={a.coverUrl} seed={a.title} size={48} />
                <div className="meta">
                  <div className="name">{a.title}</div>
                  <div className="sub">{a.artist}</div>
                </div>
              </Link>
            ))}
          </section>
        )}

        <section className="stack">
          <div className="eyebrow">Comments ({event.comments?.length || 0})</div>
          {(event.comments || []).map((c, i) => (
            <div className="comment" key={c._id || i}>
              <Avatar name={c.user?.name} size={32} />
              <div className="bubble">
                <div className="who">{c.user?.name || "someone"}</div>
                <div className="txt">{c.comment}</div>
                <div className="when">{timeAgo(c.createdAt)}</div>
              </div>
            </div>
          ))}
          <form className="composer" onSubmit={postComment}>
            <input
              placeholder="Say something…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" disabled={busy} aria-label="Send">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
