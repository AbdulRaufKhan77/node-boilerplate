import { NavLink } from "react-router-dom";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" {...S}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" {...S}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" {...S}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" {...S}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...S} strokeWidth="2.2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function TabBar() {
  const cls = ({ isActive }) => "tab" + (isActive ? " active" : "");
  return (
    <nav className="tabbar">
      <NavLink to="/" end className={cls}>
        <HomeIcon />
        Feed
      </NavLink>
      <NavLink to="/search" className={cls}>
        <SearchIcon />
        Search
      </NavLink>
      <NavLink to="/create" className="tab-create" aria-label="Create">
        <span className="plus">
          <PlusIcon />
        </span>
      </NavLink>
      <NavLink to="/events" className={cls}>
        <CalendarIcon />
        Events
      </NavLink>
      <NavLink to="/profile" className={cls}>
        <UserIcon />
        Profile
      </NavLink>
    </nav>
  );
}
