import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface UiState {
  sidebarExpanded: boolean;
  mobileMenuOpen: boolean;
  toasts: ToastItem[];
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

export const useUiStore = create<UiState>()((set) => ({
  sidebarExpanded: true,
  mobileMenuOpen: false,
  toasts: [],
  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
