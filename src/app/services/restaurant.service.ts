import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

import { Restaurant } from '../model/restaurant.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RestaurantService {

    constructor (
        private db: AngularFirestore,
        private authService: AuthService ) {}

    private uid = this.authService.getUserId();

    updateRestaurant(restaurant: Object) {
        return this.db.collection('restaurants').doc(this.uid).update({...restaurant})
    }

    updateRestaurantImage(imageUrl: string) { 
        return this.db.collection('restaurants').doc(this.uid).update({image: imageUrl})
    }

    getRestaurants() {
        return this.db
                    .collection<Restaurant[]>('restaurants')
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map((doc: DocumentChangeAction<any>) => {
                                const data: Restaurant = doc.payload.doc.data();
                                const id = doc.payload.doc.id;
                                return { ...data, id };
                            });
                        }),
                    );
    }

    getRestaurant(restaurantId: string) {
        return this.db
                    .doc<Restaurant>('restaurants/'+restaurantId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data()
                            const id = doc.payload.id;
                            const products = null
                            return { ...data, id, products };
                        })
                    );
    }

    

}
