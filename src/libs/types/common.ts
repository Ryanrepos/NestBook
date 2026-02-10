import { ObjectId } from 'mongoose';

// Generic object type
export type T = Record<string, any>;

// Statistics modifier interface
export interface StatisticModifier {
  _id: ObjectId;
  targetKey: string;
  modifier: number;
}