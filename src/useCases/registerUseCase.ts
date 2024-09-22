import auth from '../middleware/auth';
import ExpertRepository from '../repositories/expertRepo';
import bcrypt from '../services/bcrypt';
import { getOtpByEmail } from '../services/redisClient';
import { ExpertInterface } from '../utilities/interface';
import { sendOtp } from '../utilities/sendOtp';

const expertRepository = new ExpertRepository();

export default class RegisterUseCase {
  expertSignupOtp = async (name: string, email: string) => {
    try {
      const user = (await expertRepository.findByEmail(
        email
      )) as ExpertInterface;
      if (user) {
        return { message: 'UserExist' };
      }
      const response = await sendOtp({ email, name });
      return { message: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  expertResendOtp = async (name: string, email: string) => {
    try {
      const response = await sendOtp({ email, name });
      return { message: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  registerExpert = async (
    name: string,
    email: string,
    password: string,
    mobile: string,
    expertImage: string,
    otp: string
  ) => {
    try {
      const storedOtp = await getOtpByEmail(email);
      console.log(storedOtp, '====storedOTP');
      console.log(otp, '====OTP');
      if (storedOtp === null || storedOtp.toString() !== otp.toString()) {
        console.log('OTP does not match or is not found.');
        return { message: 'OTP does not match or is not found.' };
      }
      const expert = (await expertRepository.findByEmail(
        email
      )) as ExpertInterface;
      if (expert) {
        return { message: 'UserExist' };
      }
      const hashedPassword = await bcrypt.securePassword(password);
      const newUserData = {
        name,
        email,
        mobile,
        password: hashedPassword,
        expertImage,
      };
      const response = await expertRepository.saveExpert(newUserData);
      if (response.message === 'ExpertCreated') {
        const user = (await expertRepository.findByEmail(
          email
        )) as ExpertInterface;
        const token = await auth.createToken(user._id.toString(), '15m');
        const refreshToken = await auth.createToken(user._id.toString(), '7d');
        return {
          message: 'Success',
          name: user.name,
          token,
          _id: user._id,
          refreshToken,
          image: user.expertImage,
        };
      } else {
        return { message: 'UserNotCreated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}
