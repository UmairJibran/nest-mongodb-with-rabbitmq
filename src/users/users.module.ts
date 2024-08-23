import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.mongoose';
import { ReqresApiService } from 'src/reqres-api/reqres-api.service';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ImageService } from 'src/image/image.service';
import configuration from 'src/config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: configuration().rabbitMQExchange,
          type: 'topic',
        },
      ],
      uri: configuration().rabbitMQUrl,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ReqresApiService, ImageService],
})
export class UserModule {}
