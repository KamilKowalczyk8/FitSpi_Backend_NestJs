import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { CreateWorkoutAssignmentDto } from './dto/create-workout-assignment.dto';
import { UpdateWorkoutAssignmentDto } from './dto/update-workout-assignment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/role.enum';
import { AssignWorkoutAssignmentsDto } from './dto/assign-workout-assignments.dto';
import { RespondAssignmentDto } from './dto/respond-assignment.dto';

@ApiTags('Workout Assignments')
@ApiBearerAuth() 
@Controller('workouts/assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkoutAssignmentsController {
  constructor(private readonly workoutAssignmentsService: WorkoutAssignmentsService) {}

  @Post()
  @Roles(Role.Trainer,Role.Admin)
  @ApiOperation({ summary: 'Przypisz trening do podopiecznego (tylko trener)' })
  @ApiBody({ type: AssignWorkoutAssignmentsDto })
  @ApiResponse({ status: 201, description: 'Trening został przypisany '})
  assignWorkout(@Req() req, @Body() dto: AssignWorkoutAssignmentsDto) {
    return this.workoutAssignmentsService.assignWorkout(req.user.user_id, dto);
  }

  @Get('trainer')
  @Roles(Role.Trainer,Role.Admin)
  @ApiOperation({ summary: 'Pobierz wszystkie przypisania wykonane przez trenera' })
  @ApiResponse({ status: 200 })
  getTrainerAssignments(@Req() req) {
    return this.workoutAssignmentsService.getAssignmentsForTrainer(req.user.user_id);
  }
  
  @Get('pending')
  @Roles(Role.User,Role.Admin)
  @ApiOperation({ summary: 'Pobierz oczekujące treningi dla podopiecznego' })
  @ApiResponse({ status: 200 })
  getPendingForTrainee(@Req() req) {
    return this.workoutAssignmentsService.getPendingAssignmentsForTrainee(req.user.user_id);
  }

  @Get('accepted')
  @Roles(Role.User,Role.Admin)
  @ApiOperation({ summary: 'Pobierz zaakcpetowane treningi podopiecznego' })
  @ApiResponse({ status: 200 })
  getAcceptedForTrainee(@Req() req) {
    return this.workoutAssignmentsService.getAcceptedAssignmentsForTrainee(req.user.user_id);
  }

  @Patch(':id/respond')
  @Roles(Role.User,Role.Admin)
  @ApiOperation({ summary: 'Podopieczny akceptuje lub odrzuca przypisany trening' })
  @ApiParam({ name: 'id', type: Number, description: 'ID przypisania treningu' })
  @ApiBody({ type: RespondAssignmentDto })
  @ApiResponse({ status: 200 })
  respondToAssignment(
    @Req() req,
    @Param('id') id: number,
    @Body() dto: RespondAssignmentDto,
  ){
    return this.workoutAssignmentsService.respondToAssignment(req.user.user_id, id, dto)
  }



  



}
