export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fmtEventDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function fmtEventTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export const dayNum = (dateStr) => (dateStr ? new Date(dateStr).getDate() : "");
export const monthShort = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, { month: "short" }).toUpperCase()
    : "";

export const initials = (name = "?") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const roleLabel = (role) => (role === "Dj" ? "DJ" : role);

// Deterministic gradient per title, for albums without cover art
const GRADIENTS = [
  "linear-gradient(135deg, #FF5C38, #E33D6F)",
  "linear-gradient(135deg, #3DD6C4, #2E7DD1)",
  "linear-gradient(135deg, #E33D6F, #8A3FFC)",
  "linear-gradient(135deg, #F2A93B, #FF5C38)",
  "linear-gradient(135deg, #2E7DD1, #8A3FFC)",
];
export function coverGradient(seed = "") {
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) | 0;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export const CATEGORY_LABELS = {
  release: "Release",
  concert: "Concert",
  meetup: "Meetup",
  party: "Party",
  other: "Event",
};
