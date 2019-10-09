export class Voucher {
    constructor(
        public voucherId: string,
        public restaurantId: string,
        public productId: string,
        public userId: string,
    ) {}
}
