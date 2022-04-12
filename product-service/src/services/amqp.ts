import { connect, Channel } from 'amqplib';

export default class Amqp {
    private channel: Channel;

    async connect() {
        return connect(`amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASS}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}/`);
    }

    publish(queue: string, message: any) {
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

}