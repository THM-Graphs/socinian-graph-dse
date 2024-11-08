import { NextFunction, Request, Response } from 'express';

export class ExpressUtils {
  public static decodeMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
      decodeURIComponent(req.path);
      next();
    } catch (error: unknown) {
      console.error(error, req.url);
      const url: string = ['https://', req.get('Host'), '/404'].join('');
      return res.redirect(url);
    }
  }
}
