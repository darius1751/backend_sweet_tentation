import { BadRequestException } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidationArguments, isMongoId } from 'class-validator';

export function IsMongoIdArray(validationOptions?: ValidationOptions) { //custom decorator with validate arrays Dto
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsMongoIdArray',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string[], args: ValidationArguments) {
                    
                    const isStringArray = Array.isArray(value) && value.reduce((a, b) => a && typeof b === 'string' && !Array.isArray(b), true);
                    if (isStringArray) {
                        for (let i = 0; i < value.length; i++) {
                            if (!isMongoId(value[i])){
                                const { property } = args;
                                throw new BadRequestException(`${property}[${i}]: "${value[i]}" not is a mongoId valid`);
                            }
                        }
                        return true;
                    }
                    return false;
                },
                defaultMessage(validationArguments) {
                    const { property } = validationArguments;
                    return `${property} must be a string array`;
                },
            },
        });
    };
}