import { Component, OnInit } from '@angular/core';
import { Voucher } from '../model/voucher.model';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../model/product.model';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-vouchers',
  templateUrl: './voucher-list.page.html',
})
export class VoucherListPage implements OnInit {

    private vouchers: Voucher[];
    private isLoading = true;

    private users: User[] = [];
    private products: Product[] = [];

    private restaurantId =  this.authService.getUserId();

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private productService: ProductService,
    ) {}

    ngOnInit() {
        this.productService.getVouchers(this.restaurantId).subscribe(vouchers => {
            this.isLoading = false;
            this.vouchers = vouchers;

            for (const v of vouchers) {
                this.productService.getProduct(this.restaurantId, v.productId).subscribe(product => {
                    this.products.push(product);
                });

                this.userService.getUser(v.userId).subscribe(user => {
                    this.users.push(user);
                });
            }

        });
    }

    onValidateVoucher(voucherId: string) {
        this.productService
                .validateVoucher(voucherId)
                .then( () => {
                    console.log('Voucher validated successfully!');
                })
                .catch(err => {
                    console.log('Voucher validation error!');
                    console.log(err);
                });
    }

}
