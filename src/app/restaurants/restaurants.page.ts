import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html'
})
export class RestaurantsPage implements OnInit {
    private restaurants: Restaurant[];
    private isLoading = true;

    constructor(
        private dbService: RestaurantService
    ) {}

    ngOnInit() {
        this.dbService.getRestaurants().subscribe(restaurants => {
            this.isLoading = false;
            this.restaurants = restaurants;
            console.log(restaurants);
        });
    }

}
