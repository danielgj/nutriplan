import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Meal, MealType } from '../types';

interface MealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (meal: Omit<Meal, 'id'>) => void;
    defaultDate: Date;
    defaultType: MealType;
}

const TYPE_LABELS: Record<MealType, string> = {
    breakfast: 'Desayuno',
    lunch: 'Comida',
    dinner: 'Cena',
    rio: 'Río'
};

export const MealModal: React.FC<MealModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    defaultDate,
    defaultType
}) => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [type, setType] = useState<MealType>(defaultType);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setIngredients('');
            setType(defaultType);
        }
    }, [isOpen, defaultType]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const ingredientList = ingredients
            .split(',')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        onSubmit({
            name: name.trim(),
            ingredients: ingredientList,
            type,
            date: defaultDate.toISOString().split('T')[0]
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-stone-800 mb-1">Añadir Comida</h2>
                    <p className="text-sm text-stone-500 mb-6">
                        Para el {defaultDate.toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' })} - <span className="capitalize">{TYPE_LABELS[type]}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Nombre del plato</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Salmón a la plancha"
                                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Ingredientes (separados por comas)</label>
                            <textarea
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="Ej: Salmón, Limón, Espárragos"
                                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                            />
                            <p className="text-xs text-stone-400 mt-1">Se añadirán a tu lista de la compra.</p>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-medium text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!name.trim()}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
