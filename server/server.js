const express = require('express');
const userRoutes = require('./Routes/User');
const vehicleRoute = require('./Routes/vehicle')
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('./services/notificationService');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cookieParser());
const allowdedOrigns=["http://127.0.0.1:5500","http://localhost:5500"]
app.use(cors({
    origin: allowdedOrigns,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     next();
// });
// Import the connection function
const { connectToDatabase } = require('./database');  // Import the function correctly

// Call the connectToDatabase function
connectToDatabase();

app.use(express.json());
app.use('/api/user/', userRoutes);
app.use('/api/routes/',vehicleRoute);


const billRoutes = require('./Routes/billRoutes');
app.use('/api/bill/', billRoutes);



app.listen(process.env.PORT, () => {
    console.log('Server started at port ' + process.env.PORT);
});
