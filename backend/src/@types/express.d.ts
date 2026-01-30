import 'express';

declare global {
  namespace Express {
    interface Request {
      userId: number;
      userRole: number;
      paramsId: number;
      cookies: Record<string, string>;
    }

    interface Response {
      success<T>(data: T): this;
      created<T>(data: T): this;
      deleted(): void;
    }
  }
}

export {};
