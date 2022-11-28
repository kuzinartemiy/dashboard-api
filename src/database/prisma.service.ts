import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILoggerService) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] The connection to the database is successful.');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] Error connecting to the database: ${error.message}`);
			} else {
				this.logger.error(`[PrismaService] Error connecting to the database: ${error}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.$disconnect();
			this.logger.log('[PrismaService] The connection to the database has been terminated.');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] Error disconnecting to the database: ${error.message}`);
			} else {
				this.logger.error(`[PrismaService] Error disconnecting to the database: ${error}`);
			}
		}
	}
}
