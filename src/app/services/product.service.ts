import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

import { Product } from '../model/product.model';
import { AuthService } from './auth.service';
import { UiManagerService } from './ui-manager.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor (
        private uiManager: UiManagerService,
        private db: AngularFirestore,
        private authService: AuthService ) {}

    // updateProductImage(productId: string, imageUrl: string) { 
    //     return this.db.collection('products').doc(productId).update({image: imageUrl})
    // }

    getAllProducts() {
        return this.db
                    .collection('products')
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

    getProducts(restaurantId: string) {
        return this.db
                    .collection('products', ref => ref.where('id', '==', restaurantId))
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
        return this.db
                    .doc<Product>('products/'+productId)
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

    addProduct(product: Product) {
        console.log(product)
        return this.db.collection('products').add({...product})
    }

    updateProduct(productId: string, product: Product) {
        return this.db
                    .doc(`/products/${productId}`)
                    .set(product)
    }

    deleteProduct(productId: string) {
        return this.db
                    .doc(`/products/${productId}`)
                    .delete()
    }

  
}
