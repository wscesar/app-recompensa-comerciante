import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
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
        this.productId =  this.route.snapshot.paramMap.get('productId');
        this.restaurantId = this.authService.getUserId();

        this.form = new FormGroup({
            
            product: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),

            // image: new FormControl(null, {
            //     updateOn: 'blur',
            //     validators: [Validators.required]
            // }),

            price: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),

        });
    }

    
    onSubmit() {

        this.uiManager.showLoading();

        const newProduct = new Product (
            this.form.value.product,
            +this.form.value.price,
            this.image,
            this.restaurantId
        );

        console.log(newProduct)

        this.productService
                .addProduct(newProduct)
                .then( () => {
                    this.uiManager.hideProgressBar();
                    this.uiManager.navigateTo('/restaurantes');
                });

    }

    uploadFile(event) {
        const file = event.target.files[0];
        const filePath = 'restaurants/'+this.authService.getUserId();
        const fileRef = this.storage.ref(filePath);

        // const task = fileRef.put(file);
        // const task = fileRef.putString(file);
        const task = this.storage.upload(filePath, file);

        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        
        // get notified when the download URL is available
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
