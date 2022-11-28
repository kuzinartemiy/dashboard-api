import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			};
		});
		createdUser = await userService.createUser({
			email: 'a@a.ru',
			name: 'Artemiy',
			password: 'password',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('password');
	});

	it('validate user: success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await userService.validateUser({
			email: 'a@a.ru',
			password: 'password',
		});

		expect(result).toBeTruthy();
	});

	it('validate user: wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await userService.validateUser({
			email: 'a@a.ru',
			password: 'password2',
		});

		expect(result).toBeFalsy();
	});

	it('validate user: wrong login', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await userService.validateUser({
			email: 'a12@a.ru',
			password: 'password',
		});

		expect(result).toBeFalsy();
	});
});
