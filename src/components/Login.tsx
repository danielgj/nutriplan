import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
        } catch (err: any) {
            console.error(err);
            let msg = "Ha ocurrido un error.";
            if (err.code === 'auth/invalid-credential') msg = "Credenciales incorrectas.";
            if (err.code === 'auth/email-already-in-use') msg = "El email ya está registrado.";
            if (err.code === 'auth/weak-password') msg = "La contraseña es muy débil.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            setError("Error al iniciar con Google.");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-600 p-3 rounded-xl shadow-lg shadow-green-200">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-stone-800 tracking-tight mb-2">Bienvenido a NutriPlan</h1>
                    <p className="text-stone-500">
                        {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 text-left">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLogin ? 'Entrar' : 'Registrarse'}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-stone-500">O continúa con</span>
                    </div>
                </div>

                <div>
                    <button
                        onClick={handleGoogle}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium py-2 px-4 rounded-lg transition-all hover:shadow-sm group"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Google
                    </button>
                </div>

                <p className="text-sm text-stone-500 mt-4">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="ml-1 text-green-600 hover:text-green-700 font-medium hover:underline"
                    >
                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};
