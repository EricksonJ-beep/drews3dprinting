import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(email, password);
      const to = location.state?.from?.pathname || '/';
      navigate(to, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">{mode === 'signin' ? 'Sign In' : 'Create Account'}</h1>
      <form onSubmit={onSubmit} className="bg-white border rounded-lg p-6 mt-6 space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn-primary w-full" type="submit">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
        <button type="button" className="w-full text-sm text-brand-blue mt-2" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Create an account' : 'Have an account? Sign in'}
        </button>
      </form>
    </section>
  );
}
