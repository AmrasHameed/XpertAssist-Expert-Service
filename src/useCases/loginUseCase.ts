import auth from '../middleware/auth';
import ExpertRepository from '../repositories/expertRepo';
import bcrypt from '../services/bcrypt';
import { getOtpByEmail } from '../services/redisClient';
import { ExpertInterface } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';
import { sendOtp } from '../utilities/sendOtp';

const expertRepository = new ExpertRepository();

export default class LoginUseCase {
  loginExpert = async (email: string, password: string) => {
    try {
      const expert = (await expertRepository.findByEmail(
        email
      )) as ExpertInterface;
      if (!expert) {
        return { message: 'ExpertNotFound' };
      }
      const isMatch = await comparePassword(password, expert.password);
      if (!isMatch) {
        return { message: 'passwordNotMatched' };
      }
      if (expert.accountStatus === 'Blocked') {
        return { message: 'blocked' };
      }
      const token = await auth.createToken(expert._id.toString(), '15m');
      const refreshToken = await auth.createToken(expert._id.toString(), '7d');
      return {
        message: 'Success',
        name: expert.name,
        token,
        service: expert.service,
        _id: expert._id,
        refreshToken,
        image: expert.expertImage,
        email: expert.email,
        mobile: expert.mobile,
        isVerified: expert.isVerified,
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  googleLoginExpert = async (email: string) => {
    try {
      const user = (await expertRepository.findByEmail(
        email
      )) as ExpertInterface;
      if (!user) {
        return { message: 'UserNotFound' };
      }
      if (user.accountStatus === 'Blocked') {
        return { message: 'blocked' };
      }
      const token = await auth.createToken(user._id.toString(), '15m');
      const refreshToken = await auth.createToken(user._id.toString(), '7d');
      return {
        message: 'Success',
        name: user.name,
        token,
        service: user.service,
        _id: user._id,
        refreshToken,
        image: user.expertImage,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  forgotPassOtp = async ( email: string) => {
    try {
      const user = (await expertRepository.findByEmail(email)) as ExpertInterface;
      const name = user.name
      if (user) {
        const response = await sendOtp({email, name}) 
        return {message: response}
      }
      return {message: 'User Does not Exist'}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  otpVerify = async ( email: string, otp: string) => {
    try {
      const storedOtp = await getOtpByEmail(email)
      console.log(storedOtp,'stored')
      console.log(otp,'otp')
      console.log(email,'email')
      if(storedOtp === null || storedOtp.toString() !== otp.toString()) {
        console.log("OTP does not match or is not found.")
        return {message: 'OTP does not match or is not found.'}
      }
      const user = (await expertRepository.findByEmail(email)) as ExpertInterface;
      if (user) {
        return { message: 'success' };
      } else {
        return {message: 'User does Not Exist'}
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updatePassword = async (
    email:string,
    password: string
  ) => {
    try {
      const user = await expertRepository.findByEmail(email);
      if (!user) {
        return { message: 'No User Found' };
      }
      const id = user?._id.toString()
      const hashedPass = await bcrypt.securePassword(password);
      const updates = { password: hashedPass };
      const response = await expertRepository.findByIdAndUpdate(id, updates);
      if (response.message === 'ExpertUpdated') {
        console.log('Password changed successfully');
        return { message: 'success' };
      } else {
        return { message: 'User Not Updated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  }
}
