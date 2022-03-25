const validateEmail = (str) => {
    return str.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (str) => {
    return str.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    );
};

const validateName = (str) => {
    return (str.length > 0)
};

export default function validate(name, email, password, confirmPassword) {
    if (!validateName(name)) {
        alert("Please enter your full name.");
        return 0;
    }
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return 0;
    }
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return 0;
    }
    if (!validatePassword(password)) {
        alert("Please enter a valid password. Passwords should contain minimum eight characters, " +
            "at least one uppercase letter, one lowercase letter, one number and one special character:");
        return 0;
    }
    return 1;
}