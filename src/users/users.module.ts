import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.mongoose';
import { ReqresApiService } from '../reqres-api/reqres-api.service';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ImageService } from '../image/image.service';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from '..//mailer/mailer.service';

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
  providers: [UsersService, ReqresApiService, ImageService, MailerService],
})
export class UserModule {}
