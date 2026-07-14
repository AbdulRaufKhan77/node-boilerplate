import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";
import { TopBar, Spinner, Avatar, Empty } from "../components/UI";
import { AlbumCard } from "../components/Cards";
import { roleLabel } from "../helpers";

export default function UserProfile() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    api.userById(id).then(setUser).catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <>
        <TopBar title="Profile" back />
        <Empty glyph="🚫" headline="Can't open this profile">{error}</Empty>
      </>
    );
  if (!user)
    return (
      <>
        <TopBar title="Profile" back />
        <Spinner />
      </>
    );

  const isMe = me?._id === user._id;

  const follow = async () => {
    setBusy(true);
    try {
      const d = await api.follow(id);
      setUser({ ...user, followerCount: d.followerCount });
      setFollowed(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title="Profile" back />
      <div className="pad list-gap">
        <div className="profile-head">
          <Avatar name={user.name} size={72} />
          <div>
            <h2 className="display">{user.name}</h2>
            <span className="chip hot" style={{ marginTop: 6 }}>
              {roleLabel(user.role)}
            </span>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            <strong style={{ color: "var(--text)" }}>{user.followerCount ?? 0}</strong> followers
          </div>
          {!isMe && (
            <button className="btn btn-primary btn-sm" onClick={follow} disabled={busy || followed}>
              {followed ? "Following ✓" : "Follow"}
            </button>
          )}
        </div>

        <section className="stack">
          <div className="eyebrow">Favourite albums</div>
          {(!user.favouriteAlbums || user.favouriteAlbums.length === 0) && (
            <Empty glyph="💿" headline="Nothing here yet">
              {user.name.split(" ")[0]} hasn't favourited any albums.
            </Empty>
          )}
          {user.favouriteAlbums?.map((a) => (
            <AlbumCard key={a._id} album={a} />
          ))}
        </section>
      </div>
    </>
  );
}
