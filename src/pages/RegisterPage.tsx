import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/orderCheckoutAuthService';
import { useToast } from '../hooks/useToast';

export function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    authService
      .register(name, email, password)
      .then(() => {
        toast.show('Account created!');
        navigate('/account');
      })
      .catch((err: Error) => setError(err.message));
  }

  return (
    <div className="max-w-[440px] mx-auto px-margin-mobile py-space-2xl">
      <h1 className="font-headline-lg text-headline-lg-mobile text-deep-obsidian font-light mb-1">Create Account</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">Join LUMEN for a personalized experience (demo).</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        <label className="flex flex-col gap-1">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Full Name *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border border-slate-border rounded font-body-md text-body-md focus:outline-none focus:border-secondary" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Email Address *</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 border border-slate-border rounded font-body-md text-body-md focus:outline-none focus:border-secondary" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Password *</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="px-3 py-2 border border-slate-border rounded font-body-md text-body-md focus:outline-none focus:border-secondary" />
        </label>
        {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
        <button type="submit" className="mt-1 py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
          Create Account
        </button>
      </form>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
