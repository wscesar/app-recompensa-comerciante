import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { Restaurant } from '../model/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {

    constructor(private db: AngularFirestore) {}

    updateRestaurant(restaurantId: string, restaurant: object) {
        return this.db.collection('restaurants').doc(restaurantId).update({...restaurant});
    }

    updateRestaurantImage(restaurantId: string, imageUrl: string) {
        return this.db.collection('restaurants').doc(restaurantId).update({image: imageUrl});
    }

    getRestaurant(restaurantId: string) {
        return this.db
                    .doc<Restaurant>('restaurants/' + restaurantId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data();
                            const id = doc.payload.id;
                            return { ...data, id};
                        })
                    );
    }

}
