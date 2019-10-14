import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-set-score',
  templateUrl: './user-set-score.page.html',
})
export class UserSetScorePage implements OnInit {

    private user: User;
    private form: FormGroup;
    private currentScore = 0;
    private restaurantId: string = this.authService.getUserId();
    private userId: string = this.route.snapshot.paramMap.get('userId');

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private userService: UserService,
    ) {}

    ngOnInit() {

        this.userService
            .getUser(this.userId)
            .subscribe( res => {
                this.user = res;
            });

        this.userService
            .getUserScore(this.restaurantId, this.userId)
            .subscribe(res => {
                if (res !== undefined) {
                    this.currentScore = res.score;
                }
            });

        this.form = new FormGroup({
            score: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),
        });

    }

    onSubmit() {
        const newScore = this.currentScore + this.form.value.score;
        this.userService.addUserScore(this.restaurantId, this.userId, {score: newScore});
    }

}
