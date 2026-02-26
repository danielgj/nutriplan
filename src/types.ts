export type MealType = 'lunch' | 'dinner' | 'rio';

export interface Meal {
    id: string;
    name: string;
    ingredients: string[];
    type: MealType;
    date: string; // ISO 8601 YYYY-MM-DD
}

export interface Supermarket {
    id: string;
    name: string;
    color: string;
}

export interface ShoppingItem {
    id: string;
    name: string;
    completed: boolean;
    sourceMealId?: string; // If auto-generated from a meal
    supermarketId?: string;
}

export interface NutriState {
    meals: Meal[];
    shoppingList: ShoppingItem[];
    supermarkets: Supermarket[];
    addMeal: (meal: Omit<Meal, 'id'>) => void;
    updateMeal: (meal: Meal) => void;
    deleteMeal: (id: string) => void;
    toggleShoppingItem: (id: string) => void;
    addShoppingItem: (name: string, supermarketId?: string) => void;
    deleteShoppingItem: (id: string) => void;
    clearShoppingList: () => void;
    addSupermarket: (name: string) => void;
    deleteSupermarket: (id: string) => void;
    assignItemToSupermarket: (itemId: string, supermarketId: string) => void;
    deleteCompletedItemsBySupermarket: (supermarketId: string) => void;
}
