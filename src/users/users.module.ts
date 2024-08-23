import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.mongoose';
import { ReqresApiService } from 'src/reqres-api/reqres-api.service';
import { HttpModule } from '@nestjs/axios';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ReqresApiService, ImageService],
})
export class UserModule {}
