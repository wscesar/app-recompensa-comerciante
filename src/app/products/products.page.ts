import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
})
export class ProductsPage implements OnInit {
    
    private products: Product[];
    private isLoading = true;
    
    constructor (
        private productService: ProductService,
        private authService: AuthService
    ) {}


    ngOnInit() {
        const restaurantId = this.authService.getUserId();

        this.productService.getProducts(restaurantId).subscribe( products => {
            this.isLoading = false;
            this.products = products;
        });
    }

    onDeleteProduct(productId: string) {
        this.productService.deleteProduct(productId)
    }


}
