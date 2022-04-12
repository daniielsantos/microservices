import * as express from 'express';
import 'dotenv/config';
import cors from './middlewares/cors';
import json from './middlewares/json';
import * as jwt from 'jsonwebtoken';
import { Bcrypt } from './services/bcrypt';
import { Mysql } from './database/mysql/mysql';
import { Users } from './entity/users.entity';

const app = express();
const conn = new Mysql();


app.use(json);
app.use(cors);
conn.connect().
    then((db) => {
        const bc = new Bcrypt();
        app.post('/auth/login', async (req, res) => {
            const { email, password, name } = req.body;
            const userRepository = db.getRepository(Users);
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return;
            }
            const isValid = await bc.compare(password, user.password);
            if (isValid) {
                const payload = {
                    email,
                    name
                };
                const token = jwt.sign(payload, process.env.SECRET);
                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        });

        app.post('/auth/register', async (req, res) => {
            const { email, password, name } = req.body;
            const userRepository = db.getRepository(Users);
            const user = await userRepository.findOne({ where: { email } });
            if (user) {
                res.status(401).json({ message: 'User already exists' });
                return;
            }
            const hash = await bc.hash(password);
            const newUser = userRepository.create({ email, password: hash, name });
            const result = await userRepository.save(newUser);
            res.status(200).json(result);
        });

        app.listen(8001, () => {
            console.log('Server is running on port 8001');
        });
})
.catch(error => console.log("Error ", error));
