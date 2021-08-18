// read spot and read spots
// for reading all spots use look up generators
// look up block near user merger to array

// read one spot
// look up block coordinate in array and return the spot

import { Request, Response } from 'express';
import * as Constants from '../utils/constants';
import JWT from '../utils/jwtUtil';
import WebUtil from '../utils/webUtil'
import LookUpUtil from '../utils/lookupUtil'
// import JWT from '../utils/jwtUtil';
import SpotsDB, { Car, Spot, SpotsByBlock } from '../model/spots-by-block';

class ReadSpots {

    public readSpots = (req: Request, res: Response, callback: Function): void => {
        let range = parseFloat(req.query.range || 0);
        //limit range to a max of 2 for now!
        if (range > 2) { range = 2; }
        const coordinates = req.query.coordinates;
        const longitudeX = parseFloat(coordinates.split(",")[0]);
        const latitudeY = parseFloat(coordinates.split(",")[1]);
        const xSameYUp = LookUpUtil.xSameYUpper(longitudeX, latitudeY);
        const xSameYSame = longitudeX.toFixed(2) + "," + latitudeY.toFixed(2);
        const xSameYLow = LookUpUtil.xSameYLower(longitudeX, latitudeY);
        const xUpYSame = LookUpUtil.ySameXUpper(longitudeX, latitudeY);
        const xlowYSame = LookUpUtil.ySameXLower(longitudeX, latitudeY);
        const blocks = [];
        const getPromises = [];
        blocks.push(xSameYUp);
        blocks.push(xSameYLow);
        blocks.push(xSameYSame);
        blocks.push(xUpYSame);
        blocks.push(xlowYSame);
        for (let i = 0; i < blocks.length; i++) {
            getPromises.push(blocks[i]);
            SpotsDB.find(getPromises)

            Promise.all(getPromises).then(function (values) {
                const spots: any = [];
                values.forEach(function (element: any) {
                    if (element.blockCoordinate && element.Item.spots) {
                        spots.push(element.Item.spots);

                    }
                })
                console.log("Results: ", values);
                const result = {
                    statusCode: 200,
                    body: JSON.stringify({ "spots": [].concat.apply([], spots) }),
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*'

                    }
                };
                callback(null, result);
            }).catch((err) => {
                console.log(err);
            });



        }

    };

    public account = (req: Request, res: Response, callback: Function): void => {
        this.readSpots(req, res, callback)
    };

}

export default new ReadSpots();


