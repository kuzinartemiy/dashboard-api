import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Invalid Email.' })
	email: string;

	@IsString({ message: 'Invalid password.' })
	password: string;
}
