import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../model/product.model';
import { RestaurantService } from '../services/restaurant.service';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { UiManagerService } from '../services/ui-manager.service';

@Component({
    selector: 'app-restaurant',
    templateUrl: './restaurant.page.html',
    styleUrls: ['./restaurant.page.sass'],
})
export class RestaurantPage implements OnInit {

    private restaurantId: string;
    private restaurant: Restaurant ;
    private products: Product[];
    private isLoading: boolean;

    constructor(
        private uiManager: UiManagerService,
        private authService: AuthService,
        private productService: ProductService,
        private restaurantService: RestaurantService
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.isLoading = true;
        this.uiManager.hideLoading();

        this.restaurantId = this.authService.getUserId();

        this.restaurantService.getRestaurant(this.restaurantId).subscribe(restaurant => {
            this.restaurant = restaurant;

            this.productService.getProducts(this.restaurantId).subscribe(products => {
                this.products = products;
                this.isLoading = false;
            });
        });
    }

    onDeleteProduct(productId: string) {
        this.productService.deleteProduct(productId);
    }

}
