import { Component, HostListener, OnDestroy } from '@angular/core';
import { Invoice } from 'app/shared/model/invoice.model';
import { BeerTapConfiguration, BeerTapProduct } from 'app/shared/model/product.model';
import { flash } from 'light-it-up';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { interval, Subscription } from 'rxjs';
import { CheckoutDialogService } from 'app/shop/checkout-dialog.service';
import { SUCCESS_FLASH_DURATION } from 'app/shop/checkout.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InvoiceService } from 'app/shared/service/invoice.service';
import { ShopService } from 'app/shop/shop.service';

const DEFAULT_COUNTDOWN_SECONDS = 300;
const DEFAULT_BEER_DIALOG_TIMEOUT_SECONDS = 2;
const DEFAULT_WEBSOCKET_RETRY_TIMEOUT = 5000;

@Component({
    selector: 'jhi-beer-tap',
    templateUrl: './beer-tap.component.html',
    styleUrls: ['beer-tap.component.scss']
})
export class BeerTapComponent implements OnDestroy {
    tapId: string;
    products: BeerTapProduct[] = null;
    config: BeerTapConfiguration = null;
    qrCodeSize = 250;
    error: string;
    orders: Invoice[];
    countdownSubscription: Subscription;
    countdownSeconds = DEFAULT_COUNTDOWN_SECONDS;

    constructor(
        private shopService: ShopService,
        private invoiceService: InvoiceService,
        private checkoutDialogService: CheckoutDialogService,
        private route: ActivatedRoute
    ) {
        this.route.paramMap.subscribe((value: ParamMap) => {
            this.tapId = value.get('id');
            this.shopService.getFrontendConfig().subscribe(config => {
                this.config = config[this.tapId] as BeerTapConfiguration;
                this.products = this.config.products;
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

    getBeerTapInvoices(): Invoice[] {
        return this.config.products.map(item => ({
            orderName: this.config.orderName,
            amount: item.amount,
            amountInSats: item.amountInSats,
            memoPrefix: this.tapId,
            orderItems: [
                {
                    productKey: item.productKey,
                    options: [item.subtitle],
                    count: 1
                }
            ]
        }));
    }

    setupInvoices() {
        this.orders = this.getBeerTapInvoices();
        this.orders.forEach((order, index) => {
            this.invoiceService.createBeerTapInvoice(order).subscribe(
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
            element: $('#flash-receiver-' + index)[0],
            colorFlash: '#3b7bbe',
            zIndex: 9999,
            duration: SUCCESS_FLASH_DURATION
        });
        setTimeout(() => {
            // if there are more than one tap, don't show dialog so multiple
            // beers can be paid at the same time.
            if (this.config.products.length === 1) {
                this.checkoutDialogService.openDialog(invoice, true, DEFAULT_BEER_DIALOG_TIMEOUT_SECONDS, true);
            }

            if (index >= 0) {
                this.orders[index] = this.getBeerTapInvoices()[index];
                this.invoiceService.createBeerTapInvoice(this.orders[index]).subscribe(
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
