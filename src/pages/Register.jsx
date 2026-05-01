import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const initialForm = { name: '', email: '', password: '', confirmPassword: '' };

const Register = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { full_name: form.name.trim() || 'Reader' } }
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setForm(initialForm);
    setSent(true);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-emerald-950">LitBound</h1>
          <p className="mt-2 text-sm font-medium text-stone-600">Create your bookstore and reading account.</p>
        </div>

        {sent ? (
          <div className="space-y-5 rounded-lg bg-emerald-50 p-5 text-center">
            <h2 className="text-xl font-bold text-emerald-950">Verify your email first</h2>
            <p className="text-sm text-emerald-800">
              We sent a confirmation link. Open it, verify your email, then come back and sign in.
            </p>
            <Link to="/login" className="inline-flex rounded-md bg-emerald-900 px-5 py-3 font-bold text-white">
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <input className="w-full rounded-md border border-stone-300 px-4 py-3" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="w-full rounded-md border border-stone-300 px-4 py-3" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full rounded-md border border-stone-300 px-4 py-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
            <input className="w-full rounded-md border border-stone-300 px-4 py-3" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} minLength={6} required />
            <button type="submit" disabled={loading} className="w-full rounded-md bg-emerald-900 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-stone-600">
          Already registered? <Link to="/login" className="font-bold text-emerald-800 hover:underline">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
