const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userroutes');

const app = express();
app.use(express.json()); 
app.use('/api/users', userRoutes);
// const port = 3000;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
})