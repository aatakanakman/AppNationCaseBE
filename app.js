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
  user: 'AppNation_pourthinof',
  host: 'l0u.h.filess.io',
  database: 'AppNation_pourthinof',
  password: '4bb51a91ac8dd86e16c321c07467b2f6835a69cd',
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
