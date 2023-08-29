const express = require('express');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger-output.json'); // Oluşturulan Swagger belgesinin yolu

const { Client } = require('pg');
const cors = require('cors');
const app = express();

// PostgreSQL Client
const client = new Client({
  user: 'newDatabase_certainraw',
  host: 'yle.h.filess.io',
  database: 'newDatabase_certainraw',
  password: '4b8c08c684c156278982f5a517f8883b2d7f0aa1',
  port: '5432',
});

// Veritabanı Bağlantısı
client
  .connect()
  .then(() => console.log('Veritabanına başarıyla bağlandı.'))
  .catch((err) =>
    console.error('Veritabanına bağlanırken bir hata oluştu:', err.stack)
  );

// Middleware
app.use(bodyParser.json());

// Config
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Hello world endpoint
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Routes
app.use(
  '/users',
  (req, res, next) => {
    req.dbClient = client;
    next();
  },
  userRoutes
);

// Start server
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
