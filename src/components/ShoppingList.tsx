import React, { useState } from 'react';
import { useNutri } from '../context/NutriContext';
import { Trash2, Plus, Check, Store, Eraser } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

export const ShoppingList: React.FC = () => {
    const {
        shoppingList,
        supermarkets,
        toggleShoppingItem,
        deleteShoppingItem,
        addShoppingItem,
        addSupermarket,
        deleteSupermarket,
        assignItemToSupermarket,
        deleteCompletedItemsBySupermarket
    } = useNutri();
    const [newItemName, setNewItemName] = useState('');
    const [newSupermarketName, setNewSupermarketName] = useState('');
    const [selectedSupermarket, setSelectedSupermarket] = useState<string>('default');

    // Modal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [supermarketToClear, setSupermarketToClear] = useState<{ id: string, name: string } | null>(null);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            addShoppingItem(newItemName.trim(), selectedSupermarket);
            setNewItemName('');
        }
    };

    const handleAddSupermarket = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSupermarketName.trim()) {
            addSupermarket(newSupermarketName.trim());
            setNewSupermarketName('');
        }
    };

    const handleOpenClearModal = (id: string, name: string) => {
        setSupermarketToClear({ id, name });
        setIsConfirmModalOpen(true);
    };

    const handleConfirmClear = () => {
        if (supermarketToClear) {
            deleteCompletedItemsBySupermarket(supermarketToClear.id);
            setSupermarketToClear(null);
        }
    };

    const completedCount = shoppingList.filter(i => i.completed).length;

    const groupedItems = supermarkets.map(sm => ({
        ...sm,
        items: shoppingList.filter(item => (item.supermarketId || 'default') === sm.id)
    }));

    // Catch-all for items with unknown supermarket IDs (shouldn't happen with current logic, but safe)
    const unknownItems = shoppingList.filter(item => !supermarkets.find(sm => sm.id === (item.supermarketId || 'default')));
    if (unknownItems.length > 0) {
        // Allow visual recovery if needed, or just map to General
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-800">Lista de la Compra</h2>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-stone-500">{completedCount} / {shoppingList.length} items</span>
                    {shoppingList.length > 0 && completedCount === shoppingList.length && (
                        <span className="text-xs text-green-600 font-medium">¡Todo comprado!</span>
                    )}
                </div>
            </header>

            {/* Add Item Form */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-4">
                <h3 className="font-semibold text-stone-700">Añadir Producto</h3>
                <form onSubmit={handleAddItem} className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Ej: Leche, Huevos..."
                        className="flex-1 px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <select
                        value={selectedSupermarket}
                        onChange={(e) => setSelectedSupermarket(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-stone-700"
                    >
                        {supermarkets.map(sm => (
                            <option key={sm.id} value={sm.id}>{sm.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={!newItemName.trim()}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Añadir
                    </button>
                </form>
            </div>

            {/* Supermarket Management */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer font-medium text-stone-600 hover:text-stone-800 focus:outline-none">
                        <Store className="w-4 h-4" />
                        Gestionar Supermercados
                    </summary>
                    <div className="mt-4 space-y-4">
                        <form onSubmit={handleAddSupermarket} className="flex gap-2">
                            <input
                                type="text"
                                value={newSupermarketName}
                                onChange={(e) => setNewSupermarketName(e.target.value)}
                                placeholder="Nuevo Supermercado..."
                                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            />
                            <button type="submit" disabled={!newSupermarketName.trim()} className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-sm font-medium text-stone-700 transition-colors">
                                Añadir
                            </button>
                        </form>
                        <div className="flex flex-wrap gap-2">
                            {supermarkets.map(sm => (
                                <div key={sm.id} className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-stone-200 text-sm">
                                    <span style={{ color: sm.color }} className="font-semibold">{sm.name}</span>
                                    {sm.id !== 'default' && (
                                        <button onClick={() => deleteSupermarket(sm.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </details>
            </div>

            {/* Lists per Supermarket */}
            <div className="space-y-6">
                {groupedItems.map(group => {
                    if (group.id !== 'default' && group.items.length === 0) return null;
                    if (group.items.length === 0 && group.id !== 'default') return null;

                    const completedInGroup = group.items.filter(i => i.completed).length;

                    return (
                        <div key={group.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                            <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }}></span>
                                    {group.name}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-stone-400">
                                        {completedInGroup} / {group.items.length}
                                    </span>
                                    {completedInGroup > 0 && (
                                        <button
                                            onClick={() => handleOpenClearModal(group.id, group.name)}
                                            title="Limpiar comprados"
                                            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all flex items-center gap-1.5"
                                        >
                                            <Eraser className="w-4 h-4" />
                                            <span className="text-xs font-semibold">Limpiar</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <ul className="divide-y divide-stone-100">
                                {group.id === 'default' && group.items.length === 0 && (
                                    <li className="p-6 text-center text-stone-400 text-sm italic">
                                        No hay productos pendientes.
                                    </li>
                                )}
                                {group.items.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between p-3.5 hover:bg-stone-50 transition-colors group">
                                        <button
                                            onClick={() => toggleShoppingItem(item.id)}
                                            className="flex items-center gap-3 flex-1 text-left"
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${item.completed
                                                ? 'bg-green-500 border-green-500 shadow-sm'
                                                : 'border-stone-300 group-hover:border-green-400'
                                                }`}>
                                                {item.completed && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-all ${item.completed ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                                                {item.name}
                                            </span>
                                        </button>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <select
                                                value={group.id}
                                                onChange={(e) => assignItemToSupermarket(item.id, e.target.value)}
                                                className="text-xs border-none bg-transparent text-stone-400 hover:text-stone-600 focus:ring-0 cursor-pointer"
                                            >
                                                {supermarkets.map(sm => (
                                                    <option key={sm.id} value={sm.id}>{sm.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => deleteShoppingItem(item.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmClear}
                title={`Limpiar ${supermarketToClear?.name}`}
                message={`¿Estás seguro de que quieres eliminar todos los artículos ya comprados de "${supermarketToClear?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar comprados"
                variant="danger"
            />
        </div>
    );
};

// Simple X icon component for internal use if not importing everything
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);
