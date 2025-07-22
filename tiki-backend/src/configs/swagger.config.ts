import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import type { Application } from 'express';
import openApiSpec from './zod-openapi.config';

export const setupSwagger = (app: Application) => {
  // fs.writeFileSync('./swagger.json', JSON.stringify(openApiSpec))
  const options = {
    definition: openApiSpec,
    apis: ['../routes/*.ts', '../controllers/*.ts'],
  };

  const specs = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  return specs;
};

export default setupSwagger;
