import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to BugsSmith</h2>
          <p className="text-[#9ebedf] mb-6">Sign in to continue to your dashboard and start analyzing suspicious accounts.</p>
          <div className="flex justify-center gap-4">
            <Link to="/auth/login" className="px-6 py-2 bg-blue-600 rounded-full text-white font-semibold">Log in</Link>
            <Link to="/auth/signup" className="px-6 py-2 border border-white/20 rounded-full text-white font-semibold">Sign up</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
