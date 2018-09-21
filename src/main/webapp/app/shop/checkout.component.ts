import { Component, ElementRef, Renderer } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { flash } from 'light-it-up';
import { Invoice } from 'app/shared/model/invoice.model';
import { CheckoutService } from 'app/shop/checkout.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export const SUCCESS_FLASH_DURATION = 2000;

@Component({
    selector: 'jhi-checkout-modal',
    templateUrl: './checkout.component.html',
    styleUrls: ['checkout.component.scss']
})
export class JhiCheckoutModalComponent {
    public order: Invoice;

    checkoutError: string;
    showCloseButton = true;
    countDownInitial = 0;
    countDownValue = 0;
    availability = null;
    closed = false;

    constructor(
        private eventManager: JhiEventManager,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private checkoutService: CheckoutService,
        public activeModal: NgbActiveModal
    ) {
        this.checkoutService.getAvailability().subscribe(a => (this.availability = a), () => (this.closed = true));
    }

    close() {
        this.activeModal.close(this.order);
    }
}
