import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { TopBar } from "../components/UI";

export default function Create() {
  const [kind, setKind] = useState("album");
  return (
    <>
      <TopBar title="Create" />
      <div className="pad list-gap">
        <div className="segmented">
          {["album", "song", "event"].map((k) => (
            <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>
              {k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
        {kind === "album" && <AlbumForm />}
        {kind === "song" && <SongForm />}
        {kind === "event" && <EventForm />}
      </div>
    </>
  );
}

function useSubmit(fn, onDone) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await fn();
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, submit };
}

function PublicSwitch({ checked, onChange, hint }) {
  return (
    <div className="switch-row">
      <div>
        <div className="lab">Public</div>
        <div className="hint">{hint}</div>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="track" />
      </label>
    </div>
  );
}

function AlbumForm() {
  const navigate = useNavigate();
  const [f, setF] = useState({ title: "", artist: "", releaseDate: "", genres: "", isPublic: true });
  const [file, setFile] = useState(null);

  const { busy, error, submit } = useSubmit(async () => {
    const form = new FormData();
    Object.entries(f).forEach(([k, v]) => form.append(k, v));
    if (file) form.append("coverImage", file);
    await api.addAlbum(form);
  }, () => navigate("/profile"));

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <form className="stack" onSubmit={submit}>
      <div className="field">
        <label htmlFor="a-title">Title</label>
        <input id="a-title" value={f.title} onChange={set("title")} placeholder="Album title" required />
      </div>
      <div className="field">
        <label htmlFor="a-artist">Artist</label>
        <input id="a-artist" value={f.artist} onChange={set("artist")} placeholder="Artist name" required />
      </div>
      <div className="field">
        <label htmlFor="a-genres">Genre</label>
        <input id="a-genres" value={f.genres} onChange={set("genres")} placeholder="House, techno, afrobeat…" />
      </div>
      <div className="field">
        <label htmlFor="a-date">Release date</label>
        <input id="a-date" type="date" value={f.releaseDate} onChange={set("releaseDate")} />
      </div>
      <div className="field">
        <label htmlFor="a-cover">Cover art</label>
        <input id="a-cover" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <PublicSwitch
        checked={f.isPublic}
        onChange={(v) => setF({ ...f, isPublic: v })}
        hint="Public albums show up in the feed"
      />
      {error && <div className="error-msg">{error}</div>}
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Dropping…" : "Drop album"}
      </button>
    </form>
  );
}

function SongForm() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState(null);
  const [f, setF] = useState({ title: "", artist: "", albumId: "", isPublic: true });

  useEffect(() => {
    api.myAlbums().then(setAlbums).catch(() => setAlbums([]));
  }, []);

  const { busy, error, submit } = useSubmit(
    () => api.addSong(f),
    () => navigate(`/album/${f.albumId}`),
  );

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (albums && albums.length === 0) {
    return (
      <div className="ok-msg">
        Tracks live inside an album — drop an album first, then add tracks to it.
      </div>
    );
  }

  return (
    <form className="stack" onSubmit={submit}>
      <div className="field">
        <label htmlFor="s-album">Album</label>
        <select id="s-album" value={f.albumId} onChange={set("albumId")} required>
          <option value="" disabled>
            {albums ? "Choose an album" : "Loading…"}
          </option>
          {albums?.map((a) => (
            <option key={a._id} value={a._id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="s-title">Track title</label>
        <input id="s-title" value={f.title} onChange={set("title")} placeholder="Track title" required />
      </div>
      <div className="field">
        <label htmlFor="s-artist">Artist</label>
        <input id="s-artist" value={f.artist} onChange={set("artist")} placeholder="Artist name" required />
      </div>
      <PublicSwitch
        checked={f.isPublic}
        onChange={(v) => setF({ ...f, isPublic: v })}
        hint="Public tracks show up in the feed"
      />
      {error && <div className="error-msg">{error}</div>}
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Adding…" : "Add track"}
      </button>
    </form>
  );
}

function EventForm() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "party",
    visibility: "public",
    virtualLink: "",
  });

  const { busy, error, submit } = useSubmit(
    () => api.addEvent(f),
    () => navigate("/events"),
  );

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <form className="stack" onSubmit={submit}>
      <div className="field">
        <label htmlFor="e-title">Event name</label>
        <input id="e-title" value={f.title} onChange={set("title")} placeholder="Rooftop Sessions vol. 4" required />
      </div>
      <div className="field">
        <label htmlFor="e-desc">Description</label>
        <textarea id="e-desc" value={f.description} onChange={set("description")} placeholder="What's the vibe?" />
      </div>
      <div className="field">
        <label htmlFor="e-date">When</label>
        <input id="e-date" type="datetime-local" value={f.date} onChange={set("date")} required />
      </div>
      <div className="field">
        <label htmlFor="e-loc">Where</label>
        <input id="e-loc" value={f.location} onChange={set("location")} placeholder="Venue or neighbourhood" />
      </div>
      <div className="field">
        <label htmlFor="e-cat">Type</label>
        <select id="e-cat" value={f.category} onChange={set("category")}>
          <option value="party">Party</option>
          <option value="concert">Concert</option>
          <option value="release">Release</option>
          <option value="meetup">Meetup</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="e-link">Stream link (optional)</label>
        <input id="e-link" value={f.virtualLink} onChange={set("virtualLink")} placeholder="https://…" />
      </div>
      <PublicSwitch
        checked={f.visibility === "public"}
        onChange={(v) => setF({ ...f, visibility: v ? "public" : "private" })}
        hint="Public events show up for everyone"
      />
      {error && <div className="error-msg">{error}</div>}
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Publishing…" : "Publish event"}
      </button>
    </form>
  );
}
