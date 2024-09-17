import { BadRequestException } from '@nestjs/common';
import { UserValidatorPipe } from './users.validator';
import { CreateUserRequestDto } from '../dto/create-user.dto';
import faker from 'faker';

describe('UserValidatorPipe with Faker', () => {
  let userValidatorPipe: UserValidatorPipe;

  beforeEach(() => {
    userValidatorPipe = new UserValidatorPipe();
  });

  it('should validate and transform a valid CreateUserRequestDto using Faker', () => {
    const validUserRequest: CreateUserRequestDto = {
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    const id = faker.datatype.uuid();
    const reqresId = faker.datatype.number();

    const result = userValidatorPipe.transform({
      ...validUserRequest,
      ...{ id, reqresId },
    });

    expect(result).toEqual({
      avatar: validUserRequest.avatar,
      dateCreated: expect.any(Date),
      email: validUserRequest.email,
      firstName: validUserRequest.firstName,
      lastName: validUserRequest.lastName,
      id,
      reqresId,
    });
  });

  it('should throw BadRequestException for an invalid CreateUserRequestDto using Faker', () => {
    const invalidUserRequest: CreateUserRequestDto = {
      avatar: faker.image.avatar(),
      email: 'invalid-email',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    expect(() => userValidatorPipe.transform(invalidUserRequest)).toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException with correct error messages for an invalid CreateUserRequestDto using Faker', () => {
    const invalidUserRequest: CreateUserRequestDto = {
      avatar: faker.image.avatar(),
      email: 'invalid-email',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    try {
      userValidatorPipe.transform(invalidUserRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain('"email" must be a valid email');
    }
  });
});
