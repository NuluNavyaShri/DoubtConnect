import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import DoubtCard from "../components/DoubtCard";

export default function Home() {
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [feed, setFeed] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [redirectTimer, setRedirectTimer] = useState(10);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* -------- UNAUTHORIZED COUNTDOWN -------- */
  useEffect(() => {
    if (!authorized && !authLoading) {
      const timer = setInterval(() => {
        setRedirectTimer((t) => t - 1);
      }, 1000);

      if (redirectTimer === 0) {
        navigate("/auth", { replace: true });
      }

      return () => clearInterval(timer);
    }
  }, [authorized, authLoading, redirectTimer, navigate]);

  /* ---------------- FETCH FEED ---------------- */
  useEffect(() => {
    if (!authorized) return;

    const fetchFeed = async () => {
      try {
        const res = await api.get("/api/doubts/feed");
        setFeed(res.data);
      } catch (err) {
        console.error("Feed fetch failed");
      }
    };

    fetchFeed();
  }, [authorized]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    navigate("/auth");
  };

  /* ---------------- STATES ---------------- */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-center px-6">
        <div>
          <h1 className="text-3xl font-bold">UNAUTHORIZED</h1>
          <p className="mt-2 text-black/60">
            You are not authenticated to view this page.
          </p>
          <p className="mt-6 text-sm text-black/50">
            Redirecting to login in{" "}
            <span className="font-semibold">{redirectTimer}</span> seconds…
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="mt-8 underline text-sm font-medium"
          >
            Go to login now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-paper flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-paper border-b border-black/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div
            className="flex gap-3 items-end cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img src="/logo.png" className="h-10 rounded-md" />
            <span className="font-bold text-[25px]">DoubtConnect</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setLogoutOpen(!logoutOpen)}
              className="text-2xl px-2"
            >
              ⋮
            </button>

            {logoutOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-black/10 rounded-md shadow-md w-32 text-sm">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-black/5"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-black/5"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SCROLLABLE CENTER */}
      <div className="flex-1 flex justify-center pt-[88px] pb-[72px] overflow-hidden">
        <main className="w-full max-w-3xl overflow-y-auto px-4 space-y-8 scrollbar-hide">
          {feed.map((doubt) => (
            <DoubtCard key={doubt.id} doubt={doubt} />
          ))}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-paper border-t border-black/10">
        <div className="py-3 flex justify-around items-center">
          <Link to="/home" className="font-semibold">
            <img src="/home.svg" className="w-8" />
          </Link>
          <Link to="/add" className="font-semibold">
            <img src="/plus.svg" className="w-8" />
          </Link>{" "}
          <Link to="/profile" className="font-semibold">
            <img src="/profile.svg" className="w-8" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
