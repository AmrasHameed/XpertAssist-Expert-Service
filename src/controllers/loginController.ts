import LoginUseCase from '../useCases/loginUseCase';

const loginUseCase = new LoginUseCase();

export default class LoginController {
  loginExpert = async (
    call: { request: { email: string; password: string } },
    callback: (error: any, response: any) => void
  ) => {
    const { email, password } = call.request;
    try {
      const response = await loginUseCase.loginExpert(email, password);
      callback(null, response);
    } catch (error) {
      console.error('Login failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  googleLoginExpert = async (
    call: { request: { email: string; } },
    callback: (error: any, response: any) => void
  ) => {
    const { email } = call.request;
    try {
      const response = await loginUseCase.googleLoginExpert(email);
      callback(null, response);
    } catch (error) {
      console.error('Login failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };
}
