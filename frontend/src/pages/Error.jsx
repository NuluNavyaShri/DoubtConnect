import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds === 0) {
      navigate("/auth", { replace: true });
    }

    return () => clearInterval(timer);
  }, [seconds, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="DoubtConnect"
            className="h-24 w-auto rounded-md"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="mt-2 text-xl font-semibold">Page not found</p>

        {/* Message */}
        <p className="mt-4 text-black/60">
          The page you’re looking for doesn’t exist or has moved.
        </p>

        {/* Countdown */}
        <p className="mt-6 text-sm text-black/50">
          Redirecting to authentication in{" "}
          <span className="font-semibold">{seconds}</span> seconds…
        </p>

        {/* Fallback action */}
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
