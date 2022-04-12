import * as cors from 'cors';

export default cors(
    {
        origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
    }
)
