import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Converts an object to a dotified object.
 *
 * @param obj         Object
 * @returns           Dotified Object
 */
export const dotify = (obj: any) => {

    const res: any = {};
  
    function recurse(obj: any, current?: string) {
      for (const key in obj) {
        const value = obj[key];
        const newKey = (current ? current + '.' + key : key);
        if (value && typeof value === 'object') {
          recurse(value, newKey);
        } else {
          res[newKey] = value;
        }
      }
    }
  
    recurse(obj);
    return res;
  }

export interface SupportedCity extends mongoose.Document {
    name: string;
    coordinates: string;
}

export const SupportedCitySchema = new Schema({
  name: {
        type: String,
        index: true,
        unique: true,
        required: true            
    },
    coordinates: {
      type: String,
      index: true,
      unique: true,
      required: true            
  }
});

const SupportedCitiesDB = mongoose.model<SupportedCity>('supported-cities', SupportedCitySchema);
export default SupportedCitiesDB;