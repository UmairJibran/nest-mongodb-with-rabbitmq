import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.mongoose';
import { CreateUserDto } from './dto/create-user.dto';

import { ReqresApiService } from '../reqres-api/reqres-api.service';
import { ImageService } from '../image/image.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly apiService: ReqresApiService,
    private readonly imageService: ImageService,
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {
    const input = createUser;

    if (
      !createUser.email ||
      !createUser.firstName ||
      !createUser.lastName ||
      !createUser.avatar
    ) {
      const { data } = await this.apiService
        .fetchDataFromApi(`/api/users/${createUser.reqresId}`)
        .toPromise();
      const response = data.data;
      input.firstName = response.first_name;
      input.lastName = response.last_name;
      input.email = response.email;
      input.avatar = response.avatar;
    }
    const createdUser = new this.userModel(input);
    return createdUser.save();
  }

  findOne(id: number): Promise<User | undefined> {
    return this.userModel.findOne({
      reqresId: id,
    });
  }

  async getAvatar(id: number): Promise<string | undefined> {
    const user = await this.userModel.findOne({
      reqresId: id,
    });
    if (!user) return;
    if (user.localAvatar) {
      return this.imageService.getImageAsBase64(user.localAvatar);
    }

    const response = await lastValueFrom(
      this.apiService.fetchDataFromApi(
        user.avatar.replace('https://reqres.in', ''),
        {
          responseType: 'arraybuffer',
        },
      ),
    );
    const image: Buffer = response.data;
    const { filePath, imageHash } = this.imageService.saveImage(image);
    await this.userModel.updateOne(
      {
        reqresId: id,
      },
      {
        localAvatar: filePath,
        imageHash,
      },
    );
    return this.imageService.getImageAsBase64(filePath);
  }

  async remove(id: number): Promise<void> {
    const deletedUser = await this.userModel.findOneAndDelete({
      reqresId: id,
    });
    if (deletedUser?.localAvatar) {
      this.imageService.deleteImage(deletedUser.localAvatar);
    }
  }
}
