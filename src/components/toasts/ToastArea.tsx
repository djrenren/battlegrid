import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootStore } from "../../store";
import "./Toast.css";

export function ToastArea(props: {}) {
  const toasts = useSelector((state: RootStore) => state.toast.toasts);
  const { t } = useTranslation();
  return (
    <div className="toastArea">
      <AnimateSharedLayout>
        {toasts.map((toast) => (
          <motion.div
            className="toast"
            initial={{ position: "relative", opacity: 0 }}
            animate={{ position: "relative", opacity: 1 }}
            exit={{ position: "relative", opacity: 0 }}
            layout
            key={toast.id}
          >
            {t(toast.msg)}
          </motion.div>
        ))}
      </AnimateSharedLayout>
    </div>
  );
}
