import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { UiManagerService } from '../services/ui-manager.service';
import { RestaurantService } from '../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-edit',
  templateUrl: './restaurant-edit.page.html',
})
export class RestaurantEditPage implements OnInit {
    form: FormGroup;
    title: string;
    image: string = null;
    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;

    dataSubscription: Subscription;
    restaurantId: string;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private uploadService: UploadService,
        private uiManager: UiManagerService,
        private storage: AngularFireStorage,
        private restaurantService: RestaurantService,
    ) {}

    ngOnInit() {
        this.setForm(null);
    }

    ionViewWillEnter() {
        this.setForm(null);
        this.restaurantId = this.authService.getUserId();

        console.log(this.restaurantId);

        this.restaurantService
                .getRestaurant(this.restaurantId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.image = res.image;
                        this.title =  res.title;
                        this.setForm(this.title);
                    }
                );
    }

    uploadFile(event) {
        const file = event.target.files[0];
        const filePath = 'restaurants/' + this.restaurantId;
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
            this.restaurantService.updateRestaurantImage(this.restaurantId, imageUrl);
            this.image = imageUrl;
        });
    }

    setForm( title: string ) {
        this.form = new FormGroup({
            title: new FormControl(title, {
                updateOn: 'blur',
                validators: [Validators.required]
            })
        });
    }

    onSubmit() {
        const updatedData = {
            title: this.form.value.title
        };

        this.restaurantService
            .updateRestaurant(this.restaurantId, updatedData)
            .then(res => {
                this.uiManager.navigateTo('/restaurante');
            })
            .catch(err => (console.log(err)));
    }

  }
