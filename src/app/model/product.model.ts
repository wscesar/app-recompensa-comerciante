export class Promotion {
    constructor(
        public promoPrice: number,
        public startDate: string,
        public endDate: string
    ) {}
}
export class Product {
    constructor(
        public title: string,
        public price: number,
        public image: string,
        public id?: string,
        // public promotion?: Promotion
        public promoPrice?: number,
        public startDate?: any,
        public endDate?: any
    ) {}
  }
