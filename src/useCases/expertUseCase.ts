import ExpertRepository from '../repositories/expertRepo';
import bcrypt from '../services/bcrypt';
import { sendMail } from '../services/sendMail';
import {
  ExpertInterface,
  UpdateExpertRequest,
  VerifyExpertRequest,
} from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';

const expertRepository = new ExpertRepository();

export default class ExpertUseCase {
  getExpert = async (id: string) => {
    try {
      const expert = await expertRepository.findById(id);
      if (expert) {
        const response = {
          message: 'success',
          _id: expert._id.toString(),
          name: expert.name,
          email: expert.email,
          mobile: expert.mobile,
          service: expert.service,
          expertImage: expert.expertImage,
          accountStatus: expert.accountStatus,
          isVerified: expert.isVerified,
          verificationDetails: expert.verificationDetails,
          createdAt: expert.createdAt.toISOString(),
          updatedAt: expert.updatedAt.toISOString(),
        };
        return { ...response };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updateExpert = async (id: string, updates: Partial<UpdateExpertRequest>) => {
    try {
      const user = (await expertRepository.findById(id)) as ExpertInterface;
      if (user) {
        const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          return { message: 'success' };
        } else {
          return { message: 'Expert Not Updated' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  changePassword = async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      console.log(id, currentPassword, newPassword);
      const expert = await expertRepository.findById(id);
      if (!expert) {
        return { message: 'No User Found' };
      }
      const isMatch = await comparePassword(currentPassword, expert.password);
      if (!isMatch) {
        return { message: 'Entered current password is invalid' };
      }
      const hashedPass = await bcrypt.securePassword(newPassword);
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
  };

  verifyExpert = async (id: string, updates: Partial<VerifyExpertRequest>) => {
    try {
      const user = (await expertRepository.findById(id)) as ExpertInterface;
      if (user) {
        const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          return { message: 'success', isVerified: 'pending' };
        } else {
          return { message: 'Verification Request Failed' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getExperts = async () => {
    try {
      const experts = await expertRepository.find();
      if (experts && experts.length > 0) {
        return { experts };
      } else {
        return { message: 'No Experts Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  expertVerification = async (id: string, action: string, reason?: string) => {
    try {
      console.log(id, action, reason);
      const expert = await expertRepository.findById(id);
      if (!expert) {
        return { message: 'No User Found' };
      }
      const updates: { [key: string]: any } = {};

      if (action === 'accepted') {
        updates.isVerified = 'true';
        const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          console.log('Expert Verified Successfully');
          const subject: string = 'Verification Request';
          const text: string =
            `Hello ${expert.name},\n\n` +
            `Congratulations! Your account with XpertAssist has been successfully verified.\n` +
            `You can now access all our services and features. Thank you for being a part of our community!\n\n` +
            `If you have any questions or need assistance, feel free to reach out to our support team.\n\n` +
            `Welcome aboard and have a wonderful day!`;
          await sendMail(expert.email, subject, text);
          return { message: 'verified' };
        } else {
          return { message: 'Expert Not Updated' };
        }
      } else if (action === 'rejected') {
        updates.isVerified = 'rejected';
        const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          console.log('Expert Verification Rejected');
          const subject: string = 'Verification Request';
          const text: string =
            `Hello ${expert.name},\n\n` +
            `We regret to inform you that your account with XpertAssist has not been verified.\n` +
            `Reason for rejection: ${reason}\n\n` +
            `If you believe this decision was made in error or if you have any questions, please don't hesitate to contact our support team for further assistance.\n\n` +
            `Thank you for your understanding, and we wish you all the best.\n\n` +
            `Best regards,\n` +
            `The XpertAssist Team`;
          await sendMail(expert.email, subject, text);
          return { message: 'rejected' };
        } else {
          return { message: 'Expert Not Updated' };
        }
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  blockExpert = async (id: string, accountStatus: string) => {
    try {
      const user = (await expertRepository.findById(id)) as ExpertInterface;
      if (user) {
        const updates: { [key: string]: any } = {};
        if (accountStatus === 'Blocked') {
          updates.accountStatus = 'Blocked';
        }
        if (accountStatus === 'UnBlocked') {
          updates.accountStatus = 'UnBlocked';
        }
        const response = await expertRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'ExpertUpdated') {
          return { message: 'success'};
        } else {
          return { message: 'Request Failed' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  isBlocked = async (id: string) => {
    try {
      const expert = await expertRepository.findById(id);
      if (expert?.accountStatus==='Blocked') {
        return {message: 'Blocked' };
      } else if(expert?.accountStatus==='UnBlocked') {
        return { message: 'UnBlocked' };
      } else {
        return {message: 'Expert Not Found'}
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}
