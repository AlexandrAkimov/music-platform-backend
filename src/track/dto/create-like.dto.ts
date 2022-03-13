import { ObjectId } from "mongoose"

export class CreateLikeDto {
  readonly username: string;
  readonly trackId: ObjectId;
}