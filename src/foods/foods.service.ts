import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  private calculateMacros(product: Product, grams: number) {
    const multiplier = grams / 100.0;
    return {
      kcal: product.kcal * multiplier,
      protein: product.protein * multiplier,
      carbs: product.carbs * multiplier,
      fats: product.fats * multiplier,
    };
  }
}
