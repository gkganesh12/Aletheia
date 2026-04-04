"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                */
/* ────────────────────────────────────────────────────────────────────── */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ShowToastPayload {
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (payload: ShowToastPayload) => void;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Context                                                              */
/* ────────────────────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

/* ────────────────────────────────────────────────────────────────────── */
/*  Accent colours per type                                              */
/* ────────────────────────────────────────────────────────────────────── */

const accentMap: Record<ToastType, string> = {
  success: "border-l-green-400",
  error: "border-l-red-400",
  info: "border-l-[--color-accent-400]",
};

const iconMap: Record<ToastType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-[--color-accent-400]",
};

/* ────────────────────────────────────────────────────────────────────── */
/*  Icons                                                                */
/* ────────────────────────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const toastIcons: Record<ToastType, () => ReactNode> = {
  success: CheckIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

/* ────────────────────────────────────────────────────────────────────── */
/*  Single toast item                                                    */
/* ────────────────────────────────────────────────────────────────────── */

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: number) => void;
}) {
  const Icon = toastIcons[toast.type];

  return (
    <motion.div
      layout
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`
        pointer-events-auto relative flex items-start gap-3
        w-80 rounded-lg border border-white/[0.12] border-l-4
        ${accentMap[toast.type]}
        bg-white/10 backdrop-blur-xl
        px-4 py-3 shadow-lg shadow-black/20
      `}
    >
      {/* Icon */}
      <span className={`mt-0.5 shrink-0 ${iconMap[toast.type]}`}>
        <Icon />
      </span>

      {/* Message */}
      <p className="flex-1 text-sm text-white/90 leading-relaxed">
        {toast.message}
      </p>

      {/* Close button */}
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="shrink-0 mt-0.5 text-white/40 hover:text-white transition-colors duration-150"
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Provider                                                             */
/* ────────────────────────────────────────────────────────────────────── */

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (payload: ShowToastPayload) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, ...payload }]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container: bottom-right, stacked vertically */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Hook                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
