require('dotenv').config();
const mqtt = require('./subscriber');
const cors = require('cors');
const express = require('express');
const connectDb = require('./config/db-config');
const swaggerUi = require('swagger-ui-express');

const userRouter = require('./routes/user.route');
const roomRouter = require('./routes/room.route');
const deviceRouter = require('./routes/device.route');
const deviceTypeRouter = require('./routes/devicetype.route');
const deviceDataRouter = require('./routes/devicedata.route');

const authenticationMiddleware = require('./middlewares/authentication');
const notFoundMiddleware = require('./middlewares/notfound.middleware');
const errorHandlerMiddleware = require('./middlewares/errorhandler.middleware');

const swagger = require('./swagger/swagger.json');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', userRouter);
app.use('/api/room', authenticationMiddleware, roomRouter);
app.use('/api/device', authenticationMiddleware, deviceRouter);
app.use('/api/devicetype', deviceTypeRouter);
app.use('/api/data', authenticationMiddleware, deviceDataRouter(mqtt));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
// app.use(express.static(path.join(__dirname, '../ui')));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        throw err;
    }
}

start();
