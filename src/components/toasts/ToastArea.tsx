import { useSelector } from "react-redux"
import { RootStore } from "../../store";
import React from "react";
import "./Toast.css";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export function ToastArea(props: {}) {
  const toasts = useSelector((state: RootStore) => state.toast.toasts);
  const { t } = useTranslation();
  return (<div className="toastArea">
    <AnimatePresence>
    {
      toasts.map(toast =>
        <motion.div className="toast"
          initial={{position: "relative", bottom: "1em", opacity: 0}} 
          animate={{position: "relative", bottom: "0em", opacity: 1}} 
          exit={{ position: "relative", bottom: "1em", opacity: 0 }} 
          key={toast.id}
        >
          {t(toast.msg)}
        </motion.div>
      )
      }
    </AnimatePresence>
    </div>
  )
}