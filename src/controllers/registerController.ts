import RegisterUseCase from '../useCases/registerUseCase';

const registerUseCase = new RegisterUseCase();

export default class RegisterController {
  expertSignupOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email } = call.request;
    try {
      const response = await registerUseCase.expertSignupOtp(name, email);
      callback(null, response);
    } catch (error) {
      console.error('Otp sending failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  expertResendOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email } = call.request;
    try {
      const response = await registerUseCase.expertResendOtp(name, email);
      callback(null, response);
    } catch (error) {
      console.error('Otp sending failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  registerExpert = async (
    call: {
      request: {
        name: string;
        email: string;
        mobile: string;
        password: string;
        expertImage: string;
        otp: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email, password, mobile, expertImage, otp } = call.request;
    try {
      console.log(otp, 'otp reached controller');
      const response = await registerUseCase.registerExpert(
        name,
        email,
        password,
        mobile,
        expertImage,
        otp
      );
      callback(null, response);
    } catch (error) {
      console.error('Login failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };
}
