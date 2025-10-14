"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface NotificationToastProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  type,
  message,
  onClose,
}) => {
  const bg =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-600";

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-5 right-5 px-4 py-3 rounded-2xl shadow-lg text-white flex items-center gap-3 ${bg} z-50`}
      >
        <p className="text-sm font-medium">{message}</p>
        <button onClick={() => onClose(id)}>
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
