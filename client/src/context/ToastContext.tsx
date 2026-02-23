import { useState, useCallback, createContext, useContext } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { Toast, ToastFn } from "../types";
import { TOAST_BORDER, TOAST_SHADOW, TOAST_DOT } from "../constants";

const ToastCtx = createContext<ToastFn>(() => {});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback<ToastFn>((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={clsx(
            "px-[22px] py-[14px] rounded-xl bg-surface border text-main text-[13px] font-semibold flex items-center gap-2.5 animate-slide-in min-w-[260px]",
            TOAST_BORDER[t.type],
            TOAST_SHADOW[t.type],
          )}>
            <span className={clsx("w-2 h-2 rounded-full shrink-0", TOAST_DOT[t.type])} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
