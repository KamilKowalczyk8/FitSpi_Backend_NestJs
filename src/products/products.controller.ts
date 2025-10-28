import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Products Template')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary:'Pobiera wszystkie produkty z tabeli' })
  @ApiResponse({ status: 200, description: 'Lista produktów', type: [Product]})
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
}
