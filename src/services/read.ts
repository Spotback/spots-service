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
import { createSchema } from 'ts-mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';

class ReadSpots {

    public readSpots = (req: Request, res: Response): void => {
        let reqRang: string = req.query.range as string;
        let range = parseFloat(reqRang || "0");
        //limit range to a max of 2 for now!
        if (range > 2) { range = 2; }
        const coordinates: string = req.query.coordinates as string;
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
        console.log(blocks);
        SpotsDB.find({ blockCoordinate: { $in: blocks } }, (err: Error, result) => {
            if (err) {
                WebUtil.errorResponse(res, err, Constants.SERVER_ERROR, 500);
                return;
            } else {
                const spots: any = [];
                result.forEach((element: SpotsByBlock) => {
                    console.log(element);
                    if (element.blockCoordinate && element.spots) {
                        spots.push(element.spots);

                    }
                });
                console.log(spots);
                WebUtil.successResponse(res, { spots }, 200, {});
                return;
            }
        });
    };

    public spots = (req: Request, res: Response): void => {
        try {
            const legit = JWT.verify(req.headers.bearer as string);
            if (legit) {
                this.readSpots(req, res)
            } else {
                WebUtil.errorResponse(res, Constants.CLIENT_ERROR_UA_T, Constants.CLIENT_ERROR_UA, 401);
            }
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                console.debug(error)
                WebUtil.errorResponse(res, Constants.CLIENT_ERROR_UA_T, Constants.CLIENT_ERROR_UA, 401);
                return;
            } else {
                WebUtil.errorResponse(res, error, Constants.SERVER_ERROR, 500);
                return;
            }
        }
    };

}

export default new ReadSpots();


