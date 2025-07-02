import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync, ValidationError, ValidationOptions } from "class-validator";
import logger from "../config/logger";
import { ApiError } from "./error.helper";


export function mapAndValidateJsonData<T>(json:string, classConstractor: ClassConstructor<T>): T {

    const object = JSON.parse(json);
    const instance  = plainToInstance(classConstractor, object);
    const errors = validateSync(instance as ValidationOptions,{
        validationError:{target:false},
        stopAtFirstError:true
    });

    if (errors.length > 0) {
        logger.error(`Validation errors: ${errors}`);
        const formattedErrors:string[] = [];

        const extractedErrors = (error:ValidationError) => {
            if(error.constraints){
                formattedErrors.push(...Object.values(error.constraints));
            }

            if(error.children && error.children.length > 0){
                error.children.forEach(extractedErrors);
            }
        }

        errors.forEach(extractedErrors);

        throw new ApiError(`Validation failed: ${formattedErrors.join(', ')}`, 400);
    }

    return instance;

}