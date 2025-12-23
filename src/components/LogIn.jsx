import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faTimes } from '@fortawesome/free-solid-svg-icons';

function LogIn({ asModal = false, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    // Placeholder auth flow - replace with real API call
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@bugssmith.local' && password === 'password') {
        if (asModal && typeof onClose === 'function') onClose();
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    }, 700);
  };

  const containerClass = asModal
    ? 'w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6'
    : 'max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl shadow-lg border border-white/10 p-8';

  const inner = (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/web-logo.png" alt="BugsSmith" className="w-12" />
          {!asModal && <h2 className="text-2xl text-[#dceefc] font-semibold">Welcome back</h2>}
        </div>
        {asModal && (
          <button onClick={onClose} className="text-white/80 p-2 -mr-2">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {!asModal && (
        <p className="text-sm text-[#9fc7e4] mt-1 mb-4">Sign in to access your dashboard</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <div className="flex items-center gap-2 text-sm text-[#9fc7e4] mb-2">Email</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faEnvelope} /></span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@company.com"
              autoComplete="username"
            />
          </div>
        </label>

        <label className="block">
          <div className="flex items-center gap-2 text-sm text-[#9fc7e4] mb-2">Password</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faLock} /></span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>
        </label>

        <div className="flex items-center justify-between text-sm text-[#9fc7e4]">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-400" />
            <span>Remember me</span>
          </label>
          <Link to="/" className="text-blue-300 hover:underline">Forgot?</Link>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-[#66aaed] via-[#4392e0] to-[#137ced] text-white font-semibold shadow-md hover:scale-[1.02] transition-transform duration-150"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {!asModal && (
        <div className="mt-6 text-center text-sm text-[#9fc7e4]">
          Don't have an account? <Link to="/" className="text-blue-300 hover:underline">Get started</Link>
        </div>
      )}
    </div>
  );

  if (asModal) return inner;

  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#071a30] to-[#08345a] p-6">{inner}</div>;
}

export default LogIn;