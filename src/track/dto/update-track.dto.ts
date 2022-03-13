import { ObjectId } from "mongoose";

export class UpdateTrackDto {
  readonly id: ObjectId
  readonly name: string;
  readonly artist: string;
  readonly text: string
}