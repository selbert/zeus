import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Account, LoginModalService, Principal } from 'app/core';
import { HomeService } from 'app/admin/home/home.service';

export const KEY_SHOP_ACTIVE = 'shop.active';
export const KEY_SHOP_OVERRIDE = 'shop.override';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html'
})
export class JhiHomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    shopActiveConfig: any;
    shopOverrideConfig: any;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private homeService: HomeService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.loadConfig();
    }

    loadConfig() {
        this.homeService.getConfiguration(KEY_SHOP_ACTIVE).subscribe(config => (this.shopActiveConfig = config));
        this.homeService.getConfiguration(KEY_SHOP_OVERRIDE).subscribe(config => (this.shopOverrideConfig = config));
    }

    setShopActive(val) {
        this.homeService.setConfiguration(KEY_SHOP_ACTIVE, `${val}`).subscribe(() => this.loadConfig());
    }

    setShopOverride(val) {
        this.homeService.setConfiguration(KEY_SHOP_OVERRIDE, `${val}`).subscribe(() => this.loadConfig());
    }

    restartShop() {
        this.homeService.restart().subscribe();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
            this.loadConfig();
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
