import React, { useState } from 'react';
import { useNutri } from '../context/NutriContext';
import type { Meal, MealType } from '../types';
import { MealModal } from './MealModal';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const TYPE_LABELS: Record<MealType, string> = {
    lunch: 'Comida',
    dinner: 'Cena',
    rio: 'Río'
};

const ORDERED_TYPES: MealType[] = ['lunch', 'dinner', 'rio'];
const MOBILE_TYPES: MealType[] = ['lunch', 'dinner', 'rio'];

export const WeeklyCalendar: React.FC = () => {
    const { meals, addMeal, deleteMeal } = useNutri();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedType, setSelectedType] = useState<MealType>('lunch');

    // Helper: Get start of current week (Monday)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const [currentDate, setCurrentDate] = useState(new Date());
    const startDate = getStartOfWeek(currentDate);

    const nextWeek = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 7);
        setCurrentDate(next);
    };

    const prevWeek = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 7);
        setCurrentDate(prev);
    };

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        return d;
    });

    const handleSlotClick = (date: Date, type: MealType) => {
        setSelectedDate(date);
        setSelectedType(type);
        setIsModalOpen(true);
    };

    const handleAddMeal = (mealData: Omit<Meal, 'id'>) => {
        addMeal(mealData);
    };

    const getMealsForSlot = (date: Date, type: MealType) => {
        const dateStr = date.toISOString().split('T')[0];
        return meals.filter(m => m.date === dateStr && m.type === type);
    };

    return (
        <>
            <div className="space-y-4 md:space-y-6">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <h2 className="text-xl md:text-2xl font-bold text-stone-800">
                            <span className="hidden xs:inline">Semana del </span>
                            {weekDates[0].toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                        </h2>
                        <div className="flex gap-1">
                            <button onClick={prevWeek} className="p-1 rounded hover:bg-stone-200 text-stone-600 transition-colors" title="Semana Anterior">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => setCurrentDate(new Date())} className="px-2 py-1 text-xs font-medium rounded hover:bg-stone-200 text-stone-600 transition-colors">
                                Hoy
                            </button>
                            <button onClick={nextWeek} className="p-1 rounded hover:bg-stone-200 text-stone-600 transition-colors" title="Semana Siguiente">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Header Labels (hidden on desktop) */}
                <div className="grid md:hidden grid-cols-[50px_1fr_1fr_1fr] gap-2 px-2 sticky top-[64px] bg-stone-50 z-20 py-2 border-b border-stone-200">
                    <div className="text-[10px] font-bold text-stone-400 uppercase">Día</div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase text-center">Comida</div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase text-center">Río</div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase text-center">Cena</div>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-7 gap-2 md:gap-4">
                    {weekDates.map((date) => {
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                            <div key={date.toISOString()} className={`
                                flex md:flex-col gap-2 md:gap-3 rounded-xl border p-2 md:p-3 shadow-sm transition-colors 
                                ${isToday ? 'bg-white border-green-200 ring-2 md:ring-4 ring-green-50/50' : 'bg-white border-stone-200'}
                                grid grid-cols-[50px_1fr_1fr_1fr] md:block
                            `}>
                                {/* Day Information */}
                                <div className="flex flex-col items-center justify-center md:pb-2 md:border-b md:border-stone-100">
                                    <p className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase">
                                        {date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '')}
                                    </p>
                                    <p className={`text-base md:text-lg font-bold ${isToday
                                        ? 'bg-green-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mt-0.5'
                                        : 'text-stone-800 mt-0.5'
                                        }`}>
                                        {date.getDate()}
                                    </p>
                                </div>

                                {/* Meal Slots */}
                                {/* Desktop: All types */}
                                <div className="hidden md:flex flex-col gap-3 flex-1">
                                    {ORDERED_TYPES.map((type) => (
                                        <MealSlot key={type} date={date} type={type} getMeals={getMealsForSlot} onClick={handleSlotClick} onDelete={deleteMeal} />
                                    ))}
                                </div>

                                {/* Mobile: Filtered types in vertical columns */}
                                {MOBILE_TYPES.map((type) => (
                                    <div key={type} className="md:hidden flex flex-col h-full">
                                        <MealSlot
                                            date={date}
                                            type={type}
                                            getMeals={getMealsForSlot}
                                            onClick={handleSlotClick}
                                            onDelete={deleteMeal}
                                            compact
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <MealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddMeal}
                defaultDate={selectedDate}
                defaultType={selectedType}
            />
        </>
    );
};

interface MealSlotProps {
    date: Date;
    type: MealType;
    getMeals: (date: Date, type: MealType) => Meal[];
    onClick: (date: Date, type: MealType) => void;
    onDelete: (id: string) => void;
    compact?: boolean;
}

const MealSlot: React.FC<MealSlotProps> = ({ date, type, getMeals, onClick, onDelete, compact }) => {
    const slotMeals = getMeals(date, type);

    return (
        <div
            className={`
                flex-1 flex flex-col gap-1 md:gap-2 p-1 md:p-2 rounded-lg border border-stone-100 bg-stone-50/50 
                hover:bg-stone-50 transition-colors group relative
                ${compact ? 'min-h-[60px]' : 'min-h-[80px]'}
            `}
        >
            <div className="flex items-center justify-between">
                {!compact && <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{TYPE_LABELS[type]}</span>}
                <button
                    onClick={() => onClick(date, type)}
                    className={`text-stone-300 hover:text-green-600 transition-opacity ${slotMeals.length > 0 ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                    title="Añadir comida"
                >
                    <Plus className="w-3 md:w-3.5 h-3 md:h-3.5" />
                </button>
            </div>

            {slotMeals.length === 0 ? (
                <div
                    onClick={() => onClick(date, type)}
                    className="flex-1 cursor-pointer flex items-center justify-center h-full w-full"
                >
                    {/* Empty state click area */}
                </div>
            ) : (
                <div className="space-y-1">
                    {slotMeals.map(meal => (
                        <div key={meal.id} className="bg-white p-1 md:p-2 rounded shadow-sm border border-stone-100 text-[11px] md:text-sm group/meal relative hover:border-green-200 transition-colors">
                            <p className="font-medium text-stone-700 leading-tight md:truncate" title={meal.name}>{meal.name}</p>
                            {!compact && meal.ingredients.length > 0 && (
                                <p className="text-[10px] text-stone-400 mt-0.5 truncate">{meal.ingredients.length} ingredientes</p>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(meal.id); }}
                                className="absolute top-0.5 right-0.5 text-stone-400 hover:text-red-500 opacity-0 group-hover/meal:opacity-100 transition-opacity bg-white/80 rounded"
                            >
                                <Trash2 className="w-2.5 md:w-3 h-2.5 md:h-3" />
                            </button>
                        </div>
                    ))}
                    {slotMeals.length > 0 && (
                        <button
                            onClick={() => onClick(date, type)}
                            className="w-full py-1 text-[9px] text-stone-300 hover:text-green-600 dashed border border-stone-100 rounded md:hidden"
                        >
                            +
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
