import { Request, Response } from 'express';
import * as Constants from '../utils/constants';
import haversine from 'haversine-distance'
import JWT from '../utils/jwtUtil';
import WebUtil from '../utils/webUtil'
// import JWT from '../utils/jwtUtil';
import SpotsDB, { Car, Spot, SpotsByBlock } from '../model/spots-by-block';
import SupportedCitiesDB, { SupportedCity } from '../model/supported-cities';
import SpotPostLimitsDB from '../model/user-spot-limit';
import { JsonWebTokenError } from 'jsonwebtoken';

class CreateSpot {
    // <!-- "37.4234,-123.7237" <!-- "37.23,-121.77" <!-- "37.24,-121.77" "37.22,-121.77"// "37.23,-121.76" -->// <!-- "37.23,-121.78"  -->
    // check if supported city in seperate function pass in unsuported city and return error
    // check if a block already exists then add to araay save it
    // if it doesnt exists create the block with one spot in array
    public validateSpotRequest = (req: Request): boolean => {
        if (req.headers.bearer && req.body.blockCoordinate && req.body.spots.length >= 1) return true;
        return false;
    };


    public supportedCityCheck = (clientCoordinates: string, supportCities: SupportedCity[]): boolean => {
        let passSuppCityCheck = supportCities.filter((city: SupportedCity) => {
            var a = { lat: parseFloat(clientCoordinates.split(",")[0]), lng: parseFloat(clientCoordinates.split(",")[1]) };
            var b = { lat: parseFloat(city.coordinates.split(",")[0]), lng: parseFloat(city.coordinates.split(",")[1]) };
            let dist = haversine(a, b);
            return dist * 0.000621371 <= 20;
        });
        console.log("SPOT REQUEST FOR ", passSuppCityCheck)
        if (passSuppCityCheck.length < 1) {
            return false;
        } else {
            return true;
        }
    };

    public createSpotPostLimit = async (email: string, coordinates: string) => {
        let result = await SpotPostLimitsDB.create({
            email,
            coordinates
        });
    }

    public checkUserSpotPostLimit = async (email: string) => {
        let result = await SpotPostLimitsDB.findOne({email}).exec();
        return result;
    }


    public createSpot = async (req: Request, res: Response, email: string) => {

        const coordinates: string = req.body.coordinates as string;
        const longitudeX = parseFloat(coordinates.split(",")[0]);
        const latitudeY = parseFloat(coordinates.split(",")[1]);
        const blockCoordinate = longitudeX.toFixed(2) + "," + latitudeY.toFixed(2);

        let result = await SupportedCitiesDB.find({}).exec();
        if(!this.supportedCityCheck(coordinates, result)) {
            WebUtil.errorResponse(res, Constants.CITY_NOT_SUPPORTED, Constants.SERVER_ERROR, 400);
            return;
        }
        let test = await this.checkUserSpotPostLimit(email);
        console.log(test);
        if(test) {
            WebUtil.errorResponse(res, Constants.ONE_SPOT_PER_HOUR, Constants.CLIENT_ERROR_UA, 409);
            return;
        }

        SpotsDB.findOne({blockCoordinate}, (findErr: Error, blockItem: SpotsByBlock) => {
            if(findErr) {
                WebUtil.errorResponse(res, findErr, Constants.SERVER_ERROR, 500);
                return;
            } else if(blockItem) {
                blockItem.spots.push({
                    email: email,
                    coordinates: coordinates,
                    car: req.body.car,
                    spotType: req.body.spotType,
                    leaveTime: req.body.leaveTime,
                    created_time: Date.now()
                });
                SpotsDB.updateOne({blockCoordinate}, blockItem, {}, (updateErr: Error, updateRes) => {
                    if(updateErr) {
                        WebUtil.errorResponse(res, updateErr, Constants.SERVER_ERROR, 500);
                        return;
                    } else {
                        this.createSpotPostLimit(email, coordinates);
                        const message = {
                            code: Constants.SUCCESS,
                            message: Constants.SUCCESS
                        }
                        WebUtil.successResponse(res, message, 202);
                        return;
                    }
                })
            } else {
                let newBlockItem = {
                    blockCoordinate,
                    spots: [
                        {
                            car: req.body.car,
                            created_time: Date.now(),
                            coordinates: coordinates,
                            email: email,
                            leaveTime: req.body.leaveTime,
                            spotType: req.body.spotType
                        }
                    ]
                }
                SpotsDB.create(newBlockItem, (createError: any, findResult: any | null) => {
                    if (createError) {
                        WebUtil.errorResponse(res, createError, Constants.CLIENT_ERROR_HB, 500);
                        return;
                    } else {
                        this.createSpotPostLimit(email, coordinates);
                        const message = {
                            code: Constants.SUCCESS,
                            message: Constants.SUCCESS
                        }
                        WebUtil.successResponse(res, message, 202);
                        return;
                    }
                });
            }
        });
    };

    public spot = (req: Request, res: Response): void => {
        let bearer = req.headers.bearer as string;
        let spotback_correlation_id = req.headers["spotback-correlation-id"];
        try {
            if (req.method !== 'GET' && !req.body) {
                WebUtil.errorResponse(res, null, Constants.CLIENT_ERROR_HB, 400);
            return;
            }
            let payload = JWT.verify(bearer);
            if (payload) {
                this.createSpot(req, res, payload.email);
            } else {
                WebUtil.errorResponse(res, Constants.CLIENT_ERROR_UA_T, Constants.CLIENT_ERROR_UA, 401);
                return;
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
};

export default new CreateSpot();
