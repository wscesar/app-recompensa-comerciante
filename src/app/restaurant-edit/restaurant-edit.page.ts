import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UiManagerService } from '../services/ui-manager.service';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant } from '../model/restaurant.model';

@Component({
  selector: 'app-restaurant-edit',
  templateUrl: './restaurant-edit.page.html',
})
export class RestaurantEditPage implements OnInit {
    form: FormGroup;
    restaurantId: string;
    restaurant: Restaurant;
    hasAlternativeHours = false;
    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;
    week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

    constructor(
        private authService: AuthService,
        private uiManager: UiManagerService,
        private storage: AngularFireStorage,
        private restaurantService: RestaurantService,
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),

            weekDays: new FormControl(null, {
                updateOn: 'change',
            }),

            openAt: new FormControl(null, {
                updateOn: 'change',
            }),

            closeAt: new FormControl(null, {
                updateOn: 'change',
            }),

            alternativeHours: new FormGroup({

                weekDays: new FormControl(null, {
                    updateOn: 'change',
                }),

                openAt: new FormControl(null, {
                    updateOn: 'change',
                }),

                closeAt: new FormControl(null, {
                    updateOn: 'change',
                }),

            })

        });
    }

    ionViewWillEnter() {
        this.restaurantId = this.authService.getUserId();

        this.restaurantService
                .getRestaurant(this.restaurantId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.restaurant = res;

                        if ( !!res.hours[1] ) {
                            this.hasAlternativeHours = true;
                        }

                        this.form.patchValue({
                            title: res.title,
                            closeAt: res.hours[0].to,
                            openAt: res.hours[0].from,
                            weekDays: res.hours[0].days,
                            alternativeHours: {
                                closeAt: res.hours[1].to,
                                openAt: res.hours[1].from,
                                weekDays: res.hours[1].days,
                            }
                        });
                    }
                );
    }

    uploadFile(event) {
        const file = event.target.files[0];
        const filePath = 'restaurants/' + this.restaurantId;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.updateImage();
                    })
                )
                .subscribe();
    }

    updateImage() {
        this.downloadURL.subscribe(imageUrl => {
            this.restaurantService.updateRestaurantImage(this.restaurantId, imageUrl);
            this.restaurant.image = imageUrl;
        });
    }


    toggleAlternateHours() {
        if ( this.hasAlternativeHours ) {
            this.hasAlternativeHours = false;
        } else {
            this.hasAlternativeHours = true;
        }
    }

    onSubmit() {

        const openingHours = [];

        const hours = {
            from: this.form.value.openAt,
            to: this.form.value.closeAt,
            days: this.form.value.weekDays,
        };


        openingHours.push(hours);

        if ( this.hasAlternativeHours ) {
            const alternateHours = {
                from: this.form.value.alternativeHours.openAt,
                to: this.form.value.alternativeHours.closeAt,
                days: this.form.value.alternativeHours.weekDays,
            };

            openingHours.push(alternateHours);
        }

        const updatedData = {
            title: this.form.value.title,
            hours: openingHours
        };

        this.restaurantService
            .updateRestaurant(this.restaurantId, updatedData)
            .then(res => {
                this.uiManager.navigateTo('/restaurante');
            })
            .catch(err => (console.log(err)));
    }

  }
