import auth from '../middleware/auth';
import ExpertRepository from '../repositories/expertRepo';
import { ExpertInterface } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';

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
}
