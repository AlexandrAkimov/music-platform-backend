import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.bbypv.mongodb.net/music-platform?retryWrites=true&w=majority'),
    TrackModule,
    FileModule,
    AuthModule,
    UserModule
  ]
})

export class AppModule {

}