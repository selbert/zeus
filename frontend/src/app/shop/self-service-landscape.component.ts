import { Component, HostListener, OnDestroy } from '@angular/core';
import { generateOrderName, Invoice, InvoiceType } from 'app/shared/model/invoice.model';
import { clone, getProductByKey, PickupLocation, Product, SelfServiceConfiguration } from 'app/shared/model/product.model';
import { flash } from 'light-it-up';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { forkJoin, interval, Subscription } from 'rxjs';
import { CheckoutDialogService } from 'app/shop/checkout-dialog.service';
import { SUCCESS_FLASH_DURATION } from 'app/shop/checkout.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InvoiceService } from 'app/shared/service/invoice.service';
import { ShopService } from 'app/shop/shop.service';

const DEFAULT_COUNTDOWN_SECONDS = 300;
const DEFAULT_DIALOG_TIMEOUT_SECONDS = 6;
const DEFAULT_WEBSOCKET_RETRY_TIMEOUT = 5000;

@Component({
    selector: 'jhi-self-service-landscape',
    templateUrl: './self-service-landscape.component.html',
    styleUrls: ['self-service-landscape.component.scss']
})
export class SelfServiceLandscapeComponent implements OnDestroy {
    locations: PickupLocation[] = null;
    products: Product[] = null;
    config: SelfServiceConfiguration = null;
    qrCodeSize = 250;
    error: string;
    orders: Invoice[];
    memoPrefix: string;
    countdownSubscription: Subscription;
    countdownSeconds = DEFAULT_COUNTDOWN_SECONDS;

    constructor(
        private shopService: ShopService,
        private invoiceService: InvoiceService,
        private checkoutDialogService: CheckoutDialogService,
        private route: ActivatedRoute
    ) {
        this.route.paramMap.subscribe((value: ParamMap) => {
            this.memoPrefix = value.get('id');
            forkJoin(this.shopService.getFrontendConfig(), this.shopService.getConfiguration()).subscribe(results => {
                this.config = results[0].selfService;
                const allProducts = results[1].products;
                this.products = this.config.products.map(p => {
                    const overriddenProduct = getProductByKey(allProducts, p.productKey);
                    if (p.optionOverride && p.optionOverride.length > 0) {
                        overriddenProduct.options = p.optionOverride;
                    }
                    if (p.titleOverride) {
                        overriddenProduct.title = p.titleOverride;
                    }
                    return overriddenProduct;
                });
                this.locations = results[1].locations;
                this.startCountdown();
                this.setupInvoices();
                this.listenOnWebSocket();
            });
        });
    }

    listenOnWebSocket() {
        this.invoiceService.connect(() => {
            setTimeout(() => {
                this.listenOnWebSocket();
            }, DEFAULT_WEBSOCKET_RETRY_TIMEOUT);
        });
        this.invoiceService.subscribe();
        this.invoiceService.receive().subscribe(val => {
            const invoice = _.find(this.orders, ['referenceId', val.referenceId]);
            if (invoice && val.settled === true) {
                this.invoicePaid(invoice);
            }
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    onPageUnload($event) {
        this.ngOnDestroy();
    }

    ngOnDestroy() {
        if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
        }
        this.invoiceService.unsubscribe();
        this.invoiceService.disconnect();
    }

    startCountdown() {
        this.countdownSubscription = interval(1000).subscribe(() => {
            this.countdownSeconds -= 1;
            if (this.countdownSeconds <= 0) {
                this.setupInvoices();
                this.countdownSeconds = DEFAULT_COUNTDOWN_SECONDS;
            }
        });
    }

    getSelfServiceOrders(): Invoice[] {
        return this.config.products.map(item => ({
            orderName: generateOrderName(),
            pickupLocation: this.locations && this.locations.length > 0 ? this.locations[0].key : null,
            pickupDelayMinutes: 0,
            orderItems: [
                {
                    ...clone(getProductByKey(this.products, item.productKey)),
                    count: 1
                }
            ],
            invoiceType: InvoiceType.SELF_ORDER
        }));
    }

    setupInvoices() {
        this.orders = this.getSelfServiceOrders();
        this.orders.forEach((order, index) => {
            order.memoPrefix = this.memoPrefix;
            this.invoiceService.createInvoice(order).subscribe(
                (invoice: Invoice) => {
                    this.orders[index] = invoice;
                },
                err => (this.error = err.error.message)
            );
        });
    }

    invoicePaid(invoice: Invoice) {
        const index = this.orders.indexOf(invoice);
        flash({
            element: $('#flash-receiver')[0],
            colorFlash: '#3b7bbe',
            zIndex: 9999,
            duration: SUCCESS_FLASH_DURATION
        });
        setTimeout(() => {
            this.checkoutDialogService.openDialog(invoice, true, DEFAULT_DIALOG_TIMEOUT_SECONDS);
            if (index >= 0) {
                this.orders[index] = this.getSelfServiceOrders()[index];
                this.invoiceService.createInvoice(this.orders[index]).subscribe(
                    (newInvoice: Invoice) => {
                        this.orders[index] = newInvoice;
                    },
                    err => (this.error = err.error.message)
                );
            }
        }, SUCCESS_FLASH_DURATION);
    }

    getClasses(index) {
        let orientation = 'top';
        if (index > 1) {
            orientation = 'bottom';
        }
        if (index % 2 === 0) {
            orientation += '-left';
        } else {
            orientation += '-right';
        }
        return 'idx-' + index + ' ' + orientation;
    }
}
