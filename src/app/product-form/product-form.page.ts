import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { take, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Product, Promotion } from '../model/product.model';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { UiManagerService } from '../services/ui-manager.service';
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
})
export class ProductFormPage implements OnInit {
    form: FormGroup;
    product: Product;
    products: Product[];
    productId: string;
    restaurantId: string;
    image: string = null;
    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private uiManager: UiManagerService,
        private storage: AngularFireStorage,
        private uploadService: UploadService,
        private productService: ProductService,
    ) {}

    ngOnInit() {
        this.setForm(null, null, null, null);
    }

    ionViewWillEnter() {
        this.setForm(null, null, null, null);
        this.productId =  this.route.snapshot.paramMap.get('productId');
        this.restaurantId = this.authService.getUserId();

        this.productService
                .getProduct(this.productId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.isLoading = false;
                        this.image = res.image;
                        this.setForm(res.title, res.price, res.startDate, res.endDate);

                        // this.form.patchValue({title: res.title});
                    }
                );
    }

    setForm( product: string, price: number, startDate: string, endDate: string ) {
        this.form = new FormGroup({

            product: new FormControl(product, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            price: new FormControl(price, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            // promoPrice: new FormControl(price, {
            //     updateOn: 'change',
            //     validators: [Validators.required]
            // }),

            startDate: new FormControl(startDate, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            endDate: new FormControl(endDate, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

        });
    }

    onSubmit() {

        this.isLoading = true;

        const promoData =  new Promotion(
            9,
            this.form.value.startDate,
            this.form.value.endDate,
        );

        const productData = new Product (
            this.form.value.product,
            +this.form.value.price,
            this.image,
            this.restaurantId,
            +this.form.value.price * 0.5,
            this.form.value.startDate,
            this.form.value.endDate,
        );

        if ( this.productId != null ) {

            this.productService
                    .updateProduct(this.productId, productData)
                    .then( () => {
                        this.isLoading = false;
                        this.uiManager.navigateTo('/restaurante');
                    });

        } else {

            this.productService
                    .addProduct(productData)
                    .then( () => {
                        this.isLoading = false;
                        this.uiManager.navigateTo('/restaurante');
                    });

        }

    }

    uploadFile(event) {
        this.isLoading = true;
        const file = event.target.files[0];
        const filePath = 'products/' + this.productId;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    this.downloadURL = fileRef.getDownloadURL();
                    this.updateImage();
                })
            )
            .subscribe();
    }

    updateImage() {
        this.downloadURL.subscribe(imageUrl => {
            this.isLoading = false;
            this.image = imageUrl;
        });
    }

}
