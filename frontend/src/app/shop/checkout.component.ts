import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { flash } from 'light-it-up';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs/internal/operators';
import { Invoice } from 'app/shared/model/invoice.model';
import { CheckoutService } from 'app/shop/checkout.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from 'app/shop/shop.service';
import { getSummaryItem, PickupLocation, Product } from 'app/shared/model/product.model';
import { InvoiceService } from 'app/shared/service/invoice.service';

export const SUCCESS_FLASH_DURATION = 2000;

@Component({
    selector: 'jhi-checkout-modal',
    templateUrl: './checkout.component.html',
    styleUrls: ['checkout.component.scss']
})
export class JhiCheckoutModalComponent implements AfterViewInit {
    public order: Invoice;

    products: Product[] = null;
    locations: PickupLocation[] = null;
    allowPickupDelay = false;
    loading: boolean;
    checkoutError: string;
    touched: boolean;
    pickup = '';
    time = 'now';
    later = 30;
    paid = false;
    showCloseButton = true;
    countDownInitial = 0;
    countDownValue = 0;
    availability = null;
    closed = false;
    beerTap = false;

    @ViewChild('name') nameField: ElementRef;

    constructor(
        private eventManager: JhiEventManager,
        private elementRef: ElementRef,
        private checkoutService: CheckoutService,
        private invoiceService: InvoiceService,
        private shopService: ShopService,
        public activeModal: NgbActiveModal,
        public sanitizer: DomSanitizer
    ) {
        this.checkoutService.getAvailability().subscribe(a => (this.availability = a), () => (this.closed = true));
        this.shopService.getConfiguration().subscribe(c => {
            this.locations = c.locations;
            this.pickup = c.locations && c.locations.length > 0 ? c.locations[0].key : null;
            this.allowPickupDelay = c.allowPickupDelay;
            this.products = c.products;
        });
    }

    ngAfterViewInit() {
        if (!this.paid) {
            setTimeout(() => this.nameField.nativeElement.focus(), 0);
        }
    }

    get valid() {
        return this.order && this.order.orderName && this.order.orderName.replace(/\s*/g, '').length > 2;
    }

    get paymentLink() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`lightning:${this.order.paymentRequest}`);
    }

    checkout() {
        this.loading = true;
        this.checkoutError = null;
        const fullOrder = Object.assign({}, this.order, {
            pickupLocation: this.pickup,
            pickupDelayMinutes: this.time === 'now' ? 0 : this.later
        });
        this.invoiceService
            .createInvoice(fullOrder)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(
                (invoice: Invoice) => {
                    this.order = invoice;
                    this.invoiceService.subscribe();
                    this.invoiceService.receive().subscribe(val => {
                        if (val.referenceId === this.order.referenceId && val.settled === true) {
                            this.invoicePaid();
                        }
                    });
                },
                err => (this.checkoutError = err.error.message || err.error.title)
            );
    }

    getSummary() {
        if (this.products == null) {
            return;
        }
        return _.flatMap(this.order.orderItems, item => item.options.map(opt => getSummaryItem(this.products, item.productKey, opt)));
    }

    getTotal() {
        return _.sumBy(this.getSummary(), 'price');
    }

    delayAsTime(delay) {
        return moment()
            .add(delay, 'minutes')
            .format('HH:mm');
    }

    invoicePaid() {
        flash({
            element: $('.modal-content')[0],
            colorFlash: '#6cb02c',
            zIndex: 9999,
            duration: SUCCESS_FLASH_DURATION
        });
        setTimeout(() => {
            this.paid = true;
        }, SUCCESS_FLASH_DURATION);
    }

    close() {
        this.activeModal.close(this.order);
    }
}
