const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const shortUrlRoutes = require('./routes/shorturl');
const logger = require('./middlewares/logger');

dotenv.config();
const app = express();
app.use(express.json());
app.use(logger);  // custom logger

app.use('/shorturls', shortUrlRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
