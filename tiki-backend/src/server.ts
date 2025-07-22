import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Application } from 'express';
import session from 'express-session';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import setupSwagger from '~/configs/swagger.config';
import { requestLogger } from '~/configs/winston.config';
import { errorHandler } from '~/middleware/errorHandler.middleware';
import appRouter from '~/routes';
import SocketService from './services/socket.service';

// import { webSocketService } from './services/webSocket.service';

dotenv.config();

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
// webSocketService.init(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'somesecret',
    cookie: { maxAge: 60000 },
  })
);
app.use(requestLogger); // Winston request logging

// Swagger UI
setupSwagger(app);

// Routes
appRouter(app, io);

// Error Handler
app.use(errorHandler);

SocketService.init(io);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => console.log(`⚡Server running on: http://localhost:${PORT}/api/v1`));
