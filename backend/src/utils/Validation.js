const validateEmail = (email) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validateName = (name) => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{1,50}$/;
    return nameRegex.test(name);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?!.*(['";\-]|--)).{6,}$/;
    return passwordRegex.test(password);
}

export {validateEmail, validateName, validatePassword};