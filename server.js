const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 5000;
const cors = require('cors');
// app.use(cors({ origin: 'http://localhost:5173' }));

app.use(cors({
  origin: 'https://invenpro-front.vercel.app/',
  credentials: true
}));

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB sync error:', err);
});
