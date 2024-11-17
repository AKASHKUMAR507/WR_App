import { ChangePasswordController, ChangePasswordInterface, DeleteAccountController, LoginController, LoginInterface, LogoutController, RefreshTokenController } from "../controllers/auth";
import { SignUpController, SignUpInterface } from "../controllers/auth";
import { EmailVerifyController, EmailVerificationInterface } from "../controllers/auth";
import { ForgotPasswordCotroller, ForgotPasswordInterface } from "../controllers/auth";
import { ResetPasswordController, ResetPasswordInterface } from "../controllers/auth";
import { ResendOtpController, ResendOtpInterface } from "../controllers/auth";
import { GoogleLoginController, GoogleLoginInterface } from "../controllers/auth";
import { GoogleSignUpController, GoogleSignupInterface } from "../controllers/auth";

import * as Keychain from 'react-native-keychain';
import { ChangeEmailController, ChangeEmailInterface } from "../controllers/setting";
const Buffer = require("buffer").Buffer;

async function Login(params: LoginInterface) {
    try {
        params.password = Buffer.from(params.password).toString('base64');

        const response = await LoginController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
};

async function SignUp(params: SignUpInterface) {
    try {
        params.password = Buffer.from(params.password).toString('base64');

        const response = await SignUpController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
};

async function EmailVerify(params: EmailVerificationInterface) {
    try {
        const response = await EmailVerifyController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
};

async function ForgotPassword(params: ForgotPasswordInterface) {
    try {
        const response = await ForgotPasswordCotroller(params);
        return response;
    }
    catch (error) {
        throw error;
    }
};

async function ResendOtp(params: ResendOtpInterface) {
    try {
        const response = await ResendOtpController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
}

async function ResetPassword(params: ResetPasswordInterface) {
    try {
        params.newpassword = Buffer.from(params.newpassword).toString('base64');

        const response = await ResetPasswordController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
}

async function ChangeAccountPassword(params: ChangePasswordInterface) {
    try {
        params.currentpassword = Buffer.from(params.currentpassword).toString('base64');
        params.newpassword = Buffer.from(params.newpassword).toString('base64');
        params.confirmnewpassword = Buffer.from(params.confirmnewpassword).toString('base64');

        const response = await ChangePasswordController(params);
        return response;
    } catch (error) {
        throw error;
    }
}

async function GoogleLogin(params: GoogleLoginInterface) {
    try {
        const response = await GoogleLoginController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
}

async function GoogleSignUp(params: GoogleSignupInterface) {
    try {
        const response = await GoogleSignUpController(params);
        return response;
    }
    catch (error) {
        throw error;
    };
}

async function Logout() {
    try {
        const response = await LogoutController();
        return response;
    }
    catch (error) {
        throw error;
    };
}

async function RefreshToken() {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) throw new Error('No credentials stored');

        const response = await RefreshTokenController({ refreshToken: credentials.password });
        return response;
    }
    catch (error) {
        throw error;
    };
}

async function DeleteAccount() {
    try {
        const response = await DeleteAccountController();
        return response;
    }
    catch (error) {
        throw error;
    }
}

export { Login, SignUp, EmailVerify, ForgotPassword, ResendOtp, ResetPassword, GoogleLogin, GoogleSignUp, Logout, RefreshToken, DeleteAccount, ChangeAccountPassword }