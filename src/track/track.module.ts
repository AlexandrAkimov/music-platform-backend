import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './schemas/track.schema';
import { Comment, CommentSchema } from './schemas/comments.schema';
import { FileService } from 'src/file/file.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { LikeSchema, Like } from './schemas/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
    MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]),
  ],
  providers: [TrackService, FileService],
  controllers: [TrackController]
})
export class TrackModule {}
