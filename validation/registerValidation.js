const Validator = require("validator")
const isEmpty = require("./isEmpty")

const validateRegisterInput = (data) => {
    let errors = {}

    // Check name field
    if(isEmpty(data.name)) {
        errors.name = "Name field cannot be empty"
    } else if (!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = "Name must be between 6 and 30 characters"
    }

    // Check email field
    if (isEmpty(data.email)) {
        errors.email = "Email field cannot be empty"
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, please provide a valid email"
    }

    // Check password field
    if(isEmpty(data.password)) {
        errors.password = "Password field cannot be empty"
    } else if (!Validator.isLength(data.password, {min: 6, max: 150})) {
        errors.password = "Password must be between 6 and 150 characters"
    }

    // Check confirm password field
    if (isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Password confirmation cannot be empty"
    } else if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Password and confirmation must match"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateRegisterInput