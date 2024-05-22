import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
    page: number;
    limit: number;
    offset: number;
}

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1000;

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(limit) || limit < 0) {
        throw new BadRequestException('Invalid pagination params');
    }
    // do not allow to fetch large slices of the dataset
    if (limit > 1000) {
        throw new BadRequestException('Invalid pagination params: Max limit is 1000');
    }

    // calculate pagination parameters
    const offset = page * limit;
    return { page, limit, offset };
});