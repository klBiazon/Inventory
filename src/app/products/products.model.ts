import { Category } from './../category/category.model';

export interface Products {
    _id?: number;
    imgUrl?: string;
    description?: string;
    price?: string;
    categories: Array<Category>;
}