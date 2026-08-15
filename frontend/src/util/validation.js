export const isEmpty = (value) => {
    return !value || !value.toString().trim();
};
export const isValidEmail = (email) => {
    if (isEmpty(email)) {
        return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const isPositiveNumber = (value) => {
    return Number(value) > 0;
};
export const isPin = (pin) => {
    if (isEmpty(pin)) {
        return false;
    }
    return /^\d{4}$/.test(pin);
};
export const minLength = (value, length) => {
    if (isEmpty(value)) {
        return false;
    }
    return value.length >= length;
};