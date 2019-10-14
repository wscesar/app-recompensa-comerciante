import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../model/product.model';
import { RestaurantService } from '../services/restaurant.service';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { UiManagerService } from '../services/ui-manager.service';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-restaurant',
    templateUrl: './restaurant.page.html',
    styleUrls: ['./restaurant.page.sass'],
})
export class RestaurantPage implements OnInit {

    private restaurantId: string;
    private restaurant: Restaurant;
    private products: Product[];
    private isLoading: boolean;
    private showProduct = true;

    constructor(
        private alertCtrl: AlertController,
        private authService: AuthService,
        private productService: ProductService,
        private restaurantService: RestaurantService
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.isLoading = true;

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
        this.alertCtrl.create({
            header: 'Apagar Produto',
            message: 'Essa operação não pode ser desfeita',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.productService.deleteProduct(this.restaurantId, productId);
                    }
                },
            ]
        }).then(alertEl => {
            alertEl.present();
        });
    }

}
