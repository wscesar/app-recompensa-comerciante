import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../model/product.model';
import { RestaurantService } from '../services/restaurant.service';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.sass'],
})
export class ProfilePage implements OnInit {

    restaurantTitle: string
    restaurantImage: string
    private productId: string;
    private restaurantId: string;

    private restaurant: Restaurant;
    private products: Product[];
    private isLoading: boolean;

    constructor (
        private productService: ProductService,
        private route: ActivatedRoute,
        private dbService: RestaurantService
    ) {}
    
    ngOnInit() {

        this.isLoading = true;

        this.restaurantId = this.route.snapshot.paramMap.get("place");

        this.productService.getProducts(this.restaurantId).subscribe(products => {
            this.products = products;
            this.isLoading = false;
        });

        this.dbService.getRestaurant(this.restaurantId).subscribe(restaurant => {
            this.restaurant = restaurant;
            this.restaurantTitle = restaurant.title;
            this.restaurantImage = restaurant.image;
            this.isLoading = false;
        });

    }

    onDeleteProduct(productId: string) {
        this.productService.deleteProduct(productId)
    }

}
