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
export class VoucherService {

    constructor(
        private uiManager: UiManagerService,
        private firebase: AngularFirestore,
        private authService: AuthService
    ) {}

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
                                const data: Voucher = doc.payload.doc.data();
                                const id = doc.payload.doc.id;
                                return {...data, id};
                            });
                        }),
                    );
    }

}
