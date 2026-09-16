import { useState } from "react";
import FloatingAlert from "../components/FloatingAlert";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  firstName: "",
  lastName: "",
  password: "",
};

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    message: "",
    type: "error",
  });

  // ---------- helpers ----------
  const resetForm = () => setForm(initialState);

  const handleToggle = (nextMode) => {
    setMode(nextMode);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email) => emailRegex.test(email.trim());

  const isValid =
    mode === "login"
      ? isValidEmail(form.username) && form.password.trim()
      : isValidEmail(form.username) &&
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.password.trim();

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);

    const payload =
      mode === "login"
        ? {
            username: form.username,
            password: form.password,
          }
        : {
            username: form.username,
            firstName: form.firstName,
            lastName: form.lastName,
            password: form.password,
          };

    try {
      const res = await api.post(
        mode === "login" ? "/auth/login" : "/auth/signup",
        payload,
      );

      //   if (!res.ok) {
      //     throw new Error("Authentication failed");
      //   }

      const data = await res.data;
      console.log("Success:", data);

      if (mode === "signup") {
        setAlert({
          message: "Sign up successful",
          type: "success",
        });

        setMode("login");
        resetForm();
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err.message);

      setAlert({
        message:
          mode === "signup"
            ? "Signup failed. Try again."
            : "Invalid credentials.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <FloatingAlert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "error" })}
      />

      <div className="w-full max-w-md border border-black/10 rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-black/60 mt-2">
            {mode === "login"
              ? "Continue where you left off."
              : "Ask better questions. Share better answers."}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm mb-1">Username</label>
                <input
                  name="username"
                  type="email"
                  placeholder="you@example.com"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">First name</label>
                  <input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Last name</label>
                  <input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </>
          )}

          {mode === "login" && (
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                name="username"
                type="email"
                placeholder="you@example.com"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-black text-white py-2 rounded-full text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing…" : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 text-sm">
          {mode === "login" ? (
            <>
              New to DoubtConnect?{" "}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => handleToggle("signup")}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => handleToggle("login")}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
