import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserValidatorPipe } from './validator/users.validator';
import { CreateUserDto } from './dto/create-user.dto';

import { Response } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(
    @Body(new UserValidatorPipe()) createUserBody: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.userService.create(createUserBody);
      return res.status(HttpStatus.CREATED).send(user);
    } catch (e) {
      if (e?.message?.toLowerCase()?.includes('duplicate')) {
        return res.status(HttpStatus.CONFLICT).send(e.message);
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.userService.findOne(Number(id));
      if (user) return res.status(HttpStatus.OK).send(user);
      return res.status(HttpStatus.NOT_FOUND).send('User not found');
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id', ParseIntPipe) id: string, @Res() res: Response) {
    try {
      const user = await this.userService.getAvatar(Number(id));
      if (user) return res.status(HttpStatus.OK).send(user);
      return res.status(HttpStatus.NOT_FOUND).send('User not found');
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(Number(id));
  }
}
