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

export interface SpotPostLimit extends mongoose.Document {
  email: string;
  coordinates: string;
  created_time: number;
}

export const SpotPostLimitSchema = new Schema({
  email: {
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
  },
  created_time: {
    type: Date,
    default: Date.now(),
    index: { expires: '1m' }
  }
});

const SpotPostLimitsDB = mongoose.model<SpotPostLimit>('spot-post-limits', SpotPostLimitSchema);
export default SpotPostLimitsDB;