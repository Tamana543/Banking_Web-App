export default function handleApiError(error) {
    if (!navigator.onLine) {
        return "No internet connection.";
    }
    if (error.message.includes("Failed to fetch")) {
        return "Unable to connect to the server.";
    }
    if (error.message.includes("Recipient not found")) {
        return "Recipient account was not found.";
    }
    if (error.message.includes("Insufficient balance")) {
        return "You don't have enough balance.";
    }
    if (error.message.includes("Current password")) {
        return "Current password is incorrect.";
    }
    if (error.message.includes("Current PIN")) {
        return "Current PIN is incorrect.";
    }
    if (error.message.includes("Email already")) {
        return "This email is already registered.";
    }
    return error.message || "Something went wrong.";
}