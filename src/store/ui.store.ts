import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration: number;
}

interface UIStore {
  activeOrganizationId: string | null;
  toasts: Toast[];
  isUploadingDocument: boolean;
  setActiveOrganization: (id: string | null) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  setUploadingDocument: (value: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeOrganizationId: null,
  toasts: [],
  isUploadingDocument: false,

  setActiveOrganization: (id) => set({ activeOrganizationId: id }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast_${Date.now()}_${Math.random()}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setUploadingDocument: (value) => set({ isUploadingDocument: value }),
}));
