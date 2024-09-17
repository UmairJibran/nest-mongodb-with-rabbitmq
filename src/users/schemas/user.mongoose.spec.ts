import mongoose, { Model } from 'mongoose';
import { UserDocument } from './user.mongoose'; // Adjust the path as needed
import { Connection, createConnection } from 'mongoose';

import faker from 'faker';

describe('UserSchema', () => {
  let userModel: Model<UserDocument>;
  let connection: Connection;

  beforeAll(async () => {
    connection = createConnection('mongodb://localhost:27017/test');

    const UserSchema = new mongoose.Schema({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      reqresId: { type: Number, required: true, unique: true },
      avatar: { type: String },
      localAvatar: { type: String },
      imageHash: { type: String },
    });

    userModel = connection.model<UserDocument>('User', UserSchema);
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should create a user successfully', async () => {
    const user = new userModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      reqresId: faker.datatype.number(),
    });

    const savedUser = await user.save();
    expect(savedUser.firstName).toBe(user.firstName);
    expect(savedUser.email).toBe(user.email);
  });

  it('should throw error on duplicate email or reqresId', async () => {
    const sameEmail = faker.internet.email();

    const user1 = new userModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: sameEmail,
      reqresId: faker.datatype.number(),
    });

    const user2 = new userModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      reqresId: faker.datatype.number(),
    });

    await user1.save();

    try {
      await user2.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error);
      expect(error.message).toContain('duplicate key error');
    }
  });

  it('should allow non-required fields to be undefined', async () => {
    const user = new userModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      reqresId: faker.datatype.number(),
    });

    const savedUser = await user.save();
    expect(savedUser.avatar).toBeUndefined();
    expect(savedUser.localAvatar).toBeUndefined();
  });
});
