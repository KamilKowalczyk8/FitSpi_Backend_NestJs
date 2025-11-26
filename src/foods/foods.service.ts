import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/user.entity';
import { Food } from './entities/food.entity';
import { DailyLog } from 'src/daily-log/entities/daily-log.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(DailyLog)
    private readonly dailyLogRepo: Repository<DailyLog>
  ) {}


  // funkcja pomocnicza do obliczenia makro
  private calculateMacros(product: Product, grams: number) {
    const multiplier = grams / 100.0;
    return {
      kcal: product.kcal * multiplier,
      protein: product.protein * multiplier,
      carbs: product.carbs * multiplier,
      fats: product.fats * multiplier,
    };
  }

  private async ensureDailyLogExists(user: User, date: Date | string): Promise<DailyLog>{
    const dateString = new Date(date).toISOString().split('T')[0];

    const existingLog = await this.dailyLogRepo.findOne({
      where: {
        user: { user_id: user.user_id },
        date: dateString,
      },
    });

    if(existingLog) {
      return existingLog;
    }

    const newLog = this.dailyLogRepo.create({
      user: user,
      date: dateString,
      //TODO tutaj będą ustawienia usera jego zapotrzebowanie itd
    });

    return await this.dailyLogRepo.save(newLog);
  }

  async addFood(user: User, createFoodDto: CreateFoodDto): Promise<Food> {
    const product = await this.productRepo.findOne({
      where: { id: createFoodDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Nie zanleziono produktu o danymi Id')
    }
  
    const dailyLog = await this.ensureDailyLogExists(user, createFoodDto.date);

    const macros = this.calculateMacros(product, createFoodDto.grams);

    const newFoodEntry = this.foodRepo.create({
      dailyLog: dailyLog,
      product: product,
      date: createFoodDto.date,
      meal: createFoodDto.meal,
      grams: createFoodDto.grams,
      ...macros,
    });

    return this.foodRepo.save(newFoodEntry)
  }

  async updateFood(foodId: number, user: User, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const foodEntry = await this.foodRepo.findOne({
      where: {
        id: foodId,
        dailyLog: { user: { user_id: user.user_id } }
      },
      relations: ['product','dailyLog'],
    });

    if(!foodEntry) {
      throw new NotFoundException('Nie znaleziono wpisu w dziennku')
    }

    if (updateFoodDto.grams && updateFoodDto.grams !== foodEntry.grams) {
      const macros = this.calculateMacros(foodEntry.product, updateFoodDto.grams);
      foodEntry.grams = updateFoodDto.grams;
      foodEntry.kcal = macros.kcal;
      foodEntry.protein = macros.protein;
      foodEntry.carbs = macros.carbs;
      foodEntry.fats = macros.fats;
    }

    if (updateFoodDto.date) {
      foodEntry.date = updateFoodDto.date;
    }
    
    if (updateFoodDto.meal){
      foodEntry.meal = updateFoodDto.meal;
    }

    return this.foodRepo.save(foodEntry);
  }

  async deleteFood(foodId: number, user: User): Promise<{ message: string}> {
    const result = await this.foodRepo.delete({
      id: foodId,
      dailyLog: { user: { user_id: user.user_id } }, 
    });

    if (result.affected === 0) {
      throw new NotFoundException('Nie znaleziono wpisu');
    }

    return { message: 'Wpis został usunięty'};
  }

  async copyDayFood(user: User, sourceDate: Date, targetDate: Date): Promise<Food[]> {
    const sourceLog = await this.dailyLogRepo.findOne({
        where: { 
            user: { user_id: user.user_id },
            date: new Date(sourceDate).toISOString().split('T')[0]
        },
        relations: ['foods', 'foods.product']
    });

    if (!sourceLog || sourceLog.foods.length === 0) {
      throw new NotFoundException('Brak posiłków do skopiowania w dniu źródłowym');
    }
    
    const targetLog = await this.ensureDailyLogExists(user, targetDate);

    const newFoodEntry = sourceLog.foods.map(entry =>{
      return this.foodRepo.create({
        dailyLog: targetLog,
        product: entry.product,
        meal: entry.meal,
        grams: entry.grams,
        kcal: entry.kcal,
        protein: entry.protein,
        carbs: entry.carbs,
        fats: entry.fats,
        date: targetDate,
      });
    });
    return this.foodRepo.save(newFoodEntry);
  }

  async getFoodLogsByDay(user: User, date: Date | string): Promise<any> {
    const dateString = new Date(date).toISOString().split('T')[0];

    const dailyLog = await this.dailyLogRepo.findOne({
        where: {
            user: { user_id: user.user_id },
            date: dateString
        },
        relations: ['foods', 'foods.product'],
        order: {
            foods: { meal: 'ASC' }
        }
    });

    if (!dailyLog) {
        return null;
    }

    const consumed = dailyLog.foods.reduce((acc, item) => ({
        kcal: acc.kcal + item.kcal,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats
    }), { kcal: 0, protein: 0, carbs: 0, fats: 0 });

    return {
        id: dailyLog.id,
        date: dailyLog.date,
        targets: {
            kcal: dailyLog.target_kcal,
            protein: dailyLog.target_protein,
            fat: dailyLog.target_fat,
            carbs: dailyLog.target_carbs
        },
        summary: consumed,
        foods: dailyLog.foods
    };
  }

}
