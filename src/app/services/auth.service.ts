import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UiManagerService } from './ui-manager.service';
import { RestaurantService } from './restaurant.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private userId: string

    constructor(
        private firebase: AngularFirestore,
        private firebaseAuth: AngularFireAuth,
        private uiManager: UiManagerService) {}

    getUserId() {
        return this.userId;
    }

    logout() {
        this.firebaseAuth.auth.signOut();
        this.uiManager.navigateTo('/login')
    }

    googleLogin() {
        this.firebaseAuth.auth
                .signInWithPopup(new auth.GoogleAuthProvider())
                .then( res => {
                    console.log(res)
                    this.userId = res.user.uid;
                    this.uiManager.navigateTo('/produtos');
                })
                .catch(err => {
                    console.log(err);
                })
    }

    facebookLogin() {
        this.firebaseAuth.auth
                .signInWithPopup(new auth.FacebookAuthProvider())
                .then( res => {
                    console.log(res)
                    this.userId = res.user.uid;
                    this.uiManager.navigateTo('/produtos');
                })
                .catch(err => {
                    console.log(err);
                })
    }

    loginWithEmail(email: string, password: string) {
        this.firebaseAuth.auth
                .signInWithEmailAndPassword(email, password)
                .then( res => {
                    this.userId = res.user.uid;
                    this.uiManager.navigateTo('/produtos');
                })
                .catch(err => {
                    this.uiManager.alert('Erro', err.code);
                })
    } 
    
    createUser(name: string, email: string, password: string) {
        this.firebaseAuth.auth
                .createUserWithEmailAndPassword(email, password)
                .then( res => {
                    this.userId = res.user.uid;
                    this.firebase.collection('restaurants').doc(res.user.uid).set({name: name, email: email});
                    this.uiManager.navigateTo('/restaurante/editar');
                })
                .catch(err => {
                    this.uiManager.alert('Erro', err.code);
                })
    }
}
