import { useState } from "react";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
function useApiAction() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const execute = async (
        action,
        successMessage = null
    ) => {
        try {
            setLoading(true);
            const data = await action();
            if (successMessage) {
                showToast(successMessage, "success");
            }
            return data;
        } catch (error) {
            showToast(
                handleApiError(error),
                "error"
            );
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        execute,
        loading,
    };
}
export default useApiAction;