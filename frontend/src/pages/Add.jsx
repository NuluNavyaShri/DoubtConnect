import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import FloatingAlert from "../components/FloatingAlert";

const Add = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    message: "",
    type: "error",
  });

  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState(10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  /* ---------------- UNAUTHORIZED COUNTDOWN ---------------- */
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

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);

    try {
      const res = await api.post("/api/doubts/post", {
        title: title.trim(),
        description: description.trim(),
      });

      // Navigate to newly created doubt
      navigate(`/doubt/${res.data.id}`);
    } catch {
      setAlert({
        message: "Failed to publish. Try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (authLoading) {
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
            You are not authenticated to publish.
          </p>
          <p className="mt-6 text-sm text-black/50">
            Redirecting in{" "}
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

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-screen bg-paper flex flex-col">
      <FloatingAlert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "error" })}
      />

      {/* HEADER */}
      <header className="flex-shrink-0 border-b border-black/10 bg-paper">
        <div className="flex items-center justify-between px-6 py-4 w-[100%] mx-auto">
          <div
            className="flex gap-3 items-end cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img src="/logo.png" className="h-10 rounded-md" />
            <span className="font-bold text-[25px]">DoubtConnect</span>
          </div>
        </div>
      </header>

      {/* WRITING SURFACE */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
          {/* TITLE INPUT */}
          <input
            type="text"
            placeholder="Title of your doubt..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold outline-none border-none bg-transparent placeholder-black/30"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Explain your doubt clearly and thoughtfully..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[200px] text-lg leading-relaxed font-medium outline-none border-none resize-none bg-transparent placeholder-black/30"
          />

          {/* ACTION */}
          <div className="pt-6 border-t border-black/10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim() || submitting}
              className="bg-black text-white px-8 py-2 rounded-full disabled:opacity-40"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
