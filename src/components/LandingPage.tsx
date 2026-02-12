import React from 'react';
import { Leaf, Calendar, ShoppingCart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-green-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 px-6 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-2">
                    <div className="bg-green-600 p-1.5 rounded-lg shadow-sm shadow-green-200">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 tracking-tight">NutriPlan</h1>
                </div>
                <button
                    onClick={onGetStarted}
                    className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Alimentación Consciente
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black text-stone-900 leading-[1.1]">
                            Tu camino hacia una <span className="text-green-600">vida más sana</span> empieza aquí.
                        </h2>
                        <p className="text-xl text-stone-600 leading-relaxed max-w-xl">
                            Una alimentación sana y variada no solo mejora tu físico; potencia tu energía, aclara tu mente y previene enfermedades. Con NutriPlan, planificar es el primer paso para lograrlo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={onGetStarted}
                                className="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 group"
                            >
                                Empezar ahora
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a
                                href="#features"
                                className="px-8 py-4 bg-white text-stone-700 border-2 border-stone-100 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all flex items-center justify-center"
                            >
                                Saber más
                            </a>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-green-100 rounded-[3rem] blur-2xl opacity-50 -z-10 animate-pulse"></div>
                        <img
                            src="/landing_page_hero.png"
                            alt="Healthy Food"
                            className="rounded-[2.5rem] shadow-2xl shadow-stone-200 w-full object-cover aspect-[4/3]"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-stone-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h3 className="text-3xl font-bold text-stone-900">Todo lo que necesitas para organizarte</h3>
                        <p className="text-stone-600 text-lg">NutriPlan simplifica tu semana para que solo te preocupes de disfrutar de tu comida.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6">
                                <Calendar className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">Calendario Semanal</h4>
                            <p className="text-stone-600 leading-relaxed">
                                Visualiza toda tu semana de un vistazo. Organiza tus desayunos, comidas, cenas y tentempiés de forma rápida y sencilla.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                                <ShoppingCart className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">Lista de la Compra</h4>
                            <p className="text-stone-600 leading-relaxed">
                                Los ingredientes se añaden automáticamente a tu lista. Nunca más olvidarás ese ingrediente clave en el supermercado.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-6">
                                <Leaf className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">Gestión Inteligente</h4>
                            <p className="text-stone-600 leading-relaxed">
                                Clasifica tus productos por supermercado y optimiza tu ruta de compra. Gana tiempo y salud cada día.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Content Section */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 order-2 lg:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
                            alt="Healthy Plate"
                            className="rounded-[2.5rem] shadow-xl"
                        />
                    </div>
                    <div className="lg:w-1/2 order-1 lg:order-2 space-y-8">
                        <h3 className="text-4xl font-bold text-stone-900 leading-tight">
                            ¿Por qué es tan importante comer variado?
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h5 className="text-lg font-bold">Nutrientes Esenciales</h5>
                                    <p className="text-stone-600">Cada color de verdura aporta diferentes fotoquímicos y micronutrientes vitales.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h5 className="text-lg font-bold">Energía Constante</h5>
                                    <p className="text-stone-600">Evita los picos de glucosa con una planificación balanceada de macronutrientes.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h5 className="text-lg font-bold">Digestión Saludable</h5>
                                    <p className="text-stone-600">La fibra de alimentos variados alimenta tu microbiota intestinal correctamente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-green-600 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-green-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-700 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>

                    <div className="relative z-10 space-y-8">
                        <h3 className="text-4xl lg:text-5xl font-black text-white">¿Todo listo para revolucionar tu dieta?</h3>
                        <p className="text-green-50 text-xl max-w-2xl mx-auto">
                            Únete a cientos de personas que ya disfrutan de la tranquilidad de tener su semana bajo control.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-5 bg-white text-green-700 rounded-2xl font-black text-xl hover:bg-green-50 transition-all shadow-xl shadow-green-700/20"
                        >
                            Crear mi primer plan gratis
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-stone-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-bold">NutriPlan</span>
                </div>
                <p className="text-stone-400 text-sm">© 2024 NutriPlan. Come bien, vive mejor.</p>
            </footer>
        </div>
    );
};
