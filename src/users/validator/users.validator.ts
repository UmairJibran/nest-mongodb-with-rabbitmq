import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CreateUserDto, CreateUserRequestDto } from '../dto/create-user.dto';
import { userSchema } from '../schemas/user.joi';

export class UserValidatorPipe
  implements PipeTransform<CreateUserRequestDto, CreateUserDto>
{
  public transform(query: CreateUserRequestDto): CreateUserDto {
    const result = userSchema.validate(query, {
      convert: true,
    });

    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }

    const validUser = result.value;
    return {
      id: validUser.id,
      reqresId: validUser.reqresId,
      avatar: validUser.avatar,
      dateCreated: new Date(),
      email: validUser.email,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
    } as CreateUserDto;
  }
}
