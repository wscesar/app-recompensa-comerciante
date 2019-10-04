import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { UiManagerService } from '../services/ui-manager.service';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
})
export class ProfileEditPage implements OnInit {
    form: FormGroup;
    title: string;
    image: string = null;
    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;

    dataSubscription: Subscription;

    constructor (
        private authService: AuthService,
        private uiManager: UiManagerService,
        private storage: AngularFireStorage,
        private uploadService: UploadService,
        private restaurantService: RestaurantService,
    ) {}

    ngOnInit() {
        this.setForm(null);

        let restaurantId =  this.authService.getUserId();

        this.dataSubscription = 
        this.restaurantService
                .getRestaurant(restaurantId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.image = res.image
                        console.log(res.image)
                        this.title =  res.title
                        this.setForm(this.title);
                    }
                )
    }

    uploadFile(event) {
        // this.dataSubscription.unsubscribe();

        const file = event.target.files[0];
        const filePath = 'restaurants/'+this.authService.getUserId();
        const fileRef = this.storage.ref(filePath);


        const task = this.storage.upload(filePath, file);
        // this.uploadPercent = task.percentageChanges();
        task.snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.updateImage();
                    })
                )
                .subscribe()
    }

    updateImage() {
        this.downloadURL.subscribe(imageUrl => {
            this.restaurantService.updateRestaurantImage(imageUrl);
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
        }

        this.restaurantService
            .updateRestaurant(updatedData)
            .then(res => {
                this.uiManager.navigateTo('/restaurantes')
            })
            .catch(err => (console.log(err)))
    }
    
  }
  