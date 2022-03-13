import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import * as mongoose from 'mongoose'

export type LikeDocument = Like & Document;

@Schema()
export class Like {
  @Prop()
  username: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Track'})
  track: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);