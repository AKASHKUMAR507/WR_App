import { Request } from '../network';

interface LoginInterface { userName: string; password: string; fcmtoken?: string }
interface SignUpInterface { fullName: string; userName: string; password: string, fcmToken?: string }
interface EmailVerificationInterface { username: string; otp: string }
interface ResetPasswordInterface { username: string; newpassword: string; otp: string }
interface ResendOtpInterface { username: string }
interface ForgotPasswordInterface { email: string }
interface GoogleLoginInterface { email: string; id: any }
interface GoogleSignupInterface { email: string; name: string; id: any; idtype: any }
interface RefreshTokenInterface { refreshToken: string }
interface ChangePasswordInterface { currentpassword: string, newpassword: string, confirmnewpassword: string}

async function LoginController(params: LoginInterface) {
    const url = 'user/signin';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function SignUpController(params: SignUpInterface) {
    const url = 'user/signup';

    try {
        const response = await Request('POST', url, { ...params, role: ["associate"] });
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function EmailVerifyController(params: EmailVerificationInterface) {
    const url = 'user/signup/verify';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function ForgotPasswordCotroller(params: ForgotPasswordInterface) {
    const url = 'user/forgetpassword';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function ResendOtpController(params: ResendOtpInterface) {
    const url = 'user/sendmailforuserverification';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function ResetPasswordController(params: ResetPasswordInterface) {
    const url = 'user/resetforgetpassword';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function ChangePasswordController(params: ChangePasswordInterface) {
    const url = 'user/resetpassword';

    try {
        const response = await Request('POST', url, params);
        return response.data;    
    } catch (error) {
        throw error;
    }
}

async function GoogleLoginController(params: GoogleLoginInterface) {
    const url = 'user/google/login';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function GoogleSignUpController(params: GoogleSignupInterface) {
    const url = 'user/google/register';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    };
}

async function LogoutController() {
    const url = 'user/logout';

    try {
        const response = await Request('POST', url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

async function RefreshTokenController(params: RefreshTokenInterface) {
    const url = 'user/refreshtoken';

    try {
        const response = await Request('POST', url, params);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

async function DeleteAccountController() {
    const url = 'user/closeaccount';

    try {
        const response = await Request('POST', url, { message: '' });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export type { LoginInterface, SignUpInterface, ResetPasswordInterface, ResendOtpInterface, ForgotPasswordInterface, EmailVerificationInterface, GoogleLoginInterface, GoogleSignupInterface, RefreshTokenInterface, ChangePasswordInterface };
export { LoginController, SignUpController, ResetPasswordController, ResendOtpController, ForgotPasswordCotroller, EmailVerifyController, GoogleLoginController, GoogleSignUpController, LogoutController, RefreshTokenController, DeleteAccountController, ChangePasswordController };