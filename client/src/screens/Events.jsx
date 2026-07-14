import { useEffect, useState } from "react";
import { api } from "../api";
import { TopBar, Spinner, Empty } from "../components/UI";
import { EventCard } from "../components/Cards";

export default function Events() {
  const [tab, setTab] = useState("public");
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setEvents(null);
    setError("");
    const load = tab === "public" ? api.publicEvents() : api.myEvents();
    load.then(setEvents).catch((e) => setError(e.message));
  }, [tab]);

  const upcoming = events
    ?.slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <TopBar title="Events" />
      <div className="pad list-gap">
        <div className="segmented">
          <button className={tab === "public" ? "on" : ""} onClick={() => setTab("public")}>
            Happening
          </button>
          <button className={tab === "mine" ? "on" : ""} onClick={() => setTab("mine")}>
            My events
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {!events && !error && <Spinner />}
        {upcoming && upcoming.length === 0 && (
          <Empty glyph="🎪" headline="Nothing on the calendar">
            {tab === "public"
              ? "No public events yet — be the one who throws the first party."
              : "You haven't created any events. Hit + to publish one."}
          </Empty>
        )}
        {upcoming && (
          <div className="stack">
            {upcoming.map((ev) => (
              <EventCard key={ev._id} event={ev} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
