import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as expressProxy from 'express-http-proxy';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as timeout from 'connect-timeout';
import helmet from 'helmet';

const app = express();
app.use(cors());
app.use(timeout("10s"));
const authServiceProxy = expressProxy(`http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}`);
const productServiceProxy = expressProxy(`http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}`);


// PRODUCTS
app.get('/product', (req, res, next) => {
  productServiceProxy(req, res, next);
});
app.get('/product/:id', (req, res, next) => {
  productServiceProxy(req, res, next);
});
app.post('/product/create', (req, res, next) => {
  productServiceProxy(req, res, next);
});
app.post('/product/buy', (req, res, next) => {
  productServiceProxy(req, res, next);
});
app.put('/product/update/:id', (req, res, next) => {
  productServiceProxy(req, res, next);
});
app.delete('/product/delete/:id', (req, res, next) => {
  productServiceProxy(req, res, next);
});
// AUTH
app.post('/auth/register', (req, res, next) => {
  authServiceProxy(req, res, next);
});
app.post('/auth/login', (req, res, next) => {
  authServiceProxy(req, res, next);
});

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

var server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
