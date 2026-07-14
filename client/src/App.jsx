import { createContext, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TabBar from "./components/TabBar";
import Auth from "./screens/Auth";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Create from "./screens/Create";
import Events from "./screens/Events";
import EventDetail from "./screens/EventDetail";
import AlbumDetail from "./screens/AlbumDetail";
import Profile from "./screens/Profile";
import UserProfile from "./screens/UserProfile";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const signIn = ({ user, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      <div className="phone">{user ? <Shell /> : <Auth />}</div>
    </AuthContext.Provider>
  );
}

function Shell() {
  return (
    <>
      <div className="screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/create" element={<Create />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <TabBar />
    </>
  );
}
