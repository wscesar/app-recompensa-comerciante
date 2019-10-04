import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
    constructor(private authService: AuthService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean> {
        let user = this.authService.getUserId()
        return !!user
    }
}
