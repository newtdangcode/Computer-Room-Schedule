import { IsNull, Not, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, ILike, In } from "typeorm";

import { Filtering } from "src/helpers/decorators/filteringParams"
import { Sorting } from "src/helpers/decorators/sortingParams";
import { FilterRule } from "src/helpers/decorators/filteringParams";

export const getOrder = (sort: Sorting) => sort ? { [sort.property]: sort.direction } : {};

export const getWhere = (filter: Filtering[]) => {
    const response = [];
    //console.log(filter);
    filter?.map((filter) => {
        //if (!filter) return {};
    
        if (filter.rule == FilterRule.IS_NULL) response.push({ [filter.property]: IsNull() });
        if (filter.rule == FilterRule.IS_NOT_NULL) response.push({ [filter.property]: Not(IsNull()) });
        if(filter.property =='is_active' && filter.rule == FilterRule.EQUALS) response.push({ [filter.property]: filter.value == 'true' ? true : false })
        else if (filter.rule == FilterRule.EQUALS) response.push({ [filter.property]: filter.value });
        if (filter.rule == FilterRule.NOT_EQUALS) response.push({[filter.property]: Not(filter.value) });
        if (filter.rule == FilterRule.GREATER_THAN) response.push({ [filter.property]: MoreThan(filter.value) });
        if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS) response.push({ [filter.property]: MoreThanOrEqual(filter.value) });
        if (filter.rule == FilterRule.LESS_THAN) response.push({ [filter.property]: LessThan(filter.value) });
        if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS) response.push( { [filter.property]: LessThanOrEqual(filter.value) });
        
        if (filter.rule == FilterRule.LIKE) response.push({ [filter.property]: ILike(`%${filter.value}%`) });
        if (filter.rule == FilterRule.NOT_LIKE) response.push({ [filter.property]: Not(ILike(`%${filter.value}%`)) });
        if (filter.rule == FilterRule.IN) response.push({ [filter.property]: In(filter.value.split(',')) });
        if (filter.rule == FilterRule.NOT_IN) response.push({ [filter.property]: Not(In(filter.value.split(','))) });
    });
    //console.log(response);
    return response;
}