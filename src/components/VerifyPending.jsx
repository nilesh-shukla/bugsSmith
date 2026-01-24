import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";
import { div, p } from "framer-motion/client";

function VerifyPending() {

    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('Verification email sent. Please check your inbox.');
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const pollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        if(token){
            (async () => {
                setStatus('verifying');
                setMessage('Verifying your email, please wait...');
                try{
                    const data = await apiFetch(`/verify-email?token=${encodeURIComponent(token)}`, { method: 'GET'});
                    setStatus('success');
                    setMessage(data?.message || 'Email verified successfully.');
                    clearInterval(pollRef.current);
                    //redirect to login/home after short pause
                    setTimeout(() => navigate('/', { replace: true }), 2000);
                }
                catch(err){ 
                    setStatus('error');
                    setMessage(err?.message || 'Verification failed or token invalid/expired.');
                }
            })();
            return;
        }

        if(email) {
            pollRef.current = setInterval(async () => {
                try {
                    const r = await apiFetch(`/check-verification?email=${encodeURIComponent(email)}`, { method: 'GET' });

                    if(r && r.verified) {
                        clearInterval(pollRef.current);
                        setStatus('success');
                        setMessage('Email verified. Redirecting...');
                        setTimeout(() => navigate('/', { replace: true }), 1500);;
                    }
                }
                catch(e) {
                    console.debug('Polling error', e);
                }
            }, 5000);
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [navigate]);

    //Cooldown timer for resend button
    useEffect(() => {
        if(!cooldown) return;
        const t = setInterval(() => {
            setCooldown(c => {
                if(c <=1) {
                    clearInterval(t);
                    return 0;
                }
                return c-1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleResend = async () => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        if(!email) {
            setMessage('No email available to resend to.');
            return;
        }
        setResendLoading(true);
        try {
            const data = await apiFetch('/resend-verification', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setMessage(data?.message || 'Verification email resent. Check your inbox.');
            setCooldown(30);
        }
        catch(err) {
            setMessage(err?.message || 'Failed to resend verification email.');
        }
        finally {
            setResendLoading(false);
        }
    };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white/5 rounded-xl text-center">
        {status === 'pending' && (
            <>
                <p className="text-sm text-[#9fc7e4]">{message}</p>
                <div className="mt-4">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading || cooldown > 0}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                        {resendLoading ? 'Sending...': cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend verification email'}
                    </button>
                </div>
            </>
        )}
        {status === 'verifying' && <p className="text-sm text-[#9fc7e4]">{message}</p>}
        {status === 'success' && <p className="text-sm text-green-400">{message}</p>}
        {status === 'error' && (
            <>
                <p className="text-red-400 mb-4">{message}</p>
                <p className="text-sm text-[#9fc7e4]">If you did not receive the email, request a new verification email from your account page.</p>
            </>
        )}
    </div>    
  );
}

export default VerifyPending