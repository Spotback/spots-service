// delete
// read teh block for that spot
// find that block in the array
// delete it from array

import { Request, Response } from 'express';
import * as Constants from '../utils/constants';
import JWT from '../utils/jwtUtil';
import WebUtil from '../utils/webUtil'
// import JWT from '../utils/jwtUtil';
import SpotsDB, { Car, Spot, SpotsByBlock } from '../model/spots-by-block';


class DeleteSpots {

    public deleteSpot = (blockItem:any, res: Response, callback: Function): void => {
        // let coordinates = req.body.coordinates;
        // let email = req.body.email;
        // let longitude = Math.floor(parseFloat(coordinates.split(",")[0]).toFixed(2) * 1000);
        // let latitude = Math.floor(parseFloat(coordinates.split(",")[1]).toFixed(2) * 1000);
        // let blockCoordinates = longitude / 1000 + "," + latitude / 1000;
        // console.debug(blockCoordinates);

            console.log("Getting item:", blockItem);
            if (!blockItem || blockItem == {} || Object.keys(blockItem).length == 0) {
                console.log("Spot is not in table!");
            } else {
                blockItem = blockItem.Item;
                console.log("Updating spots: ", blockItem.spots);
                //already exists
                blockItem.spots = blockItem.spots.filter((value:any) => (value.coordinates !== blockItem.coordinates && value.email !== blockItem.email));
                console.log("Deleted spot! Putting item in table.", blockItem);
               SpotsDB.deleteOne(blockItem);
            }
    
            var result = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Successfully deleted your spot.'
                }),
                headers: { 'content-type': 'application/json' }
            };
    
            callback(null, result);
    };

    public account = (req: Request, res:Response, callback: Function): void => {
        let body = null;
        let path = null;
        let bearer = null;
        let spotback_correlation_id = null;
        //request validation
        try {
            body = !req.body ? {} : JSON.parse(req.body);
            path = req.path;
            bearer = req.headers.bearer as string;
            spotback_correlation_id = req.body.headers["spotback-correlation-id"];
            console.log(`PATH = ${path} BODY = ${body}`);
            if (req.body.httpMethod !== 'GET' && !body) {
                throw new Error("INVALID REQUEST");
            } else if (req.body.httpMethod === 'GET' && !bearer) throw new Error("UNAUTHORIZED");
        } catch (error) {
            console.log(`${Constants.CLIENT_ERROR_HB}: ${error.stack}`);
            res.statusCode = 400;
            req.body = JSON.stringify({
                code: Constants.CLIENT_ERROR_HB,
                message: "Invalid headers or body."
            });
            console.log(res);
            callback(null, res);
            return;
        }
        let payload = JWT.verify(bearer);
        if (payload) {
            this.deleteSpot(req, res, callback);
            return;
        } else {
            let result = {
                statusCode: 401,
                body: JSON.stringify({
                    code: Constants.CLIENT_ERROR_UA,
                    message: "FAILED TO AUTHENTICATE."
                })
            }
            callback(null, result);
        }
    };

}


export default new DeleteSpots();
