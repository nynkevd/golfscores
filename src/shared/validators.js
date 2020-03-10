export const isMinLength = (value, minLength) => {
    return (value.length >= minLength);
};

export const checkFormValid = (formState) => {
    for (let field in formState) {
        if (!formState[field].valid) {
            console.log(field + " is not valid");
            return false;
        }
    }
    return true;
}