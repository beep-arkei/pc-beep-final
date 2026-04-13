import { create } from 'zustand';
import { CartItem, PCBuild, Product, Profile } from '../types';

interface AppState {
  user: Profile | null;
  cart: CartItem[];
  pcBuild: PCBuild;
  setUser: (user: Profile | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToBuild: (component: Product, category: keyof PCBuild, index?: number) => void;
  removeFromBuild: (category: keyof PCBuild, index?: number) => void;
  addSlot: (category: keyof PCBuild) => void;
  removeSlot: (category: keyof PCBuild, index: number) => void;
  clearBuild: () => void;
  loadBuild: (build: PCBuild) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  cart: [],
  pcBuild: {
    storage: [null],
    cooler: [null],
    peripherals: [null],
  },
  setUser: (user) => set({ user }),
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
  addToBuild: (component, category, index) =>
    set((state) => {
      const current = state.pcBuild[category];
      if (Array.isArray(current)) {
        const newArray = [...current];
        if (index !== undefined) {
          newArray[index] = component;
        } else {
          newArray.push(component);
        }
        return { pcBuild: { ...state.pcBuild, [category]: newArray } };
      }
      return { pcBuild: { ...state.pcBuild, [category]: component } };
    }),
  removeFromBuild: (category, index) =>
    set((state) => {
      const current = state.pcBuild[category];
      if (Array.isArray(current)) {
        if (index !== undefined) {
          const newArray = [...current];
          newArray[index] = null;
          return { pcBuild: { ...state.pcBuild, [category]: newArray } };
        }
        return state;
      }
      const newBuild = { ...state.pcBuild };
      delete newBuild[category];
      return { pcBuild: newBuild };
    }),
  addSlot: (category) =>
    set((state) => {
      const current = state.pcBuild[category];
      if (Array.isArray(current)) {
        return { pcBuild: { ...state.pcBuild, [category]: [...current, null] } };
      }
      return state;
    }),
  removeSlot: (category, index) =>
    set((state) => {
      const current = state.pcBuild[category];
      if (Array.isArray(current) && current.length > 1) {
        const newArray = current.filter((_, i) => i !== index);
        return { pcBuild: { ...state.pcBuild, [category]: newArray } };
      }
      return state;
    }),
  clearBuild: () => set({ pcBuild: { storage: [null], cooler: [null], peripherals: [null] } }),
  loadBuild: (build) => set({ pcBuild: build }),
}));
