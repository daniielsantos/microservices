import * as express from 'express';
import 'dotenv/config';
import cors from './middlewares/cors';
import json from './middlewares/json';
import { Order } from './entity/order.entity';
import { Mysql } from './database/mysql/mysql';
import * as amqp from 'amqplib';
import { DataSource } from 'typeorm';
import { OrderItem } from './entity/order.item.entity';

const app = express();
app.use(json);
app.use(cors);

var channel, connection, db: DataSource;

async function connect() {
    connection = await amqp.connect(`amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASS}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`);
    channel = await connection.createChannel();
    await channel.assertQueue('ORDER', { exclusive: true });
    console.log('[AMQP] Connected');
}
async function connectDb() {
    const conn = new Mysql();
    db = await conn.connect();
    console.log('[MYSQL] Connected');
}

// function createOrder(products): Order {

// }
connect().then(() => {
    channel.consume('ORDER', async (data) => {
        const {products, email} = JSON.parse(data.content.toString());
        const order = new Order();
        order.clientEmail = email;
        const repository = db.getRepository(Order);
        const repositoryItem = db.getRepository(OrderItem);
        var result = await repository.save(order);
        for (const i of products) {
            let orderItem = new OrderItem();
            orderItem.order = order;
            orderItem.quantity = i.quantity
            orderItem.productId = i.id
            await repositoryItem.save(orderItem);
        }
        const res = await repository.findOne({ where: { id: result.id } });
        channel.ack(data);
        channel.sendToQueue('PRODUCT', Buffer.from(JSON.stringify(res)));

    });
});
connectDb();


app.listen(8003, () => {
    console.log('Server is running on port 8003');
});

