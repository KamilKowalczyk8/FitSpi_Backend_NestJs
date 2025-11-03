import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetFoodByDayDto } from './dto/get-food-by-day.dto';
import { CopyFoodDto } from './dto/copy-food.dto';

@ApiTags('Foods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @ApiOperation({ summary: 'Dodanie nowego wpisu z posiłkami'})
  @ApiResponse({ status: 201, description: 'Posiłek został dodany'})
  create(
    @Body() dto: CreateFoodDto,
    @GetUser() user: User,
  ){
    return this.foodsService.addFood(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Pobieranie posiłków zalogowanego użytkownika'})
  @ApiResponse({ status: 200, description: 'Lista jedzenia'})
  findAllByDay(
    @GetUser() user: User,
    @Query() query: GetFoodByDayDto,
  ) {
    return this.foodsService.getFoodLogsByDay(user, query.date);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Zaktualizuj posiłek po id'})
  @ApiParam({ name: 'id', required: true, description: 'ID posiłku'})
  @ApiResponse({ status: 200, description: 'Posiłek zostanei zaktualizowany'})
  updateFood(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFoodDto,
    @GetUser() user: User,
  ){
    return this.foodsService.updateFood(id, user, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Usun posiłek po id'})
  @ApiParam({ name: 'id', required: true, description: 'ID posiłku'})
  @ApiResponse({ status: 200, description: 'Posiłek został usunięty' })
  delete(
    @Param('id',ParseIntPipe) id: number,
    @GetUser() user: User,
  ){
    return this.foodsService.deleteFood(id,user)
  }

  @Post('copy-day')
  @ApiOperation({ summary: 'Kopiuje wszystkie posiłki z jednego dnia na inny' })
  @ApiResponse({ status: 201, description: 'Posiłki zostały skopiowane' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono posiłków w dniu źródłowym' })
  copyDay(
    @GetUser() user: User,
    @Body() copyFoodDto: CopyFoodDto,
  ){
    return this.foodsService.copyDayFood(user, copyFoodDto.sourceDate, copyFoodDto.targetDate)
  }


}
