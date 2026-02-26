import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    setDoc,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import type { Meal, NutriState, ShoppingItem, Supermarket } from '../types';

const NutriContext = createContext<NutriState | undefined>(undefined);

const DEFAULT_SUPERMARKETS: Supermarket[] = [
    { id: 'default', name: 'General', color: '#78716c' }, // stone-500
    { id: 'mercadona', name: 'Mercadona', color: '#16a34a' }, // green-600
    { id: 'lidl', name: 'Lidl', color: '#2563eb' }, // blue-600
    { id: 'carrefour', name: 'Carrefour', color: '#dc2626' }, // red-600
];

export const NutriProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState<Meal[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);

    // Subscribe to Meals
    useEffect(() => {
        if (!user) {
            setMeals([]);
            return;
        }

        const q = query(collection(db, `users/${user.uid}/meals`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mealsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Meal));
            setMeals(mealsData);
        });

        return () => unsubscribe();
    }, [user]);

    // Subscribe to Shopping List
    useEffect(() => {
        if (!user) {
            setShoppingList([]);
            return;
        }

        const q = query(collection(db, `users/${user.uid}/shoppingList`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ShoppingItem));
            setShoppingList(items);
        });

        return () => unsubscribe();
    }, [user]);

    // Subscribe to Supermarkets
    useEffect(() => {
        if (!user) {
            setSupermarkets(DEFAULT_SUPERMARKETS);
            return;
        }

        const q = query(collection(db, `users/${user.uid}/supermarkets`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Supermarket));
            if (items.length === 0) {
                // Initialize default supermarkets if empty
                // We don't want to constantly re-add them if user deleted them, 
                // but for first run it's helpful.
                // A better approach for "default" data might be needed, but this is simple.
                // Let's just use local defaults if nothing in DB, but NOT save them automatically to avoid spamming DB.
                // Actually, let's just create them if they don't exist?
                // For now, let's just set the state to defaults + DB items? 
                // Creating them in DB ensures consistency.
                // Let's keep it simple: if DB is empty, use defaults locally.
                // BUT, if user adds one, we want to mix them.
                // Let's populate the DB with defaults if it's completely empty on first load?
                // Risk: Race conditions.
                // Simpler: Just provide defaults logic in UI or hook?
                // Let's stick to: DB defines state. If DB empty, we can show defaults?
                // Let's initialize DB with defaults if empty.
                const batch = writeBatch(db);
                DEFAULT_SUPERMARKETS.forEach(sm => {
                    const docRef = doc(db, `users/${user.uid}/supermarkets`, sm.id);
                    batch.set(docRef, sm);
                });
                batch.commit().catch(console.error);
            } else {
                setSupermarkets(items);
            }
        });

        return () => unsubscribe();
    }, [user]);


    const addMeal = async (newMeal: Omit<Meal, 'id'>) => {
        if (!user) return;
        try {
            const docRef = await addDoc(collection(db, `users/${user.uid}/meals`), newMeal);

            // Auto-add ingredients to shopping list
            if (newMeal.ingredients.length > 0) {
                const batch = writeBatch(db);
                newMeal.ingredients.forEach(ing => {
                    const itemRef = doc(collection(db, `users/${user.uid}/shoppingList`));
                    batch.set(itemRef, {
                        name: ing.trim(),
                        completed: false,
                        sourceMealId: docRef.id,
                        supermarketId: 'default'
                    });
                });
                await batch.commit();
            }
        } catch (error) {
            console.error("Error adding meal:", error);
        }
    };

    const updateMeal = async (updatedMeal: Meal) => {
        if (!user) return;
        try {
            await setDoc(doc(db, `users/${user.uid}/meals`, updatedMeal.id), updatedMeal);
        } catch (error) {
            console.error("Error updating meal:", error);
        }
    };

    const deleteMeal = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/meals`, id));
        } catch (error) {
            console.error("Error deleting meal:", error);
        }
    };

    const toggleShoppingItem = async (id: string) => {
        if (!user) return;
        const item = shoppingList.find(i => i.id === id);
        if (!item) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/shoppingList`, id), {
                completed: !item.completed
            });
        } catch (error) {
            console.error("Error toggling item:", error);
        }
    };

    const addShoppingItem = async (name: string, supermarketId: string = 'default') => {
        if (!user) return;
        try {
            await addDoc(collection(db, `users/${user.uid}/shoppingList`), {
                name,
                completed: false,
                supermarketId
            });
        } catch (error) {
            console.error("Error adding shopping item:", error);
        }
    };

    const deleteShoppingItem = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/shoppingList`, id));
        } catch (error) {
            console.error("Error deleting shopping item:", error);
        }
    };

    const clearShoppingList = async () => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            shoppingList.forEach(item => {
                const ref = doc(db, `users/${user.uid}/shoppingList`, item.id);
                batch.delete(ref);
            });
            await batch.commit();
        } catch (error) {
            console.error("Error clearing shopping list:", error);
        }
    };

    const addSupermarket = async (name: string) => {
        if (!user) return;
        try {
            await addDoc(collection(db, `users/${user.uid}/supermarkets`), {
                name,
                color: '#78716c'
            });
        } catch (error) {
            console.error("Error adding supermarket:", error);
        }
    };

    const deleteSupermarket = async (id: string) => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            // Delete the supermarket
            batch.delete(doc(db, `users/${user.uid}/supermarkets`, id));

            // Reassign items to default
            shoppingList.forEach(item => {
                if (item.supermarketId === id) {
                    const itemRef = doc(db, `users/${user.uid}/shoppingList`, item.id);
                    batch.update(itemRef, { supermarketId: 'default' });
                }
            });

            await batch.commit();
        } catch (error) {
            console.error("Error deleting supermarket:", error);
        }
    };

    const assignItemToSupermarket = async (itemId: string, supermarketId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/shoppingList`, itemId), {
                supermarketId
            });
        } catch (error) {
            console.error("Error assigning item:", error);
        }
    };

    const deleteCompletedItemsBySupermarket = async (supermarketId: string) => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            const itemsToDelete = shoppingList.filter(
                item => (item.supermarketId || 'default') === supermarketId && item.completed
            );

            if (itemsToDelete.length === 0) return;

            itemsToDelete.forEach(item => {
                const ref = doc(db, `users/${user.uid}/shoppingList`, item.id);
                batch.delete(ref);
            });

            await batch.commit();
        } catch (error) {
            console.error("Error deleting completed items:", error);
        }
    };

    return (
        <NutriContext.Provider
            value={{
                meals,
                shoppingList,
                supermarkets,
                addMeal,
                updateMeal,
                deleteMeal,
                toggleShoppingItem,
                addShoppingItem,
                deleteShoppingItem,
                clearShoppingList,
                addSupermarket,
                deleteSupermarket,
                assignItemToSupermarket,
                deleteCompletedItemsBySupermarket
            }}
        >
            {children}
        </NutriContext.Provider>
    );
};

export const useNutri = () => {
    const context = useContext(NutriContext);
    if (!context) {
        throw new Error('useNutri must be used within a NutriProvider');
    }
    return context;
};
