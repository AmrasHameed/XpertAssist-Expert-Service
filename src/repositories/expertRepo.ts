import Expert from '../entities/expert';
import {
  RegisterExpert,
  ExpertInterface,
  UpdateExpertRequest,
} from '../utilities/interface';

export default class ExpertRepository {
  findByEmail = async (email: string): Promise<ExpertInterface | null> => {
    try {
      const expertData = await Expert.findOne({ email });
      return expertData;
    } catch (error) {
      console.error('Error in findByEmail:', (error as Error).message);
      return null;
    }
  };

  find = async () => {
    try {
      const services = await Expert.find();
      return services;
    } catch (error) {
      console.error('Error finding Expert: ', (error as Error).message);
      throw new Error('Expert search failed');
    }
  };

  saveExpert = async (
    expertData: RegisterExpert
  ): Promise<{ message: string }> => {
    const newUser = new Expert({
      name: expertData.name,
      email: expertData.email,
      mobile: expertData.mobile,
      service: expertData.service,
      password: expertData.password,
      expertImage: expertData.expertImage,
    });

    try {
      await newUser.save();
      console.log('Expert saved into the database.');
      return { message: 'ExpertCreated' };
    } catch (error) {
      console.error('Error saving expert:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  findById = async (id: string) => {
    try {
      const expert = await Expert.findById(id);
      return expert;
    } catch (error) {
      console.error('Error finding expert: ', (error as Error).message);
      throw new Error('Expert search failed');
    }
  };

  findByIdAndUpdate = async (
    id: string,
    updates: Partial<UpdateExpertRequest>
  ): Promise<{ message: string }> => {
    try {
      const updatedExpert = await Expert.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!updatedExpert) {
        console.log('Expert not found.');
        return { message: 'Expert not found.' };
      }
      console.log('Expert updated successfully.');
      return { message: 'ExpertUpdated' };
    } catch (error) {
      console.error('Error updating user:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  findExpertByService = async (
    serviceId: string
  ): Promise<{ expertIds?: string[]; message?: string }> => {
    try {
      const experts = await Expert.find({
        service: serviceId,
        status: 'online',
        isVerified: 'true',
        accountStatus: 'UnBlocked',
        isAvailable: true,
      }).select('_id');
      const expertIds = experts.map((expert) => expert._id.toString());
      return { expertIds };
    } catch (error) {
      console.error('Error Fetching user:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  deductFromWallet = async (expertId: string, amount: number, jobId: string) => {
    try {
      const expert = await Expert.findById(expertId);
      if (!expert) {
        throw new Error('Expert not found');
      }
      const currentBalance = expert.totalEarning ?? 0;
      expert.totalEarning = currentBalance - amount;
      expert?.earnings?.push({
        jobId: jobId,
        earning: -amount, 
        type: 'debited',
      });
      await expert.save();
      return 'success';
    } catch (error) {
      console.error('Error finding expert: ', (error as Error).message);
      throw new Error('Expert search failed');
    }
  };

  withdraw = async (id: string, amount: number) => {
    try {
      const expert = await Expert.findById(id);
      if (!expert) {
        throw new Error('Expert not found');
      }
      const currentBalance = expert.totalEarning ?? 0;
      expert.totalEarning = currentBalance - amount;
      expert?.earnings?.push({
        earning: -amount, 
        type: 'debited',
      });
      await expert.save();
      return 'success';
    } catch (error) {
      console.error('Error finding expert: ', (error as Error).message);
      throw new Error('Expert search failed');
    }
  };

  getExpertData = async () => {
    try {
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      const totalExperts = await Expert.countDocuments();
      const expertsThisMonth = await Expert.countDocuments({
        createdAt: { $gte: firstDayOfCurrentMonth },
      });
      const expertsLastMonth = await Expert.countDocuments({
        createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
      });
      const growthRate = expertsLastMonth
        ? ((expertsThisMonth - expertsLastMonth) / expertsLastMonth) * 100
        : 0;
  
        const topExperts = await Expert.aggregate([
          { $sort: { totalEarning: -1 } },  
          { $limit: 5 }, 
          { 
            $project: {
              expertId: '$_id',       
              name: 1,           
              email: 1,          
              totalEarning: 1,   
              _id: 0  
            }
          }
        ]);
      return {
        totalExperts,
        expertGrowthRate:growthRate,
        top5Experts:topExperts,
      };
    } catch (error) {
      console.error('Error fetching expert data:', (error as Error).message);
      throw new Error('Expert data fetch failed');
    }
  }
}
