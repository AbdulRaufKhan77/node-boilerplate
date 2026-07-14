const BASE = "http://localhost:3000";

export const mediaUrl = (p) =>
  p ? `${BASE}/${String(p).replace(/\\/g, "/")}` : null;

const getToken = () => localStorage.getItem("token");

async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: form ? form : body ? JSON.stringify(body) : undefined,
  });

  // Token expired mid-session — clear and send back to auth
  if (res.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Session expired");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  // auth / users
  register: (b) => request("/users/register", { method: "POST", body: b }),
  login: (b) => request("/users/login", { method: "POST", body: b }),
  profile: () => request("/users/profile"),
  userById: (id) => request(`/users/${id}`),
  follow: (id) => request(`/users/addFollower/${id}`, { method: "POST" }),

  // discover
  feed: (page = 1) => request(`/discover/feed?page=${page}&limit=20`),
  search: (q) => request(`/discover/search?q=${encodeURIComponent(q)}`),
  trending: () => request("/discover/trending?limit=10"),

  // albums
  myAlbums: () => request("/albums/getAlbums"),
  albumById: (id) => request(`/albums/${id}`),
  addAlbum: (form) => request("/albums/addAlbum", { method: "POST", form }),
  addFavourite: (albumId) =>
    request("/albums/addFavouriteAlbum", { method: "POST", body: { albumId } }),

  // songs
  songsByAlbum: (albumId) => request(`/songs/getSongs?albumId=${albumId}`),
  addSong: (b) => request("/songs/addSongs", { method: "POST", body: b }),

  // events
  publicEvents: () => request("/events/getPublicEvents"),
  myEvents: () => request("/events/getEvents"),
  eventById: (id) => request(`/events/${id}`),
  addEvent: (b) => request("/events/addEvent", { method: "POST", body: b }),
  addComment: (id, comment) =>
    request(`/events/addCommentsOnEvent/${id}`, { method: "POST", body: { comment } }),
  attend: (id) => request(`/events/addAttendee/${id}`, { method: "POST" }),
};
