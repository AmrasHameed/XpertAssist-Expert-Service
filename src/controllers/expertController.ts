import ExpertUseCase from '../useCases/expertUseCase';
import { UpdateExpertRequest, VerifyExpertRequest } from '../utilities/interface';

const expertUseCase = new ExpertUseCase();

export default class ExpertController {
  getExpert = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id } = call.request;
      const expert = await expertUseCase.getExpert(id);
      console.log(expert)
      callback(null, expert);
    } catch (error) {
      console.error('Error fetching Expert:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  updateExpert = async (
    call: {
      request: UpdateExpertRequest;
    },
    callback: (error: any, response: any) => void
  ) => {
    const { id, name, mobile, expertImage } = call.request;
    const updates: Partial<UpdateExpertRequest> = {};
    if (name) {
      updates.name = name;
    }
    if (mobile) {
      updates.mobile = mobile;
    }
    if (expertImage) {
      updates.expertImage = expertImage; 
    }
    try {
      const response = await expertUseCase.updateExpert(id, updates);
      callback(null, response);
    } catch (error) {
      console.error('Update user failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  changePassword = async (
    call: {
      request: {
        id: string;
        currentPassword: string;
        newPassword: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id, currentPassword, newPassword } = call.request;
      const response = await expertUseCase.changePassword(id, currentPassword, newPassword);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  verifyExpert = async (
    call: {
      request: any;
    },
    callback: (error: any, response: any) => void
  ) => {
    const { id, govIdType, govIdNumber, verifyDocument } = call.request;
    const updates = {
      isVerified:'pending',
      verificationDetails: {
        govIdType,
        govIdNumber,
        document: verifyDocument,
      },
    };
    try {
      const response = await expertUseCase.verifyExpert(id, updates);
      callback(null, response);
    } catch (error) {
      console.error('Update user failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getExperts = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const services = await expertUseCase.getExperts();
      callback(null, services);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  expertVerification  = async (
    call: {
      request: {
        id: string;
        action: string;
        reason?: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id, action, reason } = call.request;
      const response = await expertUseCase.expertVerification(id, action, reason?reason:'');
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  blockExpert  = async (
    call: {
      request: {
        id: string;
        accountStatus: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id, accountStatus } = call.request;
      const response = await expertUseCase.blockExpert(id, accountStatus);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  isBlocked = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id } = call.request;
      const response = await expertUseCase.isBlocked(id);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching user:', error);
      callback(null, { error: (error as Error).message });
    }
  };
}
