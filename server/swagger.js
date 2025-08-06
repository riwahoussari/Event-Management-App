const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API docs for my event management app",
    },
    servers: [
      {
        url: "http://localhost:5000", // your server base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files with Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
