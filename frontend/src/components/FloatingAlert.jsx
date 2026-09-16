import { useEffect } from "react";

export default function FloatingAlert({
  message,
  type = "success", // success | error | info
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: "bg-black", //"bg-green-300",
    error: "bg-black", //"bg-red-300",
    info: "bg-black",
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`text-white px-12 py-3 rounded-lg shadow-lg animate-fade-in ${styles[type]}`}
      >
        {message}
      </div>
    </div>
  );
}
