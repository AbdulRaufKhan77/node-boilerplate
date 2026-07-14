import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../App";
import { Wordmark, Spinner, Empty } from "../components/UI";
import { feedCard } from "../components/Cards";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

export default function Home() {
  const { user } = useAuth();
  const [feed, setFeed] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .feed()
      .then((d) => setFeed(d.feed))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <header className="topbar">
        <div style={{ flex: 1 }}>
          <Wordmark />
          <h2 className="display" style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>
            {greeting()}, {user?.name?.split(" ")[0]}
          </h2>
        </div>
      </header>

      <div className="pad list-gap">
        <div className="eyebrow">What's moving in the scene</div>
        {error && <div className="error-msg">{error}</div>}
        {!feed && !error && <Spinner />}
        {feed && feed.length === 0 && (
          <Empty glyph="🌃" headline="The scene is quiet">
            Nothing public yet — hit the + button and drop the first album or event.
          </Empty>
        )}
        {feed && <div className="stack">{feed.map(feedCard)}</div>}
      </div>
    </>
  );
}
