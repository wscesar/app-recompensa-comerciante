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

    uploadFile(event, filePath: string): Observable<any> {
        const file = event.target.files[0];
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        // observe percentage changes
        // this.uploadPercent = task.percentageChanges();

        return task
                .snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                    })
                );
    }

}
