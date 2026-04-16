// src/components/Login.tsx (Prueba 1: Split-Screen)
import { useState } from 'react';
import { Building2, Lock, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      });

      if (res.ok) {
        if (isRegistering) {
          setSuccessMsg('¡Usuario registrado! Ahora inicia sesión.');
          setIsRegistering(false);
          setPassword('');
        } else {
          const data = await res.json();
          localStorage.setItem('archplan_token', data.token);
          localStorage.setItem('archplan_user', email);
          onLoginSuccess();
        }
      } else {
        setError(isRegistering ? 'El usuario ya existe.' : 'Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Error de red. Verifica que el servidor Java esté encendido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // CONTENEDOR PRINCIPAL: Flex row para dividir la pantalla
    <div className="min-h-screen bg-[#0a0d13] flex flex-row">
      
      {/* --- LADO IZQUIERDO: Fotografía Cinemática --- */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          // Esta imagen es temporal, luego podemos poner una real de tus obras
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000" 
          alt="Obra en Construcción"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay oscuro para darle seriedad y destacar el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Texto decorativo de la marca en la esquina inferior */}
        <div className="absolute bottom-16 left-16 z-10 max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-3 rounded-2xl">
              <Building2 size={32} className="text-arch-dark" />
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-white">
              Arch<span className="text-gray-400">Plan</span>
            </h1>
          </div>
          <p className="text-lg text-gray-300 font-light leading-relaxed">
            Plataforma Integral para la Supervisión, Control y Auditoría de Obras de Construcción de Alto Nivel.
          </p>
        </div>
      </div>

      {/* --- LADO DERECHO: Formulario --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-arch-dark relative">
        
        {/* Pequeño adorno geométrico en el fondo */}
        <div className="absolute top-10 right-10 w-40 h-40 border border-gray-800 rounded-full opacity-20"></div>

        <div className="w-full max-w-sm relative z-10">
          
          {/* Logo centrado solo para móvil (hidden on desktop) */}
          <div className="flex flex-col items-center mb-10 lg:hidden">
            <div className="bg-arch-blue/20 p-3 rounded-xl mb-3 border border-arch-blue/30">
              <Building2 size={28} className="text-arch-blue" />
            </div>
            <h2 className="text-2xl font-bold tracking-widest text-white">Arch<span className="text-gray-500">Plan</span></h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h3>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              {isRegistering ? 'Ingresa tus datos para registrarte en el portal.' : 'Bienvenido de nuevo al Portal Ejecutivo.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-3.5 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 p-3.5 rounded-xl flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 size={20} className="shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">Correo Electrónico</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-3.5 text-gray-600" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arquitecto@archplan.com"
                  className="w-full bg-[#13161c] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:border-arch-blue focus:ring-1 focus:ring-arch-blue outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">Contraseña</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-3.5 text-gray-600" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#13161c] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:border-arch-blue focus:ring-1 focus:ring-arch-blue outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-arch-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-arch-blue/20 hover:shadow-arch-blue/40 flex justify-center items-center gap-2 mt-4 cursor-pointer disabled:opacity-50 text-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isRegistering ? 'Crear Cuenta de Personal' : 'Acceder de forma Segura')}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }}
              className="text-xs text-gray-600 hover:text-white transition-colors underline underline-offset-4"
            >
              {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes acceso? Solicita una cuenta de personal'}
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-800 mt-12 uppercase font-bold tracking-widest">
            Acceso Restringido - Propiedad de RDB Constructores S.A.
          </p>
        </div>
      </div>
    </div>
  );
}