import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.mongoose';
import { ReqresApiService } from '../reqres-api/reqres-api.service';
import { ImageService } from '../image/image.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateUserDto } from './dto/create-user.dto';
import configuration from '../config/configuration';

import faker from 'faker';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;
  let apiService: ReqresApiService;
  let imageService: ImageService;
  let amqpConnection: AmqpConnection;
  let mailerService: MailerService;

  const user = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockImplementation((input) => ({
              ...input,
              save: jest.fn().mockResolvedValue(input),
            })),
            findOne: jest.fn(),
            findOneAndDelete: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: ReqresApiService,
          useValue: {
            fetchDataFromApi: jest.fn().mockReturnValue({
              toPromise: jest.fn().mockResolvedValue({
                data: {
                  data: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  },
                },
              }),
            }),
          },
        },
        {
          provide: ImageService,
          useValue: {
            getImageAsBase64: jest.fn<Promise<string>, [string]>(),
            saveImage: jest.fn(),
            deleteImage: jest.fn(),
          },
        },
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    apiService = module.get<ReqresApiService>(ReqresApiService);
    imageService = module.get<ImageService>(ImageService);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and publish to RabbitMQ', async () => {
      const createUserDto: CreateUserDto = {
        reqresId: 1,
        avatar: '',
        id: '',
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);
      jest.spyOn(amqpConnection, 'publish').mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(apiService.fetchDataFromApi).toHaveBeenCalledWith('/api/users/1');
      expect(mailerService.sendMail).toHaveBeenCalledWith(user.email);
      expect(amqpConnection.publish).toHaveBeenCalledWith(
        configuration().rabbitMQExchange,
        configuration().rabbitMQRoutingKey,
        expect.objectContaining({ email: user.email }),
      );
      expect(result).toEqual(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should find a user by reqresId', async () => {
      const user = { reqresId: 1, email: 'test@example.com' };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);

      const result = await service.findOne(1);

      expect(userModel.findOne).toHaveBeenCalledWith({ reqresId: 1 });
      expect(result).toEqual(user);
    });
  });

  describe('getAvatar', () => {
    it('should return the local avatar', async () => {
      const user = { reqresId: 1, localAvatar: 'uploads/avatars/image.jpg' };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);
      await service.getAvatar(1);

      expect(userModel.findOne).toHaveBeenCalledWith({ reqresId: 1 });
      expect(imageService.getImageAsBase64).toHaveBeenCalledWith(
        'uploads/avatars/image.jpg',
      );
    });
  });

  describe('remove', () => {
    it('should delete a user and their local avatar', async () => {
      const user = { reqresId: 1, localAvatar: 'uploads/avatars/image.jpg' };
      jest.spyOn(userModel, 'findOneAndDelete').mockResolvedValue(user as any);
      await service.remove(1);
      expect(userModel.findOneAndDelete).toHaveBeenCalledWith({ reqresId: 1 });
      expect(imageService.deleteImage).toHaveBeenCalledWith(
        'uploads/avatars/image.jpg',
      );
    });
    it('should delete a user without a local avatar', async () => {
      const user = { reqresId: 1 };
      jest.spyOn(userModel, 'findOneAndDelete').mockResolvedValue(user as any);
      await service.remove(1);
      expect(userModel.findOneAndDelete).toHaveBeenCalledWith({ reqresId: 1 });
      expect(imageService.deleteImage).not.toHaveBeenCalled();
    });
  });
});
