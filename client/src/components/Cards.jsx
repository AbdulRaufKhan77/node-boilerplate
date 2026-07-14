import { Link } from "react-router-dom";
import { Cover, Avatar } from "./UI";
import {
  timeAgo,
  dayNum,
  monthShort,
  roleLabel,
  CATEGORY_LABELS,
} from "../helpers";

export function AlbumCard({ album, byline }) {
  return (
    <Link to={`/album/${album._id}`} className="card fade-in">
      <Cover src={album.coverUrl} seed={album.title} size={56} />
      <div className="meta">
        <div className="name">{album.title}</div>
        <div className="sub">
          {album.artist}
          {byline ? ` · by ${byline}` : ""}
        </div>
      </div>
      <span className="chip hot">Album</span>
    </Link>
  );
}

export function EventCard({ event, when }) {
  const attendees = event.attendees?.length || 0;
  return (
    <Link to={`/events/${event._id}`} className="card fade-in">
      <span className="dateblock">
        <span className="day">{dayNum(event.date)}</span>
        <span className="month">{monthShort(event.date)}</span>
      </span>
      <div className="meta">
        <div className="name">{event.title}</div>
        <div className="sub">
          {[event.location, attendees ? `${attendees} going` : null, when]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>
      <span className="chip live">{CATEGORY_LABELS[event.category] || "Event"}</span>
    </Link>
  );
}

export function SongCard({ song }) {
  const album = song.album;
  const inner = (
    <>
      <Cover src={album?.coverUrl} seed={song.title} size={56} fontSize={20} />
      <div className="meta">
        <div className="name">{song.title}</div>
        <div className="sub">
          {song.artist}
          {album?.title ? ` · ${album.title}` : ""}
        </div>
      </div>
      <span className="chip">Track</span>
    </>
  );
  if (album?._id) {
    return (
      <Link to={`/album/${album._id}`} className="card fade-in">
        {inner}
      </Link>
    );
  }
  return <div className="card fade-in">{inner}</div>;
}

export function UserRow({ user, trailing }) {
  return (
    <Link to={`/user/${user._id}`} className="card fade-in">
      <Avatar name={user.name} size={44} />
      <div className="meta">
        <div className="name">{user.name}</div>
        <div className="sub">
          {roleLabel(user.role)} · {user.followerCount ?? 0} followers
        </div>
      </div>
      {trailing}
    </Link>
  );
}

export function feedCard(item, i) {
  const d = item.data || {};
  const when = timeAgo(item.createdAt);
  switch (item.type) {
    case "album":
      return <AlbumCard key={d._id || i} album={d} byline={d.user?.name} />;
    case "event":
      return <EventCard key={d._id || i} event={d} when={when} />;
    case "song":
      return <SongCard key={d._id || i} song={d} />;
    default:
      return null;
  }
}
