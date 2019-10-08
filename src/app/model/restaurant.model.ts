export class Restaurant {
    constructor(
        public title: string,
        public image: string,
        public restaurantId?: string,
        public hours?: {
            weekDays: [],
            openAt: string,
            closeAt: string
        }
    ) {}
}
