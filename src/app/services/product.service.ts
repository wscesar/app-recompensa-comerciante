import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Product } from '../model/product.model';
import { AuthService } from './auth.service';
import { UiManagerService } from './ui-manager.service';
import { Voucher } from '../model/voucher.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(
        private uiManager: UiManagerService,
        private firebase: AngularFirestore,
        private authService: AuthService ) {}

    validateVoucher(voucherId: string) {
        return this.firebase
                    .doc('/vouchers/' + voucherId)
                    .update({validate: true});
    }

    getVouchers(restaurantId: string) {
        return this.firebase
                    .collection('vouchers', ref => ref.where('restaurantId', '==', restaurantId))
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map( ( doc: DocumentChangeAction<any> ) => {
                                // return doc.payload.doc.data();
                                const data: Voucher = doc.payload.doc.data();
                                const id = doc.payload.doc.id;
                                return {...data, id};
                            });
                        }),
                    );
    }

    getProducts(restaurantId: string) {
        return this.firebase
                    // .collection('restaurants/' + restaurantId + '/products')
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


    getProduct(restaurantId: string, productId: string) {
        return this.firebase
                    .doc<Product>('products/' + productId)
                    // .doc<Product>('restaurants/' + restaurantId + '/products/' + productId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data();
                            const id = doc.payload.id;
                            return { ...data, id };
                        })
                    );
    }


    addProduct(restaurantId: string, product: Product) {
        return this.firebase
                        // .collection('products')
                        .collection('restaurants/' + restaurantId + '/products')
                        .add({...product});
    }


    updateProductImage(productId: string, imageUrl: string) {
        return this.firebase.collection('products').doc(productId).update({image: imageUrl});
    }


    updateProduct(restaurantId: string, productId: string, product: Product) {
        return this.firebase
                    // .doc('/products/' + productId)
                    .doc('restaurants/' + restaurantId + '/products/' + productId)
                    .update({...product});
                    // .set({...product});
    }


    deleteProduct(productId: string) {
        return this.firebase
                    .doc('/products/' + productId)
                    .delete();
    }

}
