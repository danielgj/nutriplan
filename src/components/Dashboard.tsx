import React from 'react';
import { useNutri } from '../context/NutriContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { MealType } from '../types';

const TYPE_LABELS: Record<MealType, string> = {
    lunch: 'Comida',
    dinner: 'Cena',
    rio: 'Río'
};

const ORDERED_TYPES: MealType[] = ['lunch', 'dinner', 'rio'];

interface DashboardProps {
    onNavigate: (view: 'calendar' | 'shopping') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { meals, shoppingList } = useNutri();

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(m => m.date === todayStr);

    const pendingItemsCount = shoppingList.filter(i => !i.completed).length;
    const recentItems = shoppingList.filter(i => !i.completed).slice(0, 3);

    const getMealForType = (type: MealType) => todaysMeals.find(m => m.type === type);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h2 className="text-3xl font-bold text-stone-800">
                    Hola, <span className="text-green-600">¡buen día!</span>
                </h2>
                <p className="text-stone-500 mt-1">Aquí tienes tu resumen para hoy.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Menu Section */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-stone-700 flex items-center justify-between">
                        Menú de Hoy
                        <button
                            onClick={() => onNavigate('calendar')}
                            className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
                        >
                            Ver semana <ArrowRight className="w-4 h-4" />
                        </button>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ORDERED_TYPES.map(type => {
                            const meal = getMealForType(type);
                            return (
                                <div key={type} className={`p-4 rounded-xl border ${meal ? 'bg-white border-green-100 shadow-sm' : 'bg-stone-50 border-stone-100 border-dashed'} transition-all`}>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{TYPE_LABELS[type]}</p>
                                    {meal ? (
                                        <div>
                                            <p className="font-semibold text-stone-800 text-lg">{meal.name}</p>
                                            <p className="text-sm text-stone-500 mt-1 truncate">{meal.ingredients.join(', ')}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-stone-400 italic">Nada planificado</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shopping Summary Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-stone-700">Compra Pendiente</h3>
                    <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => onNavigate('shopping')}>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShoppingBag className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <p className="text-green-100 font-medium mb-1">Items por comprar</p>
                            <p className="text-5xl font-bold mb-4">{pendingItemsCount}</p>

                            {recentItems.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs text-green-200 uppercase font-semibold tracking-wider mb-2">Próximos:</p>
                                    {recentItems.map(item => (
                                        <div key={item.id} className="flex items-center gap-2 text-sm text-white/90">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                            <span className="truncate">{item.name}</span>
                                        </div>
                                    ))}
                                    {pendingItemsCount > 3 && (
                                        <p className="text-xs text-green-200 mt-2">+ {pendingItemsCount - 3} más...</p>
                                    )}
                                </div>
                            )}

                            {pendingItemsCount === 0 && (
                                <p className="text-green-100 italic">¡Todo listo! No te falta nada.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
