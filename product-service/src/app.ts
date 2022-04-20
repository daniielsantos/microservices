import * as express from 'express';
import 'dotenv/config';
import cors from './middlewares/cors';
import json from './middlewares/json';
import { Product } from './entity/product.entity';
import { Mysql } from './database/mysql/mysql';
import { isAuthenticated } from './middlewares/isAuthenticated';
import * as amqp from 'amqplib';
import { DataSource, In } from 'typeorm';
import * as timeout from 'connect-timeout';

var orderCreated;
const app = express();
app.use(json);
app.use(cors);
// app.use(isAuthenticated);
app.use(timeout("10s"));
var channel, connection, db: DataSource;

async function connect() {
    connection = await amqp.connect(`amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASS}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`);
    channel = await connection.createChannel();
    await channel.assertQueue('PRODUCT', { exclusive: true });
    console.log('[AMQP] Connected');
}
async function connectDb() {
    const conn = new Mysql();
    db = await conn.connect();
    console.log('[MYSQL] Connected');
}
connect();
connectDb();

async function getOrderProducts(order) {
    const repository = db.getRepository(Product);
    let products = [];
    for await (const i of order) {
        const p = await repository.findBy({ id: i.productId });
        const obj = {
            product: p,
            quantity: i.quantity
        }
        products.push(obj);
    }
    return products;
}

app.post('/product/buy', async (req: any, res: any) => {
    const { order } = req.body;
    const products = await getOrderProducts(order);
    channel.sendToQueue('ORDER', Buffer.from(JSON.stringify({products, email: 'daniielsouzapvh@gmail.com'})));
    
    channel.consume('PRODUCT', (data) => {
        orderCreated = JSON.parse(data.content.toString());
        console.log("recebeu @@@ ", orderCreated)
        if (orderCreated.clientEmail == 'daniielsouzapvh@gmail.com') {
            console.log("final @@", orderCreated)
            channel.ack(data);
            res.status(200).json(orderCreated);
        }
    });
});
app.post('/product/create', async (req, res) => {
    const product = req.body
    const result = await db.getRepository(Product).save(product);
    res.status(200).json(result);
});
app.put('/product/update/:id', async (req, res) => {
    const repository = db.getRepository(Product);
    let product = await repository.findOne({ where: { id: parseInt(req.params.id) } });
    if (product) {
        product = Object.assign(product, req.body);
        const result = await repository.save(product);
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
app.get('/product', async (req, res) => {
    const result = await db.getRepository(Product).find();
    res.status(200).json(result);
});
app.get('/product/:id', async (req, res) => {
    const result = await db.getRepository(Product).findOne({ where: { id: parseInt(req.params.id) } });
    res.status(200).json(result);
});
app.delete('/product/delete/:id', async (req, res) => {
    const repository = db.getRepository(Product);
    let product = await repository.findOne({ where: { id: parseInt(req.params.id) } });
    if (product) {
        const result = await repository.remove(product);
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.listen(8002, () => {
    console.log('Server is running on port 8002');
});

