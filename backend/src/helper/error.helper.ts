import { type Response } from "express";


export type ControllerResponse = ApiResponse | Response;

export class ApiResponse {

    constructor(protected message: string, protected statusCode: number, protected data: unknown = null) { }

    protected prepare(res: Response): Response {
        return res.status(this.statusCode).json({
            message: this.message,
            statusCode: this.statusCode,
            data: this.data
        });
    }

    public send(res: Response): ControllerResponse {
        return this.prepare(res);
    }
}

export class ApiError extends Error {
    constructor( public override message: string = 'Error!',public statusCode: number) {
        super();
    }

    public handle(err: ApiError, res: Response): ControllerResponse {
        const message = err.message;
        return new ApiResponse(message, this.statusCode).send(res);
    }

}

