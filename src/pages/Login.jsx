import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password
    });

    setLoading(false);
    if (error) setMessage(error.message);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-emerald-950">LitBound</h1>
          <p className="mt-2 text-sm font-medium text-stone-600">Buy, collect, and read your books in one place.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {message && <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p>}
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="reader@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-900 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          New to LitBound? <Link to="/register" className="font-bold text-emerald-800 hover:underline">Create account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
