export class CreateUserDto {
  readonly id: string;
  readonly reqresId: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public avatar: string;
}

export class CreateUserRequestDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly avatar: string;
}
