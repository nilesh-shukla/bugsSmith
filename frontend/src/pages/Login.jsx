import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-white mb-4">Log in</h3>
        <label className="block text-sm text-[#9ebedf] mb-1">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" className="w-full mb-4 p-2 rounded-md bg-transparent border border-white/10" />
        <label className="block text-sm text-[#9ebedf] mb-1">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" className="w-full mb-6 p-2 rounded-md bg-transparent border border-white/10" />
        <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-[#047be3] to-[#7856e7] rounded-full text-white font-semibold">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="mt-4 text-center text-sm text-[#9ebedf]">
          Don't have an account? <a href="/auth/signup" className="text-white font-semibold hover:underline">Sign up</a>
        </div>
      </form>
    </div>
  );
}
