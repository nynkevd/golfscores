export const isMinLength = (value, minLength) => {
    return (value.length >= minLength);
};

export const checkFormValid = (formState) => {
    for (let field in formState) {
        if (!formState[field].valid) {
            console.log(formState[field] === 'newPassword' && formState[field].value === '');
            if (!formState[field] === 'newPassword' && formState[field].value === '') {
                return false;
            }

        }
    }
    return true;
};