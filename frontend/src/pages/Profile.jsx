import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(10);

  const [activeTab, setActiveTab] = useState("doubts");
  const [logoutOpen, setLogoutOpen] = useState(false);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* ---------------- UNAUTHORIZED COUNTDOWN ---------------- */
  useEffect(() => {
    if (!authorized && !loading) {
      const timer = setInterval(() => {
        setRedirectTimer((t) => t - 1);
      }, 1000);

      if (redirectTimer === 0) {
        navigate("/auth", { replace: true });
      }

      return () => clearInterval(timer);
    }
  }, [authorized, loading, redirectTimer, navigate]);

  /* ---------------- FETCH STATS ---------------- */
  useEffect(() => {
    if (!authorized) return;

    const fetchStats = async () => {
      try {
        const res = await api.get("/api/user/stats");
        setData(res.data);
      } catch {
        navigate("/auth");
      }
    };

    fetchStats();
  }, [authorized, navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    navigate("/auth");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  /* ---------------- UNAUTHORIZED ---------------- */
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

  if (!data) return null;

  /* ---------------- MAIN PAGE ---------------- */

  return (
    <div className="h-screen bg-paper flex flex-col">
      {/* ---------------- HEADER ---------------- */}
      <header className="flex-shrink-0 border-b border-black/10 bg-paper z-20">
        <div className="flex items-center justify-between px-6 py-4 w-[100%] mx-auto">
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

      {/* ---------------- SCROLLABLE CONTENT ---------------- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* ---------------- PROFILE INFO ---------------- */}
          <section>
            <div className="flex gap-8 items-center">
              <div className="h-24 w-24 rounded-full bg-black/10 flex items-center justify-center text-2xl font-semibold">
                {data.user.firstName.charAt(0)}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {data.user.firstName} {data.user.lastName}
                </h2>

                <p className="text-black/50 mt-1">@{data.user.username}</p>

                <div className="flex gap-8 mt-4 text-sm">
                  <div>
                    <span className="font-semibold">{data.totalDoubts}</span>{" "}
                    Doubts
                  </div>
                  <div>
                    <span className="font-semibold">{data.totalAnswers}</span>{" "}
                    Answers
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- TOGGLER ---------------- */}
          <section className="border-t border-black/10 mt-10">
            <div className="flex justify-center gap-16 text-sm font-medium relative">
              <button
                onClick={() => setActiveTab("doubts")}
                className={`py-4 ${
                  activeTab === "doubts" ? "text-black" : "text-black/40"
                }`}
              >
                Doubts
              </button>

              <button
                onClick={() => setActiveTab("answers")}
                className={`py-4 ${
                  activeTab === "answers" ? "text-black" : "text-black/40"
                }`}
              >
                Answers
              </button>
            </div>

            <div className="relative">
              <div
                className={`h-[2px] bg-black transition-all duration-300 ${
                  activeTab === "doubts" ? "w-1/2 left-0" : "w-1/2 left-1/2"
                } absolute`}
              />
            </div>
          </section>

          {/* ---------------- CONTENT ---------------- */}
          <section className="py-10 space-y-6">
            {activeTab === "doubts" &&
              data.doubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="border border-black/10 rounded-xl p-6 bg-white cursor-pointer hover:bg-black/[0.02]"
                  onClick={() => navigate(`/doubt/${doubt.id}`)}
                >
                  <h3 className="text-xl font-bold">{doubt.title}</h3>
                  <p className="mt-2 text-black/60 line-clamp-2">
                    {doubt.description}
                  </p>
                </div>
              ))}

            {activeTab === "answers" &&
              data.answers.map((answer) => (
                <div
                  key={answer.answerId}
                  className="border border-black/10 rounded-xl p-6 bg-white cursor-pointer hover:bg-black/[0.02]"
                  onClick={() => navigate(`/doubt/${answer.doubtResponse.id}`)}
                >
                  <p className="text-sm text-black/50 mb-2">
                    On: {answer.doubtResponse.title}
                  </p>
                  <p className="text-black/70">{answer.content}</p>
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  );
}
