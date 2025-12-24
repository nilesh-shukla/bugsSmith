import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faTimes } from '@fortawesome/free-solid-svg-icons';
import CreateAccount from './CreateAccount';

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

  const [createOpen, setCreateOpen] = useState(false);

  const containerClass = asModal
    ? 'w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6'
    : 'max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl shadow-lg border border-white/10 p-8';

  const inner = (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <img src="/web-logo.png" alt="BugsSmith" className="w-10" />
          <h1 className='text-2xl text-[#a2baf4] kode-font'>BugsSmith</h1>
        </div>
        {asModal && (
          <button onClick={onClose} className="text-white hover:cursor-pointer">
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
          <div className="flex items-center gap-2 text-sm text-[#9fc7e4] mb-1">Email</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faEnvelope} /></span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] focus:outline-none focus:ring-1 focus:ring-blue-400 duration-300"
              placeholder="you@company.com"
              autoComplete="username"
            />
          </div>
        </label>

        <label className="block">
          <div className="flex items-center gap-2 text-sm text-[#9fc7e4] mb-1">Password</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faLock} /></span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] focus:outline-none focus:ring-1 focus:ring-blue-400 duration-300"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>
        </label>

        <div className="flex items-center justify-between text-sm text-[#9fc7e4]">
          <div>
            <button type="button" onClick={() => setCreateOpen(true)} className="text-sm text-blue-300 underline cursor-pointer">Create account</button>
          </div>
          <Link to="/" className="text-blue-300 hover:underline">Forgot Password?</Link>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-full cursor-pointer bg-gradient-to-r from-[#66aaed] via-[#4392e0] to-[#137ced] text-white hover:scale-[1.08] transition-transform duration-300"
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

  if (asModal) {
    return (
      <>
        {inner}
        {createOpen && (
          <div className="fixed inset-0 z-[11000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCreateOpen(false)} />
            <div className="relative z-10">
              <CreateAccount asModal onClose={() => setCreateOpen(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#071a30] to-[#08345a] p-6">
      {inner}
      {createOpen && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCreateOpen(false)} />
          <div className="relative z-10">
            <CreateAccount asModal onClose={() => setCreateOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LogIn;

// Render CreateAccount modal when requested
// (placed at file end to avoid interfering with component return)
