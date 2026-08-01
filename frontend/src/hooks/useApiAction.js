import { useState } from "react";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
function useApiAction() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const execute = async (
    apiFunction,
    {
      successMessage,
      onSuccess,
      onError,
    } = {}
  ) => {
    try {
      setLoading(true);
      const data = await apiFunction();
      if (successMessage) {
        showToast.success(successMessage);
      }
      if (onSuccess) {
        await onSuccess(data);
      }
      return data;
    } catch (error) {
      const message = handleApiError(error);
      showToast.error(message);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    execute,
  };
}
export default useApiAction;