import express from 'express';
import 'dotenv/config';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/post', require('./routes/postRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// GET: get all categories POST: create new category => params: name
app.use('/api/category', require('./routes/categoryRoutes'));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})