import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Nome é obrigatório');
          setLoading(false);
          return;
        }
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / brand */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Megatron</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === 'login'
              ? 'Entre na sua conta'
              : 'Crie uma conta para começar'}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl bg-white"
        >
          <div className="divide-y divide-zinc-100">
            {mode === 'register' && (
              <div className="px-5 py-4">
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            )}
            <div className="px-5 py-4">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>
            <div className="px-5 py-4">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>
          </div>

          {error && (
            <div className="mx-5 mt-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
              {error}
            </div>
          )}

          <div className="px-5 py-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition active:bg-zinc-800 disabled:opacity-60"
            >
              {loading
                ? 'Processando...'
                : mode === 'login'
                  ? 'Entrar'
                  : 'Criar conta'}
            </button>
          </div>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-sm text-zinc-500">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button
                type="button"
                className="font-semibold text-zinc-900 hover:underline"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button
                type="button"
                className="font-semibold text-zinc-900 hover:underline"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
