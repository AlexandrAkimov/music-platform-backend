import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateLikeDto } from './dto/create-like.dto';

@UseGuards(JwtAuthGuard)
@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
    const {picture, audio} = files
    
    return this.trackService.create(dto, picture[0], audio[0])
  }

  
  @Get()
  getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.trackService.getAll(count, offset)
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query)
  }

  @Put()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  update(@UploadedFiles() files, @Body() dto: UpdateTrackDto) {
    const {picture, audio} = files
    return this.trackService.update(dto, picture[0], audio[0])
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id)
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @Post('/comment')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto)
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id)
  }

  @Post('/likes')
  likes(@Body() dto: CreateLikeDto) {
    return this.trackService.likes(dto)
  }
  
}
