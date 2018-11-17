import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UserService } from 'app/core';

@Component({
    selector: 'jhi-user-mgmt-detail',
    templateUrl: './user-management-detail.component.html'
})
export class UserMgmtDetailComponent implements OnInit {
    user: User;
    oldPassword = '';
    password = '';
    password2 = '';
    passwordError?: string = null;
    passwordOk = false;

    constructor(private route: ActivatedRoute, private userService: UserService) {}

    ngOnInit() {
        this.route.data.subscribe(({ user }) => {
            this.user = user.body ? user.body : user;
        });
    }

    changePassword(): void {
        this.passwordError = null;
        this.passwordOk = false;
        if (!this.password || !this.password2 || this.password.length < 4) {
            this.passwordError = 'New password must be at least 4 characters long.';
            return;
        }
        if (this.password !== this.password2) {
            this.passwordError = "Passwords don't match.";
            return;
        }
        this.userService.changePassword({ oldPassword: this.oldPassword, newPassword: this.password }).subscribe(
            () => {
                this.oldPassword = '';
                this.password = '';
                this.password2 = '';
                this.passwordOk = true;
            },
            error => {
                this.passwordError = 'Error changing password: ' + error.error.title;
            }
        );
    }
}
