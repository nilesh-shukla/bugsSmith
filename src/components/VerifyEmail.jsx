import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { useNavigate } from 'react-router-dom';

function VerifyEmail(){
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if(!token){
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    apiFetch(`/verify-email?token=${encodeURIComponent(token)}`, { method: 'GET' })
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully');
        // redirect to home/login after short delay
        setTimeout(() => navigate('/', { replace: true }), 2500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed');
      });
  }, [navigate]);

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white/5 rounded-xl text-center">
      {status === 'loading' && <p className="text-sm text-[#9fc7e4]">{message}</p>}
      {status === 'success' && <p className="text-green-400">{message} — redirecting...</p>}
      {status === 'error' && <p className="text-red-400">{message}</p>}
    </div>
  );
}

export default VerifyEmail;
