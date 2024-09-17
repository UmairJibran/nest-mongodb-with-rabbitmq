import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import faker from 'faker';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            getAvatar: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return status 201', async () => {
      const createUserDto: CreateUserDto = {
        reqresId: 1,
        avatar: '',
        id: '',
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      const res = mockResponse();
      const user = { id: 1, localAvatar: '', imageHash: '', ...createUserDto };
      jest.spyOn(service, 'create').mockResolvedValue(user);
      await controller.create(createUserDto, res);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(user);
    });
    it('should return status 409 if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        reqresId: 1,
        avatar: '',
        id: '',
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      const res = mockResponse();
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Duplicate entry'));
      await controller.create(createUserDto, res);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(res.send).toHaveBeenCalledWith('Duplicate entry');
    });
    it('should return status 500 for other errors', async () => {
      const createUserDto: CreateUserDto = {
        reqresId: 1,
        avatar: '',
        id: '',
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      const res = mockResponse();
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Internal server error'));
      await controller.create(createUserDto, res);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const res = mockResponse();
      const user = {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        avatar: faker.image.imageUrl(),
        reqresId: 1,
        localAvatar: '',
        imageHash: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      await controller.findOne('1', res);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(user);
    });

    it('should return status 404 if user not found', async () => {
      const res = mockResponse();

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await controller.findOne('1', res);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });

    it('should return status 500 for other errors', async () => {
      const res = mockResponse();

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Internal server error'));

      await controller.findOne('1', res);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
  });

  describe('getAvatar', () => {
    it('should return user avatar if found', async () => {
      const res = mockResponse();
      const avatar = faker.image.imageUrl();

      jest.spyOn(service, 'getAvatar').mockResolvedValue(avatar);

      await controller.getAvatar('1', res);

      expect(service.getAvatar).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(avatar);
    });

    it('should return status 404 if user not found', async () => {
      const res = mockResponse();

      jest.spyOn(service, 'getAvatar').mockResolvedValue(null);

      await controller.getAvatar('1', res);

      expect(service.getAvatar).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });

    it('should return status 500 for other errors', async () => {
      const res = mockResponse();

      jest
        .spyOn(service, 'getAvatar')
        .mockRejectedValue(new Error('Internal server error'));

      await controller.getAvatar('1', res);

      expect(service.getAvatar).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
