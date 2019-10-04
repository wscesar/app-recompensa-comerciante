import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { RestaurantService } from './restaurant.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

    constructor(
        private authService: AuthService,
        private storage: AngularFireStorage,
        private restaurantService: RestaurantService,
    ) { }

    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;

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
        return task.snapshotChanges()
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
            this.restaurantService.updateRestaurantImage(imageUrl)
            return imageUrl
        });
    }

    // updateImageUrl() {
    //     this.downloadURL.subscribe(imageUrl => {
    //         this.restaurantService.updateRestaurantImage(imageUrl)
    //         this.image = imageUrl
    //     });
    // }

}