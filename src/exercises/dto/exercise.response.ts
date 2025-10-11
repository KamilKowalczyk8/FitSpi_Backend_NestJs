import { WeightUnits } from "../weight_units.enum";

export class ExerciseResponse {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnits: WeightUnits;
  day: string;
  workoutId: number;
}
