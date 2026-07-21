import { createContext, useContext, useState } from "react";
import Toast from "../components/common/Toast";
const ToastContext = createContext();
export function ToastProvider({ children }) {
    const [toast, setToast] = useState({
        message: "",
        type: "success",
        visible: false,
    });
    const showToast = (
        message,
        type = "success",
        duration = 2500
    ) => {
        setToast({
            message,
            type,
            visible: true,
        });
        setTimeout(() => {
            setToast((prev) => ({
                ...prev,
                visible: false,
            }));
        }, duration);
    };
    return (
        <ToastContext.Provider
            value={{ showToast }}
        >
            {children}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
            />
        </ToastContext.Provider>
    );
}
export const useToast = () =>
    useContext(ToastContext);