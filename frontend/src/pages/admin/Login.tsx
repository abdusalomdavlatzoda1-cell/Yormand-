import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm">
        <div className="text-2xl font-display font-semibold text-brand-900 mb-1">Yormand Admin</div>
        <p className="text-sm text-brand-900/50 mb-6">Sign in to manage the website</p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>}

        <label className="block text-sm font-medium text-brand-900 mb-1.5">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-brand-200 px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />

        <label className="block text-sm font-medium text-brand-900 mb-1.5">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-brand-200 px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
