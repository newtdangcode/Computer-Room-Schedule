import { FindOperator } from 'typeorm';

interface QueryString {
    search?: string;
    [key: string]: any;
}

export class ApiFeatures<T> {
    private query: any;
    private queryString: QueryString;

    constructor(query: any, queryString: QueryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const { search, ...objQuery } = this.queryString;
        const excludedFields = ["page", "limit", "sort", "fields", "search"];

        excludedFields.forEach((field) => {
            delete objQuery[field];
        });

        const queryString: any = JSON.parse(
            JSON.stringify(objQuery).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`),
        );

        const q = search ? this.removeAccents(search) : "";

        const query = q ? { ...queryString, searchName: { $regex: new RegExp(q, "i") } } : { ...queryString };

        this.query = this.query.find(query);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select(["id", ...this.query.metadata.columns.map((column: any) => column.propertyName)]);
        }
        return this;
    }

    async paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).take(limit);

        const totalCount = await this.query.getCount();

        const totalPages = Math.ceil(totalCount / limit);

        return {
            query: await this.query.getMany(),
            totalPages,
            currentPage: page,
        };
    }

    private removeAccents(str: string): string {
        // Logic to remove accents
        return str;
    }
}
