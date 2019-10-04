import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { take, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Product } from '../model/product.model';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { UiManagerService } from '../services/ui-manager.service';
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.page.html',
})
export class ProductCreatePage implements OnInit {
    form: FormGroup;
    product: Product;
    products: Product[];
    productId: string;
    restaurantId: string;
    image: string = null;
    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;

    constructor (
        private route: ActivatedRoute,
        private authService: AuthService,
        private uiManager: UiManagerService,
        private storage: AngularFireStorage,
        private uploadService: UploadService,
        private productService: ProductService,
        
    ) {}

    ngOnInit() {
        this.setForm(null, null);
        this.productId =  this.route.snapshot.paramMap.get('productId');
        this.restaurantId = this.authService.getUserId();
        console.log(this.productId)

        this.productService
                .getProduct(this.productId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.image = res.image
                        console.log(res.image)
                        this.setForm(res.title, res.price);
                    }
                )
    }

    setForm( product: string, price: number ) {
        this.form = new FormGroup({
            
            product: new FormControl(product, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),

            price: new FormControl(price, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),

        });
    }

    onSubmit() {

        this.uiManager.showLoading();

        const productData = new Product (
            this.form.value.product,
            +this.form.value.price,
            this.image,
            this.restaurantId
        );

        if ( this.productId != null ) {

            this.productService
                    .updateProduct(this.productId, productData)
                    .then( () => {
                        this.uiManager.hideProgressBar();
                        this.uiManager.navigateTo('/restaurantes');
                    });

        } else {

            this.productService
                    .addProduct(productData)
                    .then( () => {
                        this.uiManager.hideProgressBar();
                        this.uiManager.navigateTo('/restaurantes');
                    });

        }

    }

    uploadFile(event) {
        const file = event.target.files[0];
        const filePath = 'restaurants/'+this.authService.getUserId();
        const fileRef = this.storage.ref(filePath);

        const task = this.storage.upload(filePath, file);
        // this.uploadPercent = task.percentageChanges();
        task.snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.updateImageUrl();
                    })
                )
                .subscribe()
    }

    updateImageUrl() {
        this.downloadURL.subscribe(imageUrl => {
            // this.productService.updateProductImage(imageUrl);
            this.image = imageUrl;
        });
    }

}
