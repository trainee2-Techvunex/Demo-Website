import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, Heart, Tag, Trash2, ShoppingBag, AlertCircle, Ruler } from 'lucide-react';

type ToastIcon = 'check' | 'heart' | 'offer' | 'trash' | 'bag' | 'error' | 'ruler';

interface ToastItem {
  id: number;
  message: string;
  icon: ToastIcon;
}

interface ToastContextValue {
  show: (message: string, icon?: ToastIcon, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastIcon, React.ComponentType<{ size?: number; className?: string }>> = {
  check: CheckCircle2,
  heart: Heart,
  offer: Tag,
  trash: Trash2,
  bag: ShoppingBag,
  error: AlertCircle,
  ruler: Ruler,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, icon: ToastIcon = 'check', duration = 2600) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse gap-2 items-center pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.icon];
          return (
            <div
              key={t.id}
              className="flex items-center gap-2 bg-deep-obsidian text-on-primary px-4 py-3 rounded shadow-[0_24px_64px_rgba(15,23,42,0.18)] font-label-md text-label-md min-w-[240px] max-w-sm animate-toast-in"
            >
              <Icon size={18} className="text-champagne-gold shrink-0" />
              <span className="flex-1">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
