import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { DietGoal } from './entities/goal.enum';
import { Gender } from './entities/gender.enum';
import { UserProfile } from './entities/user-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>
  ) {}
  
  async create(user: User, dto:CreateUserProfileDto) {
    const existingProfile = await this.userProfileRepo.findOne({
      where: { user: { user_id: user.user_id } },
    });

    if (existingProfile) {
      throw new BadRequestException('Użytkownik ma już swój profil')
    }

    const profile = this.userProfileRepo.create({
      user: user,
      ...dto,
    });

    const needs = this.calculateNutritionalNeeds(profile);

    profile.calculated_kcal = needs.kcal;
    profile.calculated_protein = needs.protein;
    profile.calculated_fat = needs.fat;
    profile.calculated_carbs = needs.carbs;

    return await this.userProfileRepo.save(profile);
  }

  async getProfile(user: User) {
    const profile = await this.userProfileRepo.findOne({
      where: { user: { user_id: user.user_id } },
    });

    if (!profile) {
      throw new NotFoundException('Profil użytkownika nie istnieje');
    }

    return profile;
  }

  async update(user: User, dto: UpdateUserProfileDto) {
    const profile = await this.getProfile(user);

    Object.assign(profile, dto);

    const needs = this.calculateNutritionalNeeds(profile);

    profile.calculated_kcal = needs.kcal;
    profile.calculated_protein = needs.protein;
    profile.calculated_fat = needs.fat;
    profile.calculated_carbs = needs.carbs;

    return await this.userProfileRepo.save(profile);
  }

  calculateNutritionalNeeds(profile: UserProfile) {
    const birthDate = new Date(profile.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * age);

    if (profile.gender === Gender.MALE) {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const activityMultiplier = Number(profile.activity_level); 
    let targetKcal = Math.round(bmr * activityMultiplier);

    switch (profile.goal) {
      case DietGoal.LOSE_WEIGHT:
        targetKcal -= 500; 
        break;
      case DietGoal.GAIN_WEIGHT:
        targetKcal += 300; 
        break;
      case DietGoal.MAINTAIN:
      default:
        break;
    }

    if (targetKcal < bmr && profile.goal !== DietGoal.LOSE_WEIGHT) {
        targetKcal = Math.round(bmr);
    }

    let proteinRatio = 0.20; 
    let fatRatio = 0.30;     
    let carbRatio = 0.50;    

    if (profile.goal === DietGoal.LOSE_WEIGHT) {
      proteinRatio = 0.30; 
      fatRatio = 0.30;     
      carbRatio = 0.40;    
    } else if (profile.goal === DietGoal.GAIN_WEIGHT) {
      proteinRatio = 0.25; 
      fatRatio = 0.25;     
      carbRatio = 0.50;    
    }

    const proteinGrams = Math.round((targetKcal * proteinRatio) / 4); 
    const fatGrams = Math.round((targetKcal * fatRatio) / 9);         
    const carbGrams = Math.round((targetKcal * carbRatio) / 4);      

    return {
      kcal: targetKcal,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams,
    };
  }
}
