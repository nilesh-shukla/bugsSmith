import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup({ firstName, lastName, email, password, cpassword, role });
      await login({ email, password });
      navigate('/analyze');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-white mb-4">Create an account</h3>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm text-[#9ebedf] mb-1">First name</label>
            <input value={firstName} onChange={(e)=>{ setFirstName(e.target.value); setError(''); }} required type="text" className="w-full mb-4 p-2 rounded-md bg-transparent border border-white/10" />
          </div>
          <div className="w-1/2">
            <label className="block text-sm text-[#9ebedf] mb-1">Last name</label>
            <input value={lastName} onChange={(e)=>{ setLastName(e.target.value); setError(''); }} required type="text" className="w-full mb-4 p-2 rounded-md bg-transparent border border-white/10" />
          </div>
        </div>
        <label className="block text-sm text-[#9ebedf] mb-1">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" className="w-full mb-4 p-2 rounded-md bg-transparent border border-white/10" />
        <label className="block text-sm text-[#9ebedf] mb-1">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" className="w-full mb-6 p-2 rounded-md bg-transparent border border-white/10" />
        <label className="block text-sm text-[#9ebedf] mb-1">Confirm Password</label>
        <input value={cpassword} onChange={(e)=>{ setCpassword(e.target.value); setError(''); }} required type="password" className="w-full mb-6 p-2 rounded-md bg-transparent border border-white/10" />
        <label className="block text-sm text-[#9ebedf] mb-1">Role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full mb-6 p-2 rounded-md bg-transparent border border-white/10">
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-[#047be3] to-[#7856e7] rounded-full text-white font-semibold">
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
