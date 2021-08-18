import { Request, Response } from 'express';
import * as Constants from '../utils/constants';
import haversine from 'haversine-distance'
import JWT from '../utils/jwtUtil';
import WebUtil from '../utils/webUtil'
// import JWT from '../utils/jwtUtil';
import SpotsDB, { Car, Spot, SpotsByBlock } from '../model/spots-by-block';

class CreateSpot {
    // <!-- "37.4234,-123.7237" <!-- "37.23,-121.77" <!-- "37.24,-121.77" "37.22,-121.77"// "37.23,-121.76" -->// <!-- "37.23,-121.78"  -->
    // check if supported city in seperate function pass in unsuported city and return error
    // check if a block already exists then add to araay save it
    // if it doesnt exists create the block with one spot in array
    public validateSpotRequest = (req: Request): boolean => {
        if (req.headers.bearer && req.body.blockCoordinate && req.body.spots.length >= 1) return true;
        return false;
    };


    public supportedCityCheck = (data: any, callback: Function): void => {
        let passSuppCityCheck = data.coordinates.filter((supportedCoordinates: any) => {
            var a = { lat: data.coordinates.split(",")[0], lng: data.coordinates.split(",")[1] }
            var b = { lat: data.supportedCoordinates.split(",")[0], lng: supportedCoordinates.split(",")[1] }
            let dist = haversine(a, b);
            return dist * 0.000621371 <= 20;
        }).length;
        if (passSuppCityCheck < 1) {
            var result = {
                statusCode: 200,
                body: JSON.stringify({
                    code: "",
                    message: "Your city is not yet supported"
                }),
                headers: { 'content-type': 'application/json' }
            };
            callback(null, result);
            return;
        }
    };


    public createSpot = (blockItem: any, res: Response, callback: Function): void => {

        let body = JSON.parse(blockItem.body); try {
            body = !blockItem.body ? {} : JSON.parse(blockItem.body);
            let path = blockItem.path;
            let bearer = blockItem.headers.bearer;
            let spotback_correlation_id = blockItem.headers["spotback-correlation-id"];
            console.log(`PATH = ${path} BODY = ${body}`);
            if (blockItem.httpMethod !== 'GET' && !body) {
                throw new Error("INVALID REQUEST");
            } else if (blockItem.httpMethod === 'GET' && !bearer) throw new Error("UNAUTHORIZED");
        } catch (error) {
            console.log(`${Constants.CLIENT_ERROR_HB}: ${error.stack}`);
            res.statusCode = 400;
            blockItem.body = JSON.stringify({
                code: Constants.CLIENT_ERROR_HB,
                message: "Invalid headers or body."
            });
            console.log(res);
            callback(null, res);
            return;
        }
        let bearer = blockItem.headers.bearer;
        let payload = JWT.verify(bearer);
        if (payload) {
            this.createSpot(blockItem, res, callback);
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
        let spotId = blockItem.path.split("/")[2];
        let coordinates = body.coordinates;

        // let longitude = Math.floor(parseFloat(coordinates.split(",")[0]).toFixed(2) * 1000);
        // let latitude = Math.floor(parseFloat(coordinates.split(",")[1]).toFixed(2) * 1000);
        // let blockCoordinates = longitude / 1000 + "," + latitude / 1000;


        if (!blockItem || blockItem == {} || Object.keys(blockItem).length == 0) {
            console.log("Creating new item!");
            //doesn't exist
            let newSpot = {
                "BlockCoordinate": blockItem.coordinates,
                "spots": [
                    {
                        "car": blockItem.car,
                        "created_time": Date.now(),
                        "coordinates": blockItem.coordinates,
                        "email": blockItem.body.email,
                        "leaveTime": blockItem.leaveTime,
                        "spotType": blockItem.spotType
                    }
                ]
            }
            if (!this.validateSpotRequest && !this.supportedCityCheck) {
                SpotsDB.create({ newSpot }, (findErr: any, findResult: any | null) => {
                    if (findErr) {
                        WebUtil.errorResponse(res, null, Constants.CLIENT_ERROR_HB, 404);
                        return;
                    } else {
                        const message = {
                            code: Constants.SUCCESS,
                            message: Constants.SUCCESS
                        }
                        WebUtil.successResponse(res, message, 202);
                    }
                });
            }

            callback(null, newSpot)
        } else {
            blockItem = blockItem.Item;
            console.log("Updating spots: ", blockItem.spots);
            //already exists
            let spotAlreadyExists = false;
            blockItem.spots.forEach(function (element: any) {
                if (element.coordinates === blockItem.coordinates) {
                    //spot already exists so just update it
                    spotAlreadyExists = true;
                    element.email = blockItem.body.email;
                    element.status = blockItem.body.status;
                }
            });

            if (spotAlreadyExists == false) {
                //spot doesn't exist so push a new one.
                blockItem.spots.push({
                    "email": blockItem.body.email,
                    "coordinates": blockItem.coordinates,
                    "car": blockItem.body.car,
                    "spotType": blockItem.body.spotType,
                    "leaveTime": blockItem.body.leaveTime,
                    "postTime": Date.now()
                });
            }
            console.log("Putting item: ", blockItem);
            callback(null, blockItem);
        }
        var result = {
            statusCode: 200,
            body: JSON.stringify({
                code: "",
                message: "Spot has been posted"
            }),
            headers: { 'content-type': 'application/json' }
        };
        callback(null, result);
    };

    public account = (req: Request, res: Response, callback: Function): void => {
        let body = !req.body ? {} : JSON.parse(req.body);
        let path = req.path;
        let bearer = req.headers.bearer as string;
        let spotback_correlation_id = req.headers["spotback-correlation-id"];
        try {
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
        if (payload && !this.supportedCityCheck) {
            this.createSpot(req, res, callback);
            return;
        } else {
            let result = {
                statusCode: 401,
                body: JSON.stringify({
                    code: Constants.CLIENT_ERROR_UA,
                    message: "FAILED TO CREATE SPOT."
                })
            }
            callback(null, result);
        }
    };
};

export default new CreateSpot();
