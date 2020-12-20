import { NextHttpHandler, UnprocessableEntityError } from 'types';
import { ObjectSchema } from 'yup';

export function validateBody(schema: ObjectSchema) {
  return (handler: NextHttpHandler): NextHttpHandler => async (req, res) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      return handler(req, res);
    } catch (error) {
      throw new UnprocessableEntityError(
        'Validation errors',
        UnprocessableEntityError.transformValidationError(error),
      );
    }
  };
}
