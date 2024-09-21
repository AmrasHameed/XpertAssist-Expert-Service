import RegisterUseCase from "../useCases/registerUseCase";

const registerUseCase = new RegisterUseCase()

export default class RegisterController {
    registerExpert = async (
        call: { request: {name: string, email: string; mobile: string, password: string, expertImage: string} },
        callback: (error: any, response: any) => void
      ) => {
        const { name, email, password, mobile, expertImage } = call.request;
        try {
          const response = await registerUseCase.registerExpert(name, email, password, mobile, expertImage);
          callback(null, response);
        } catch (error) {
          console.error('Login failed:', error);
          callback(null, { error: (error as Error).message });
        }
      };
}