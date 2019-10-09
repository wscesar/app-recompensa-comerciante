import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Product } from '../model/product.model';
import { AuthService } from './auth.service';
import { UiManagerService } from './ui-manager.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(
        private uiManager: UiManagerService,
        private firebase: AngularFirestore,
        private authService: AuthService ) {}


    getProducts(restaurantId: string) {
        return this.firebase
                    .collection('products', ref => ref.where('restaurantId', '==', restaurantId))
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map( ( doc: DocumentChangeAction<any> ) => {
                                const data: Product = doc.payload.doc.data();
                                const id = doc.payload.doc.id;
                                return {...data, id};
                            });
                        }),
                    );
    }


    getProduct(productId: string) {
        return this.firebase
                    .doc<Product>('products/' + productId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data();
                            const id = doc.payload.id;
                            return { ...data, id };
                        })
                    );
    }


    addProduct(product: Product) {
        return this.firebase.collection('products').add({...product});
        // return this.firebase.collection('restaurants/' + '/products').add({...product});
    }


    updateProductImage(productId: string, imageUrl: string) {
        return this.firebase.collection('products').doc(productId).update({image: imageUrl});
    }


    updateProduct(productId: string, product: Product) {
        return this.firebase
                    .doc('/products/' + productId)
                    .update({...product});
    }


    deleteProduct(productId: string) {
        return this.firebase
                    .doc('/products/' + productId)
                    .delete();
    }


    // updatePromo(productId: string, product: Product) {
    //     return this.firebase
    //                 .doc('/products/' + productId + 'promo')
    //                 .update({...product});
    // }


}
