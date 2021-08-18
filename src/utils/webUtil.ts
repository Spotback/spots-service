import { Response } from 'express';
import { Spot } from '../model/spots-by-block';
import * as Constants from '../utils/constants';

class WebUtil {

    public errorResponse(res: Response, err: any, code: string, status: number): void {
        console.log(err);
        res.status(status).json({
            code: code,
            message: err
        });
    }

    public successResponse(res: Response, data: any, status: number, headers?: any): void {
        res.status(status).header(headers).json(data);
    }

    public htmlResponse(res: Response, file: string, status: number): void {
        res.status(status).sendFile(file, { root: Constants.STATIC_RESOURCES })
    }

    public stripPII(data: any): Spot {
        const user = Object.assign({}, data._doc);
        delete user.password;
        return user;
    }
}

export default new WebUtil();