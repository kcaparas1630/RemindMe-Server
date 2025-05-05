/**
 * @desc Base Swagger config file, exported as json
 * @summary Main specifications should be defined here
 * All API endpoints are included in 'apis' attribute and should be in YML
 * @author @Kcaparas
 */

const swaggerConfig = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Task Dashboard',
        version: '1.0.0',
        description: 'Task Dashboard API Server',
      },
      servers: [{ url: '/api' }],
    },
    apis: ['./src/docs/*.yml'],
  };
  
  export default swaggerConfig;
  