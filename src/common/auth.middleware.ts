import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { verify } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const jwt = req.headers.authorization.split(' ')[1];
			verify(jwt, this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload && typeof payload !== 'string') {
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
