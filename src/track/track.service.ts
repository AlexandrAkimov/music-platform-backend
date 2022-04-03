import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { Track, TrackDocument } from './schemas/track.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like, LikeDocument } from './schemas/likes.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private fileService: FileService
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackModel.create({...dto, listens: 0, audio: audioPath, picture: picturePath})
    return track
  }

  async update(dto: UpdateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    await this.trackModel.findByIdAndUpdate(dto.id, { $set: {...dto, audio: audioPath, picture: picturePath}})
    return await this.trackModel.findById(dto.id)
  }

  
  async getAll(count = 10, offset = 0): Promise<Track[]> {
    return await this.trackModel.find().skip(Number(offset)).limit(Number(count))
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments')
    return track
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id)
    return track._id
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId)
    const comment = await this.commentModel.create({...dto})
    track.comments.push(comment._id)
    await track.save()
    return comment
  }

  async listen(id: ObjectId): Promise<void>{
    const track = await this.trackModel.findById(id)
    track.listens++
    track.save()
  }

  async likes(dto: CreateLikeDto): Promise<Like[]>{
    const track = await this.trackModel.findById(dto.trackId)
    const likes = await this.likeModel.find({username: dto.username})
    console.log(track.likes);
    
    const like = track.likes.find(l => { 
      return likes.some(li => JSON.stringify(li._id) === JSON.stringify(l))
    })
      
    

    console.log(like);
    
    if (like) {
      await this.likeModel.findByIdAndDelete(like)
      track.likes = track.likes.filter(l => like !== l)
      
    } else {
      const newLike = await this.likeModel.create({...dto})
      
      track.likes.push(newLike._id)
    }
  
    await track.save()
    return track.likes
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: {$regex: new RegExp(query, 'i')}
    })
    return tracks
  }
}
