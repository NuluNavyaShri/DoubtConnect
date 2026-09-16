import { useNavigate } from "react-router-dom";

export default function DoubtCard({ doubt }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/doubt/${doubt.id}`)}
      className="cursor-pointer border border-black/10 rounded-xl p-6 bg-white hover:bg-black/[0.02] transition"
    >
      {/* Username */}
      <p className="text-sm text-black/50 mb-2">
        @{doubt.userResponse.username}
      </p>

      {/* Title */}
      <h2 className="text-2xl font-bold leading-tight line-clamp-2">
        {doubt.title}
      </h2>

      {/* Description */}
      <p className="mt-3 text-black/70 font-semibold text-base line-clamp-3">
        {doubt.description}
      </p>
    </div>
  );
}
