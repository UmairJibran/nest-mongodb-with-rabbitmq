import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  reqresId: number;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: false })
  localAvatar: string;

  @Prop({ required: false })
  imageHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.post('save', function (error: Error, _doc: User, next) {
  console.log('An error occurred:', error.message);
  if (error.message.includes('E11000 duplicate key error collection')) {
    next(new Error('Duplicate for reqresId or email found.'));
  } else next();
});
