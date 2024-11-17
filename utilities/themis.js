class ThemisResponse {
    constructor(validationResponse, errorMessage = null) {
        this.validationResponse = validationResponse;
        this.errorMessage = errorMessage;
    }

    static get valid() {
        return new ThemisResponse(true);
    }

    get isValid() {
        return this.validationResponse;
    }

    get message() {
        return this.errorMessage;
    }
}

class ThemisRule {
    constructor(validator, errorMessage = 'Invalid input') {
        this.validator = validator;
        this.errorMessage = errorMessage;
    }

    validate(value) {
        if (this.validator(value)) return ThemisResponse.valid;
        return new ThemisResponse(false, this.errorMessage);
    }
}

class ThemisValidator {
    constructor() {
        this.rules = [];
        this.optional = false;
    }

    makeOptional() {
        this.optional = true;
        return this;
    }

    addRule(rule) {
        this.rules.push(rule);
        return this;
    }

    validate(value) {
        if (this.optional && (!value || (value && !value.length))) return ThemisResponse.valid;

        for (const rule of this.rules) {
            const response = rule.validate(value);
            if (!response.isValid) return response;
        }
        return ThemisResponse.valid;
    }
}

class Themis {
    static get validator() {
        return new ThemisValidator();
    }

    static get validResponse() {
        return ThemisResponse.valid;
    }

    static isThemisValidator(validator) {
        return validator instanceof ThemisValidator;
    }

    static isThemisResponse(response) {
        return response instanceof ThemisResponse;
    }

    static customRule(validator, errorMessage = 'Invalid input') {
        return new ThemisRule(validator, errorMessage);
    }

    static get stringRules() {
        return {
            minLength: (length, errorMessage = null) => new ThemisRule(
                value => value && value.length >= length, 
                errorMessage || `Minimum length is ${length}`
            ),

            maxLength: (length, errorMessage = null) => new ThemisRule(
                value => value && value.length <= length, 
                errorMessage || `Maximum length is ${length}`
            ),

            length: (length, errorMessage = null) => new ThemisRule(
                value => value && value.length === length, 
                errorMessage || `Length must be ${length}`
            ),

            equals: (other, errorMessage = null) => new ThemisRule(
                value => value === other, 
                errorMessage || `Must be equal to ${other}`
            ),

            notEquals: (other, errorMessage = null) => new ThemisRule(
                value => value !== other, 
                errorMessage || `Must not be equal to ${other}`
            ),

            startsWith: (other, errorMessage = null) => new ThemisRule(
                value => value && value.startsWith(other), 
                errorMessage || `Must start with ${other}`
            ),

            endsWith: (other, errorMessage = null) => new ThemisRule(
                value => value && value.endsWith(other), 
                errorMessage || `Must end with ${other}`
            ),

            contains: (other, errorMessage = null) => new ThemisRule(
                value => value && value.includes(other), 
                errorMessage || `Must contain ${other}`
            ),

            notContains: (other, errorMessage = null) => new ThemisRule(
                value => value && !value.includes(other), 
                errorMessage || `Must not contain ${other}`
            ),

            matches: (regex, errorMessage = null) => new ThemisRule(
                value => value && regex.test(value), 
                errorMessage || `Must match ${regex}`
            ),

            notMatches: (regex, errorMessage = null) => new ThemisRule(
                value => value && !regex.test(value),
                errorMessage || `Must not match ${regex}`
            ),
        };
    }

    static get numberRules() {
        return {
            min: (min, errorMessage = null) => new ThemisRule(
                value => value && value >= min, 
                errorMessage || `Minimum value is ${min}`
            ),

            max: (max, errorMessage = null) => new ThemisRule(
                value => value && value <= max, 
                errorMessage || `Maximum value is ${max}`
            ),

            equals: (other, errorMessage = null) => new ThemisRule(
                value => value && value === other, 
                errorMessage || `Must be equal to ${otherName || other}`
            ),

            notEquals: (other, otherName = null) => new ThemisRule(
                value => value && value !== other, 
                errorMessage || `Must not be equal to ${otherName || other}`
            ),
        };
    }

    static get arrayRules() {
        return {
            minLength: (length, errorMessage = null) => new ThemisRule(
                value => value && value.length >= length, 
                errorMessage || `Minimum length is ${length}`
            ),

            maxLength: (length, errorMessage = null) => new ThemisRule(
                value => value && value.length <= length, 
                errorMessage || `Maximum length is ${length}`
            ),

            length: (length, errorMessage = null) => new ThemisRule(
                value => value && value.length === length, 
                errorMessage || `Length must be ${length}`
            ),

            equals: (other, errorMessage = null) => new ThemisRule(
                value => value && value === other, 
                errorMessage || `Must be equal to ${other}`
            ),

            notEquals: (other, errorMessage = null) => new ThemisRule(
                value => value && value !== other, 
                errorMessage || `Must not be equal to ${other}`
            ),

            contains: (other, errorMessage = null) => new ThemisRule(
                value => value && value.includes(other), 
                errorMessage || `Must contain ${other}`
            ),

            notContains: (other, errorMessage = null) => new ThemisRule(
                value => value && !value.includes(other), 
                errorMessage || `Must not contain ${other}`
            ),
        };
    }

    static get objectRules() {
        return {
            equals: (other, errorMessage = null) => new ThemisRule(
                value => value && value === other, 
                errorMessage || `Must be equal to ${other}`
            ),

            notEquals: (other, errorMessage = null) => new ThemisRule(
                value => value && value !== other, 
                errorMessage || `Must not be equal to ${other}`
            ),

            contains: (other, errorMessage = null) => new ThemisRule(
                value => value && value.includes(other), 
                errorMessage || `Must contain ${other}`
            ),

            notContains: (other, errorMessage = null) => new ThemisRule(
                value => value && !value.includes(other), 
                errorMessage || `Must not contain ${other}`
            ),
        };
    }

    static get dateRules() {
        return {
            min: (min, errorMessage = null) => new ThemisRule(
                value => value && value >= min, 
                errorMessage || `Minimum value is ${min}`
            ),

            max: (max, errorMessage = null) => new ThemisRule(
                value => value && value <= max, 
                errorMessage || `Maximum value is ${max}`
            ),

            equals: (other, errorMessage = null) => new ThemisRule(
                value => value && value === other, 
                errorMessage || `Must be equal to ${other}`
            ),

            notEquals: (other, errorMessage = null) => new ThemisRule(
                value => value && value !== other, 
                errorMessage || `Must not be equal to ${other}`
            ),
        };
    }

    static get booleanRules() {
        return {
            equals: (other, errorMessage = null) => new ThemisRule(
                value => value && value === other, 
                errorMessage || `Must be equal to ${other}`
            ),

            notEquals: (other, errorMessage = null) => new ThemisRule(
                value => value && value !== other, 
                errorMessage || `Must not be equal to ${other}`
            ),
        };
    }

    static get anyRules() {
        return {
            exists: (errorMessage = null) => new ThemisRule(
                value => value !== null && value !== undefined, 
                errorMessage || 'Must exist'
            ),

            equals: (other, errorMessage = null) => new ThemisRule(
                value => value && value === other, 
                errorMessage || `Must be equal to ${other}`
            ),

            notEquals: (other, errorMessage = null) => new ThemisRule(
                value => value && value !== other, 
                errorMessage || `Must not be equal to ${other}`
            ),
        };
    }

    static get inputRules() {
        return {
            email: (errorMessage = null) => new ThemisRule(
                value => value && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value), 
                errorMessage || 'Invalid email'
            ),

            name: (errorMessage = null) => new ThemisRule(
                value => value && /^[a-zA-Z\s]+$/.test(value), 
                errorMessage || 'Only letters and spaces are allowed'
            ),

            text: (errorMessage = null) => new ThemisRule(
                value => value && /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/.test(value), 
                errorMessage || 'Only letters, numbers, spaces and some characters are allowed'
            ),

            phone: (errorMessage = null) => new ThemisRule(
                value => value && /^\+?[0-9\s().-]*$/.test(value), 
                errorMessage || 'Invalid phone number'
            ),

            amount: (errorMessage = null) => new ThemisRule(
                value => value && /^\d+(\.\d{1,2})?$/.test(value), 
                errorMessage || 'Invalid amount'
            ),

            pincode: (errorMessage = null) => new ThemisRule(
                value => value && /^[0-9a-zA-Z\s-]*$/.test(value), 
                errorMessage || 'Invalid pincode'
            ),

            url: (errorMessage = null) => new ThemisRule(
                value => value && /^(https?:\/\/)?(www\.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(value), 
                errorMessage || 'Invalid URL'
            ),

            otp: (errorMessage = null) => new ThemisRule(
                value => value && /^[0-9]{4}$/.test(value), 
                errorMessage || 'Invalid OTP'
            ),
        };
    }
}

export default Themis;