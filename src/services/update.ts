
// update
// find teh spot in array
// update the fields
// save teh block

import { Request, Response } from 'express';
import * as Constants from '../utils/constants';
const haversine = require('haversine-distance');
import JWT from '../utils/jwtUtil';
import WebUtil from '../utils/webUtil'
// import JWT from '../utils/jwtUtil';
import SpotsDB, { Car, Spot, SpotsByBlock } from '../model/spots-by-block';


class UpdateSpots {

    public updateSpot = (req: Request, res: Response, callback: Function): void => {

    };

    public spot = (req: Request, res: Response, callback: Function): void => {

    };

}


export default new UpdateSpots();
