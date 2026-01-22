import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/api';
import { useNavigate } from 'react-router-dom';

function CreateAccount({ asModal = false, onClose }) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const usernameValid = /^[A-Za-z0-9_]{6,}$/.test(username);

    if (!firstName || !lastName || !username || !email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (!usernameValid) {
      setError('Username must be at least 6 characters and contain only letters, numbers, or underscores.');
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    try{
      const data = await apiFetch('/signup', {
        method: 'POST',
        body: JSON.stringify({
          firstName, lastName, username, email, password
        })
      });

      // If backend reports email send failure, show error to user
      if (data && typeof data.message === 'string' && /failed/i.test(data.message)) {
        setError(prev => ({ ...prev, general: data.message }));
      } else {
        // Normal success: instruct user to check their inbox
        alert('Account created — please check your email for the verification link.');
        if (typeof onClose === 'function') onClose();
        navigate('/');
      }
    }
    catch(err){
      if(err.message.includes('Email')) setError({ email: err.message });
      else if(err.message.includes('Username')) setError({ username: err.message });
      else setError({ general: err.message });
    }
    finally{
      setLoading(false);
    }
  };

  const containerClass = asModal
    ? 'w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6'
    : 'max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl shadow-lg border border-white/10 p-8';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-10">
        {asModal && (
          <button onClick={() => typeof onClose === 'function' ? onClose() : null} className="p-2 rounded-md hover:bg-white/5 hover:cursor-pointer duration-150 text-[#dbeffd]">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        )}
        <div className="flex items-center">
          <img src="/web-logo.png" alt="BugsSmith" className="w-10" />
          <h1 className='text-2xl text-[#a2baf4] kode-font'>BugsSmith</h1>
        </div>
      </div>

      {error.general && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[#9fc7e4] mb-1 block">First name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faUser} /></span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none" placeholder="First Name" />
            </div>
          </div>
          <div>
            <label className="text-sm text-[#9fc7e4] mb-1 block">Last Name</label>
            <div className="relative">
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-3 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none" placeholder="Last Name" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-[#9fc7e4] mb-1 block">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faUser} /></span>
            <input value={username} onChange={(e) => {
              setUsername(e.target.value);
              setError(prev => ({ ...prev, username: null }));
              }} className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none" placeholder="username_123" />
            {error.username && (
              <div className="text-red-500 text-sm mt-1">*{error.username}</div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-[#9fc7e4] mb-1 block">Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faEnvelope} /></span>
            <input value={email} onChange={(e) => {
              setEmail(e.target.value);
              setError(prev => ({ ...prev, email: null })); //If user types again the error message goes away
              }} className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none" placeholder="you@example.com" />
            {error.email && (
              <div className="text-red-500 text-sm mt-1">*{error.email}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[#9fc7e4] mb-1 block">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faLock} /></span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none" placeholder="Password" />
            </div>
          </div>
          <div>
            <label className="text-sm text-[#9fc7e4] mb-1 block">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fc0e8]"><FontAwesomeIcon icon={faLock} /></span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#08172a] text-[#dff4ff] placeholder:text-[#6f9fbf] border border-white/5 focus:outline-none" placeholder="Confirm" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2 rounded-full bg-gradient-to-r from-[#66aaed] via-[#4392e0] to-[#137ced] text-white hover:scale-105 cursor-pointer duration-300 mt-2">{loading ? 'Creating...' : 'Create account'}</button>
      </form>

      {!asModal && <div className="mt-4 text-sm text-[#9fc7e4]">Already have an account? <Link to="/" className="text-blue-300 hover:underline">Sign in</Link></div>}
    </div>
  );
}

export default CreateAccount;
