"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, X, ShoppingBag } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Start exit animation after 3.5 seconds
    setTimeout(() => {
      const element = document.getElementById(`toast-${id}`);
      if (element) {
        element.classList.add("animate-out");
      }
    }, 3500);

    // Remove from state after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-center gap-4 bg-[#0a192f] text-white px-6 py-4 rounded-2xl shadow-2xl border border-blue-500/20 animate-in min-w-[320px] transition-all duration-500"
          >
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-0.5">Notification</p>
              <p className="text-sm font-bold font-outfit uppercase tracking-tight">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-zinc-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
