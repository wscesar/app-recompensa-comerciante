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
    today: string = new Date().toISOString().substring(0, 10);
    startDate = this.today;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private uiManager: UiManagerService,
        private storage: AngularFireStorage,
        private uploadService: UploadService,
        private productService: ProductService,
    ) {}

    ngOnInit() {

        this.form = new FormGroup({

            product: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            // image: new FormControl(null, {
            //     updateOn: 'change',
            //     validators: [Validators.required]
            // }),

            price: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            startDate: new FormControl(this.today, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            endDate: new FormControl(this.today, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

        });

    }

    ionViewWillEnter() {
        setTimeout( () => {
            this.form.patchValue({startDate: this.today});
            this.form.patchValue({endDate: this.today});
        }, 1000);

        this.productId =  this.route.snapshot.paramMap.get('productId');
        this.restaurantId = this.authService.getUserId();

        this.productService
                .getProduct(this.restaurantId, this.productId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.isLoading = false;
                        this.image = res.image;
                        this.form.patchValue({
                            product: res.title,
                            // image: res.image,
                            price: res.price,
                            startDate: res.startDate,
                            endDate: res.endDate
                        });
                    });
    }

    onStartDateChange() {
        const startDate = new Date(this.form.value.startDate).toISOString().substring(0, 10);
        const endDate = new Date(this.form.value.endDate).toISOString().substring(0, 10);

        this.startDate = startDate;

        if (startDate > endDate) {
            this.form.patchValue({endDate: startDate});
        }
    }

    onSubmit() {
        this.isLoading = true;

        const productData = new Product (
            this.form.value.product,
            +this.form.value.price,
            this.image,
            this.restaurantId,
            +this.form.value.price * 0.5,
            new Date(this.form.value.startDate).toISOString(),
            new Date(this.form.value.endDate).toISOString(),
        );

        if ( this.productId != null ) {

            this.productService
                    .updateProduct(this.restaurantId, this.productId, productData)
                    .then( () => {
                        this.isLoading = false;
                        this.uiManager.navigateTo('/restaurante');
                    })
                    .catch( err => console.log(err) );

        } else {

            this.productService
                    .addProduct(this.restaurantId, productData)
                    .then( () => {
                        this.isLoading = false;
                        this.uiManager.navigateTo('/restaurante');
                    })
                    .catch( err => {
                        this.isLoading = false;
                        console.log(err);
                    });

        }

    }

    uploadFile(event) {
        this.isLoading = true;
        const file = event.target.files[0];
        const filePath = 'products/' + this.productId; // + new Date().toISOString;
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
            // this.productService.updateProductImage(this.productId, imageUrl);
            this.form.patchValue({image: imageUrl});
            this.isLoading = false;
            this.image = imageUrl;
        });
    }

}
