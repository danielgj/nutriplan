import React, { useState } from 'react';
import { Leaf, Calendar, ShoppingCart, LayoutGrid, LogOut } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'calendar' | 'shopping' | 'dashboard';
    onNavigate: (view: 'calendar' | 'shopping' | 'dashboard') => void;
    onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-200 px-3 sm:px-4 flex items-center justify-between z-30 shadow-sm">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onNavigate('dashboard')}
                >
                    <div className="bg-green-600 p-1.5 rounded-lg">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight hidden xs:block">NutriPlan</h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex gap-1 bg-stone-100 p-1 rounded-lg overflow-x-auto">
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'dashboard'
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Inicio</span>
                        </button>
                        <button
                            onClick={() => onNavigate('calendar')}
                            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'calendar'
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Plan</span>
                        </button>
                        <button
                            onClick={() => onNavigate('shopping')}
                            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'shopping'
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Compra</span>
                        </button>
                    </div>

                    <div className="w-px h-6 bg-stone-200 hidden sm:block"></div>

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
                {children}
            </main>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={onLogout}
                title="¿Cerrar sesión?"
                message="¿Estás seguro de que quieres cerrar sesión? Cualquier cambio no guardado podría perderse."
                confirmText="Cerrar sesión"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};
