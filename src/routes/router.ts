import { Express } from 'express';
import Create from '../services/create';
import Read from '../services/read';
import Update from '../services/update'
import Delete from '../services/delete'

export class Routes {

    public routes(app: Express): void {
        app.get('/ping', (req, res) => {
            res.status(200).send();
        })
        app.post('/createSpot', Create.account);
        app.post('/updateSpot', Update.account);
        app.get('/readSpots', Read.account);
        app.delete('/deleteSpot', Delete.account);
    }
}
