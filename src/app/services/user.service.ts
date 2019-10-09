import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

// import { AuthService } from './auth.service';
// import { User } from '../model/user.model';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { UiManagerService } from './ui-manager.service';

export class User {
    constructor(
        public name: string,
        public image: string,
        public score: number,
        public id?: string,
    ) {}
}

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        // private uiManager: UiManagerService,
        // private firebaseAuth: AngularFireAuth,
        // private authService: AuthService,
        private firebase: AngularFirestore) {}

    getUser(userId: string) {
        return this.firebase
                    .doc<User>('users/' + userId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data();
                            const id = doc.payload.id;
                            return { ...data, id  };
                        })
                    );
    }

}
