import { Injectable, ValidationError } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

@Injectable()
export class ValidationsErrorExceptionFilter extends I18nValidationExceptionFilter {
  constructor() {
    super({
      detailedErrors: true,
      responseBodyFormatter: (_, exception, formattedErrors) => {
        const errorMessages = this.extractValidationErrors(formattedErrors as ValidationError[]);


        return {
          statusCode: exception.getStatus(),
          errorMessages: errorMessages,
        };
      },
    });
  }

  private extractValidationErrors(errors: ValidationError[]): string[] {
    let messages: string[] = [];
    errors.forEach(error => {
      console.log(error);
      
      if (error.constraints) {
        messages = messages.concat(Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        messages = messages.concat(this.extractValidationErrors(error.children));
      }
    });
    return messages;
  }
}
