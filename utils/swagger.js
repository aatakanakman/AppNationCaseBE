const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'AppNation Api Docs',
    description: '',
  },
  host: '',
  basePath: '',
  schemes: [],
  consumes: [],
  produces: [],
  tags: [],
  securityDefinitions: {},
  definitions: {},
  components: {},
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../routes/user.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
