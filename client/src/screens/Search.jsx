import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { TopBar, Spinner, Empty } from "../components/UI";
import { AlbumCard, SongCard, UserRow } from "../components/Cards";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [trending, setTrending] = useState(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef();

  useEffect(() => {
    api.trending().then((d) => setTrending(d.trending)).catch(() => setTrending([]));
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!q.trim()) {
      setResults(null);
      setBusy(false);
      return;
    }
    setBusy(true);
    timer.current = setTimeout(() => {
      api
        .search(q)
        .then((d) => setResults(d.results))
        .catch(() => setResults({ users: [], albums: [], songs: [] }))
        .finally(() => setBusy(false));
    }, 350);
    return () => clearTimeout(timer.current);
  }, [q]);

  const nothing =
    results && !results.users.length && !results.albums.length && !results.songs.length;

  return (
    <>
      <TopBar title="Search" />
      <div className="pad list-gap">
        <div className="field">
          <input
            placeholder="DJs, albums, tracks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
        </div>

        {busy && <Spinner />}

        {!busy && results && (
          <>
            {results.users.length > 0 && (
              <section className="stack">
                <div className="eyebrow">People</div>
                {results.users.map((u) => (
                  <UserRow key={u._id} user={u} />
                ))}
              </section>
            )}
            {results.albums.length > 0 && (
              <section className="stack">
                <div className="eyebrow">Albums</div>
                {results.albums.map((a) => (
                  <AlbumCard key={a._id} album={a} byline={a.userId?.name} />
                ))}
              </section>
            )}
            {results.songs.length > 0 && (
              <section className="stack">
                <div className="eyebrow">Tracks</div>
                {results.songs.map((s) => (
                  <SongCard key={s._id} song={{ ...s, album: s.albumId }} />
                ))}
              </section>
            )}
            {nothing && (
              <Empty glyph="🔍" headline={`No hits for "${q}"`}>
                Try another name, title or artist.
              </Empty>
            )}
          </>
        )}

        {!results && !busy && (
          <section className="stack">
            <div className="eyebrow">Trending in the scene</div>
            {!trending && <Spinner />}
            {trending?.map((u) => (
              <UserRow key={u._id} user={u} />
            ))}
            {trending && trending.length === 0 && (
              <Empty glyph="📈" headline="No one's trending yet">
                Follow some DJs to get the scene moving.
              </Empty>
            )}
          </section>
        )}
      </div>
    </>
  );
}
