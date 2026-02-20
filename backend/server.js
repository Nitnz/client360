require('dotenv').config();
require('./cron/expiry.cron');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.post('/debug', (req, res) => {
  res.json({ message: "POST debug works" });
});

app.use(cors());
app.use(express.json());

app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/notes', require('./routes/note.routes'));
app.use('/api/notes', require('./routes/note.routes'));



const expiryRoutes = require('./routes/expiry.routes');

app.use('/api/expiry', expiryRoutes);





app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
