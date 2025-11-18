import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './contants/env';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';

const app = express();
//Adding middlewares
app.use(express.json()); // allow server to accept JSON data
app.use(express.urlencoded({extended: true})); // to parse html form data
app.use(
    cors({
        origin: APP_ORIGIN, // ensures only our frontend code can access this API
        credentials: true, // will send access_control_allow headers back to our frontend
    })
);
app.use(cookieParser());

app.get('/health', (req,res)=>{
    throw new Error('Testing error')
   return res.json({'status': 'healthy'})
});

app.use(errorHandler);

app.listen(4004, async () => {
    console.log(`Server running on ${PORT} ${NODE_ENV} enviornment...`);
    await connectToDatabase();
}); 