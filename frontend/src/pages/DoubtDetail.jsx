import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function DoubtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doubt, setDoubt] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [loadingDoubt, setLoadingDoubt] = useState(false);

  const [redirectTimer, setRedirectTimer] = useState(10);

  const [comment, setComment] = useState("");
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

  /* ---------------- FETCH DOUBT ---------------- */
  useEffect(() => {
    if (!authorized) return;

    const fetchDoubt = async () => {
      try {
        setLoadingDoubt(true);
        const res = await api.get(`/api/doubts/${id}`);
        setDoubt(res.data);
      } catch {
        navigate("/home");
      } finally {
        setLoadingDoubt(false);
      }
    };

    fetchDoubt();
  }, [authorized, id, navigate]);

  /* ---------------- ADD COMMENT (Optimistic) ---------------- */
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    const optimisticComment = {
      commentId: Date.now(),
      username: "You",
      content: comment,
    };

    setDoubt((prev) => ({
      ...prev,
      answers: [...prev.answers, optimisticComment],
    }));

    const contentToSend = comment;
    setComment("");
    setSubmitting(true);

    try {
      const res = await api.post("/api/answer/comment", {
        doubtId: doubt.id,
        content: contentToSend,
      });

      setDoubt((prev) => ({
        ...prev,
        answers: prev.answers.map((a) =>
          a.commentId === optimisticComment.commentId
            ? {
                commentId: res.data.answerId,
                username: res.data.userResponse.username,
                content: res.data.content,
              }
            : a,
        ),
      }));
    } catch {
      setDoubt((prev) => ({
        ...prev,
        answers: prev.answers.filter(
          (a) => a.commentId !== optimisticComment.commentId,
        ),
      }));
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- GLOBAL LOADING ---------------- */
  if (authLoading || loadingDoubt) {
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

  if (!doubt) return null;

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-screen bg-paper flex flex-col">
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

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
          {/* POST */}
          <div className="bg-gray-300/40 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center font-semibold">
                {doubt.userResponse.firstName.charAt(0)}
              </div>
              <p className="font-medium">@{doubt.userResponse.username}</p>
            </div>

            <h1 className="text-3xl font-bold">{doubt.title}</h1>

            <p className="mt-6 text-black/80 text-lg font-medium leading-relaxed">
              {doubt.description}
            </p>
          </div>

          {/* COMMENTS */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Responses</h2>

            {doubt.answers.map((ans) => (
              <div
                key={ans.commentId}
                className="border-l-2 border-black/20 pl-6"
              >
                <p className="text-sm text-black/60 mb-1">@{ans.username}</p>
                <p className="text-black/80">{ans.content}</p>
              </div>
            ))}
          </div>

          {/* ADD COMMENT */}
          <div className="pt-6 border-t border-black/10">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your response..."
              className="w-full border border-black/20 rounded-md p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black"
              rows={3}
            />

            <button
              onClick={handleAddComment}
              disabled={submitting}
              className="mt-4 bg-black text-white px-6 py-2 rounded-full disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Response"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
