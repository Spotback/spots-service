import { Express } from 'express';
import Create from '../services/create';
import Read from '../services/read';
import Update from '../services/update'
import Delete from '../services/delete'

export class Routes {

    public routes(app: Express): void {
        app.get('/ping', (req, res) => {
            console.log('HEALTH CHECK SUCCEEDED')
            res.status(200).send();
        })
        app.post('/createSpot', Create.spot);
        app.post('/updateSpot', Update.spot);
        app.get('/readSpots', Read.spots);
        app.delete('/deleteSpot', Delete.spot);
    }
}
