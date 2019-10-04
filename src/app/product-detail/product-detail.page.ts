import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../model/product.model';
import { RestaurantService } from '../services/restaurant.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
})
export class ProductDetailPage implements OnInit {

    private isLoading: boolean = true;
    private image: string;
    private title: string;
    
    private productScore: number;
    private userScore: number;

    private restaurantId: string;
    private productId: string;
    
    private restaurant: Restaurant;
    private restaurants: Restaurant[];
    private product: Product;
    private products: Product[];

    private disableButton = false;

    constructor (
        private dbService: RestaurantService,
        private route: ActivatedRoute,
        private productService: ProductService,
        ) {}

    ionViewWillEnter(){
        
    }
    
    ngOnInit() {
        this.productId = this.route.snapshot.paramMap.get("productId");
        this.restaurantId = this.route.snapshot.paramMap.get("place");
        // let restaurantId = this.dbService.getUid()

        this.productService.getProduct(this.productId).subscribe( product => {
            this.product = product
            this.title = product.title;
            this.image = product.image;
            this.productScore = product.price;
            
            this.dbService.getRestaurant(this.restaurantId).subscribe( res => {
                this.restaurant = res;
                this.isLoading = false;
            });

        });
        
    }

    

}
