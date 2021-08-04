const express = require('express');
require('./config/db');
const cors = require('cors');

const tagRouter = require('./routes/tag');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/tags', tagRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
