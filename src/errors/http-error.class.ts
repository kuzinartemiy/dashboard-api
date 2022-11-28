export class HTTPError extends Error {
	statusCode: number;
	context?: string;

	constructor(status: number, message: string, context?: string) {
		super(message);

		this.statusCode = status;
		this.message = message;
		this.context = context;
	}
}
