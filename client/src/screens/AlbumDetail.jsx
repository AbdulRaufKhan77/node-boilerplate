import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { TopBar, Spinner, Cover, Empty } from "../components/UI";

export default function AlbumDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [faved, setFaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.albumById(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <>
        <TopBar title="Album" back />
        <Empty glyph="🚫" headline="Can't open this album">{error}</Empty>
      </>
    );
  if (!data)
    return (
      <>
        <TopBar title="Album" back />
        <Spinner />
      </>
    );

  const { album, songs } = data;

  const fave = async () => {
    setBusy(true);
    try {
      await api.addFavourite(album._id);
      setFaved(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title="Album" back />
      <div className="pad list-gap">
        <Cover src={album.coverUrl} seed={album.title} size={200} className="hero-cover" fontSize={72} />
        <div className="detail-head">
          <h2>{album.title}</h2>
          <div className="sub">
            {album.artist}
            {album.userId?.name ? (
              <>
                {" · by "}
                <Link to={`/user/${album.userId._id}`} style={{ color: "var(--live)", textDecoration: "none" }}>
                  {album.userId.name}
                </Link>
              </>
            ) : null}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center" }}>
            {album.genres && <span className="chip hot">{album.genres}</span>}
            {album.releaseDate && (
              <span className="chip">{new Date(album.releaseDate).getFullYear()}</span>
            )}
            {!album.isPublic && <span className="chip">Private</span>}
          </div>
        </div>

        <button className="btn btn-ghost btn-block" onClick={fave} disabled={busy || faved}>
          {faved ? "♥ In your favourites" : "♡ Add to favourites"}
        </button>

        <section>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Tracklist ({songs.length})
          </div>
          {songs.length === 0 && (
            <Empty glyph="🎚️" headline="No tracks yet">
              This album is waiting for its first track.
            </Empty>
          )}
          {songs.map((s, i) => (
            <div className="song-row" key={s._id}>
              <span className="n">{i + 1}</span>
              <div className="t">
                <div className="name">{s.title}</div>
                <div className="sub">{s.artist}</div>
              </div>
              {!s.isPublic && <span className="chip">Private</span>}
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
