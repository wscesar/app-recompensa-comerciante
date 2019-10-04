import { Product } from './product.model'

export class Restaurant {
    constructor(
        public title: string,
        public image: string,
        public id?: string,
    ) {}
}