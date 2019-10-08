import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
})
export class AuthPage implements OnInit {

    loginForm: FormGroup;
    signUpForm: FormGroup;
    icon = 'eye';
    authMode = 'login';
    authMode02 = 'criar conta';
    inputType = 'password';
    errorMessage: string;

    constructor(
        private authService: AuthService
        ) {}

    ngOnInit() {

        this.loginForm = new FormGroup({

            email: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required, Validators.email]
            }),

            password: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required, Validators.minLength(8)]
            })

        });

        this.signUpForm = new FormGroup({

            name: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required, Validators.minLength(3)]
            }),

            email: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required, Validators.email]
            }),

            password: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required, Validators.minLength(8)]
            })

        });

    }


    onChangeMode() {
        if ( this.authMode === 'login' ) {
            this.authMode = 'criar conta';
            this.authMode02 = 'login';
        } else {
            this.authMode = 'login';
            this.authMode02 = 'criar conta';
        }
    }


    onTogglePassword() {
        if ( this.icon === 'eye-off' ) {
            this.icon = 'eye';
            this.inputType = 'password';
        } else {
            this.icon = 'eye-off';
            this.inputType = 'text';
        }
    }


    onGoogleLogin() {
        this.authService.googleLogin();
    }


    onFacebookLogin() {
        this.authService.facebookLogin();
    }


    onLogin() {
        this.authService.loginWithEmail(
            this.loginForm.value.email,
            this.loginForm.value.password
        );
    }

    onSignUp() {
        this.authService.createUser(
            this.signUpForm.value.name,
            this.signUpForm.value.email,
            this.signUpForm.value.password
        );
    }

}
