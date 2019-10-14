import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
})
export class UserListPage implements OnInit {
    private users: User[];

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.getUsers().subscribe( res => {
            this.users = res;
        });
    }

    createVoucher() {

    }

}



/*

Bom dia Aurora, obrigado pelo contato

Durante a semana consigo atender após as 18h, entre as 12 e 13h
*/
