import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";
import { TopBar, Spinner, Avatar, Cover, Empty } from "../components/UI";
import { EventCard } from "../components/Cards";
import { roleLabel } from "../helpers";

export default function Profile() {
  const { user: cached, signOut } = useAuth();
  const [me, setMe] = useState(cached);
  const [albums, setAlbums] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    api.profile().then((d) => setMe(d.user)).catch(() => {});
    api.myAlbums().then(setAlbums).catch(() => setAlbums([]));
    api.myEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <>
      <TopBar title="Profile">
        <button className="btn btn-ghost btn-sm" onClick={signOut}>
          Log out
        </button>
      </TopBar>

      <div className="pad list-gap">
        <div className="profile-head">
          <Avatar name={me?.name} size={72} />
          <div>
            <h2 className="display">{me?.name}</h2>
            <span className="chip hot" style={{ marginTop: 6 }}>
              {roleLabel(me?.role || "user")}
            </span>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="v">{me?.followerCount ?? 0}</div>
            <div className="k">Followers</div>
          </div>
          <div className="stat">
            <div className="v">{albums ? albums.length : "–"}</div>
            <div className="k">Albums</div>
          </div>
          <div className="stat">
            <div className="v">{events ? events.length : "–"}</div>
            <div className="k">Events</div>
          </div>
        </div>

        <section className="stack">
          <div className="eyebrow">My albums</div>
          {!albums && <Spinner />}
          {albums && albums.length === 0 && (
            <Empty glyph="💿" headline="No albums yet">
              Hit the + button and drop your first album.
            </Empty>
          )}
          {albums && albums.length > 0 && (
            <div className="album-grid">
              {albums.map((a) => (
                <Link key={a._id} to={`/album/${a._id}`} className="album-tile">
                  <Cover src={a.coverUrl} seed={a.title} fill fontSize={40} />
                  <div className="name">{a.title}</div>
                  <div className="sub">{a.isPublic ? "Public" : "Private"}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="stack">
          <div className="eyebrow">My events</div>
          {!events && <Spinner />}
          {events && events.length === 0 && (
            <Empty glyph="🎪" headline="No events yet">
              Publish an event and get the scene together.
            </Empty>
          )}
          {events?.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </section>

        {me?.favouriteAlbums?.length > 0 && (
          <section className="stack">
            <div className="eyebrow">Favourites</div>
            <div className="sub" style={{ color: "var(--muted)", fontSize: 13 }}>
              {me.favouriteAlbums.length} favourite album
              {me.favouriteAlbums.length > 1 ? "s" : ""}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
