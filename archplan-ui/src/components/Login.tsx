// src/components/Login.tsx
import { useState } from 'react';
import { Building2, Lock, Mail, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // ¡LA MAGIA! Guardamos el pase VIP en el navegador
        localStorage.setItem('archplan_token', data.token);
        onLoginSuccess(); // Le avisamos a App.tsx que ya entramos
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-arch-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-arch-card p-8 rounded-2xl border border-gray-800 shadow-2xl">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-arch-blue/10 p-4 rounded-full mb-4">
            <Building2 size={40} className="text-arch-blue" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-white">
            Arch<span className="text-arch-text-gray">Plan</span>
          </h1>
          <p className="text-sm text-arch-text-gray mt-2">Executive BIM Access</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-arch-dark border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-arch-blue transition-colors"
                placeholder="ricardo@archplan.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-arch-dark border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-arch-blue transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-arch-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 transition-colors flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Access Workspace'}
          </button>
        </form>

      </div>
    </div>
  );
}