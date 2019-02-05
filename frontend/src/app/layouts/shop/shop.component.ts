import { Component } from '@angular/core';
import { CheckoutService } from 'app/shop/checkout.service';

@Component({
    selector: 'jhi-shop',
    templateUrl: './shop.component.html'
})
export class JhiShopComponent {
    closed = false;

    constructor(private checkoutService: CheckoutService) {
        this.checkoutService.getAvailability().subscribe(() => null, () => (this.closed = true));
    }
}
