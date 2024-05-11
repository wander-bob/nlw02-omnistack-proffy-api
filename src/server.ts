import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import routes from './routes';

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use(routes);


app.listen(port, ()=>{console.log(`Server listen on port ${port}`)})