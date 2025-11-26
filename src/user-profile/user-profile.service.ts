import { Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { DietGoal } from './entities/goal.enum';
import { Gender } from './entities/gender.enum';
import { UserProfile } from './entities/user-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>
  ) {}
  
  calculateNutritionalNeeds(profile: UserProfile) {
    
    // 1. Oblicz WIEK
    const birthDate = new Date(profile.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 2. Oblicz BMR (Wzór Mifflina-St Jeora)
    // Podstawa: (10 x waga) + (6.25 x wzrost) - (5 x wiek)
    let bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * age);

    // Korekta na płeć
    if (profile.gender === Gender.MALE) {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // 3. Oblicz TDEE (Całkowite zapotrzebowanie)
    // Mnożymy przez współczynnik aktywności (PAL) z Enuma
    // Rzutujemy na number, bo Enumy w bazie czasem są stringami
    const activityMultiplier = Number(profile.activity_level); 
    let targetKcal = Math.round(bmr * activityMultiplier);

    // 4. Korekta Kalorii pod CEL (Goal)
    switch (profile.goal) {
      case DietGoal.LOSE_WEIGHT:
        targetKcal -= 500; // Deficyt
        break;
      case DietGoal.GAIN_WEIGHT:
        targetKcal += 300; // Nadwyżka (Masa)
        break;
      case DietGoal.MAINTAIN:
      default:
        // Utrzymanie (0 zmian)
        break;
    }

    // Zabezpieczenie: Nie pozwól zejść poniżej BMR (chyba że skrajne przypadki)
    if (targetKcal < bmr && profile.goal !== DietGoal.LOSE_WEIGHT) {
        targetKcal = Math.round(bmr);
    }

    // 5. Oblicz MAKROSKŁADNIKI (Podział procentowy)
    let proteinRatio = 0.20; // Domyślnie 20%
    let fatRatio = 0.30;     // Domyślnie 30%
    let carbRatio = 0.50;    // Domyślnie 50%

    // Dostosowanie proporcji do celu
    if (profile.goal === DietGoal.LOSE_WEIGHT) {
      // Na redukcji więcej białka, żeby chronić mięśnie
      proteinRatio = 0.30; // 30% Białka
      fatRatio = 0.30;     // 30% Tłuszczu
      carbRatio = 0.40;    // 40% Węgli
    } else if (profile.goal === DietGoal.GAIN_WEIGHT) {
      // Na masie więcej węgli dla energii
      proteinRatio = 0.25; // 25% Białka
      fatRatio = 0.25;     // 25% Tłuszczu
      carbRatio = 0.50;    // 50% Węgli
    }

    // Wylicz gramaturę
    // Math.round zaokrągla do liczb całkowitych
    const proteinGrams = Math.round((targetKcal * proteinRatio) / 4); // Dzielimy przez 4 kcal/g
    const fatGrams = Math.round((targetKcal * fatRatio) / 9);         // Dzielimy przez 9 kcal/g
    const carbGrams = Math.round((targetKcal * carbRatio) / 4);       // Dzielimy przez 4 kcal/g

    return {
      kcal: targetKcal,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams,
    };
  }
}
