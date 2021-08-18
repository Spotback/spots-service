import * as Constants from '../utils/constants';

class LookUpUtil {

    /**
     * Takes in x,y -> "x,(y+1)"
     * @param {number} x - coordinate
     * @param {number} y - coordinate
     */
    public xSameYUpper(x: number, y: number): string {
        let newY;
        if (y <= 0) {
            newY = (Math.abs(y) + 0.01) * -1;
        } else {
            newY = y + 0.01;
        }
        const blocCoord = x.toFixed(2) + "," + newY.toFixed(2);
        return blocCoord;
    }

    /**
     * Takes in x,y -> "x,(y-1)"
     * @param {number} x - coordinate
     * @param {number} y - coordinate
     */
    public xSameYLower(x: number, y: number) {
        let newY;
        if (y <= 0) {
            newY = (Math.abs(y) - 0.01) * -1;
        } else {
            newY = y - 0.01;
        }
        let blocCoord = x.toFixed(2) + "," + newY.toFixed(2);
        return blocCoord;
    }

    /**
     * Takes in x,y -> "(x+1),y"
     * @param {number} x - coordinate
     * @param {number} y - coordinate
     */
    public ySameXUpper(x: number, y: number) {
        let newX;
        if (x <= 0) {
            newX = (Math.abs(x) + 0.01) * -1;
        } else {
            newX = x + 0.01;
        }
        let blocCoord = newX.toFixed(2) + "," + y.toFixed(2);
        return blocCoord;
    }

    /**
     * Takes in x,y -> "(x-1),y"
     * @param {number} x - coordinate
     * @param {number} y - coordinate
     */
    public ySameXLower(x: number, y: number) {
        let newX;
        if (x <= 0) {
            newX = (Math.abs(x) - 0.01) * -1;
        } else {
            newX = x - 0.01;
        }
        let blocCoord = newX.toFixed(2) + "," + y.toFixed(2);
        return blocCoord;
    }


    /**
     * Takes in coordinates and generates a query
     * that will search for blocks near the coordinates
     * @param {string} desiredLocation
     * @returns {Object} mongodb query
     */
    public generateLookupQuerey = (desiredLocation: string) => {
        const longitudeX = parseFloat(desiredLocation.split(",")[0]);
        const latitudeY = parseFloat(desiredLocation.split(",")[1]);
        const xSameYUp = this.xSameYUpper(longitudeX, latitudeY);
        const xSameYSame = longitudeX.toFixed(2) + "," + latitudeY.toFixed(2);
        const xSameYLow = this.xSameYLower(longitudeX, latitudeY);
        const xUpYSame = this.ySameXUpper(longitudeX, latitudeY);
        const xlowYSame = this.ySameXLower(longitudeX, latitudeY);
        let query = {
            blockCoordinate: {
                $in: [xSameYUp, xSameYSame, xSameYLow, xUpYSame, xlowYSame]
            }
        };
        return query;
    }

}

export default new LookUpUtil();