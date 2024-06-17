const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/apiError');
const globalErrorHandler = require('./controllers/errorController');
const candidateRouter = require('./routes/candidateRoutes');
const userRouter = require('./routes/userRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const challengeRouter = require('./routes/challengesRoutes');
const jobRouter = require('./routes/jobRoutes');
// const commentRouter = require('./routes/commentRoutes');

const app = express();

// Set security HTTP headers
app.use(helmet());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log('Hello from the middleware 😁');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/candidates', candidateRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/interviews', interviewRouter);
app.use('/api/v1/challenges', challengeRouter);
app.use('/api/v1/jobs', jobRouter);
// app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
