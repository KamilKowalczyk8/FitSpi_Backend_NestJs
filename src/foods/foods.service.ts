import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/user.entity';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
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

  async addFood(user: User, createFoodDto: CreateFoodDto): Promise<Food> {
    const product = await this.productRepo.findOne({
      where: { id: createFoodDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Nie zanleziono produktu o danymi Id')
    }
  

    const macros = this.calculateMacros(product, createFoodDto.grams);

    const newFoodEntry = this.foodRepo.create({
      user: user,
      product: product,
      date: createFoodDto.date,
      meal: createFoodDto.meal,
      grams: createFoodDto.grams,
      ...macros,
    });

    return this.foodRepo.save(newFoodEntry)
  }

  async updateFood(logId: number, user: User, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const foodEntry = await this.foodRepo.findOne({
      where: { id: logId, user: { user_id: user.user_id } },
      relations: ['product'],
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

  async deleteFood(logId: number, user: User): Promise<{ message: string}> {
    const result = await this.foodRepo.delete({
      id: logId,
      user: { user_id: user.user_id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Nie znaleziono wpisu');
    }

    return { message: 'Wpis został usunięty'};
  }

  async copyDayFood(user: User, sourceDate: Date, targetDate: Date): Promise<Food[]> {
    const entriesToCopy = await this.foodRepo.find({
      where: { 
        user: { user_id: user.user_id },
        date: sourceDate,
      },
      relations: ['product'],
    });

    if(entriesToCopy.length === 0) {
      throw new NotFoundException('Nie znaleziono wpisów do skopiowania')
    }

    const newFoodEntry = entriesToCopy.map(entry =>{
      return this.foodRepo.create({
        user: user,
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

  async getFoodLogsByDay(user: User, date: Date): Promise<Food[]> {
    return this.foodRepo.find({
      where: {
        user: { user_id: user.user_id },
        date: date,
      },
      relations: ['product'],
      order: {
        meal: 'ASC',
      }
    })
  }
}
