import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { CreateWorkoutAssignmentDto } from './dto/create-workout-assignment.dto';
import { UpdateWorkoutAssignmentDto } from './dto/update-workout-assignment.dto';

@Controller('workout-assignments')
export class WorkoutAssignmentsController {
  constructor(private readonly workoutAssignmentsService: WorkoutAssignmentsService) {}

  @Post()
  create(@Body() createWorkoutAssignmentDto: CreateWorkoutAssignmentDto) {
    return this.workoutAssignmentsService.create(createWorkoutAssignmentDto);
  }

  @Get()
  findAll() {
    return this.workoutAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutAssignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutAssignmentDto: UpdateWorkoutAssignmentDto) {
    return this.workoutAssignmentsService.update(+id, updateWorkoutAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutAssignmentsService.remove(+id);
  }
}
