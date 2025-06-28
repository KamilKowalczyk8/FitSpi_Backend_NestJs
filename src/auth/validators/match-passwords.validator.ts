import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false})
export class MatchPasswords implements ValidatorConstraintInterface{

    validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
    }
    
    defaultMessage(args: ValidationArguments) {
        return 'Powtórzone hasło nie pasuje do hasła';
    }
}