import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Invoice } from 'app/shared/model/invoice.model';
import { InvoiceService } from 'app/shared/service/invoice.service';
import { SUCCESS_FLASH_DURATION } from 'app/shop/checkout.component';
import { flash } from 'light-it-up';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
    selector: 'jhi-donate',
    templateUrl: './donate.component.html',
    styleUrls: ['donate.component.scss']
})
export class DonateComponent {
    qrCodeSize = 250;
    amount = 100;
    error?: string;
    invoice?: Invoice;
    memoPrefix?: string;
    paid = false;

    constructor(private route: ActivatedRoute, private invoiceService: InvoiceService) {
        this.route.paramMap.subscribe((params: ParamMap) => (this.memoPrefix = params.get('id')));
        this.invoiceService.connect(() => console.log('error'));
        this.invoiceService.subscribe();
        this.invoiceService.receive().subscribe(invoice => {
            if (invoice && invoice.settled === true) {
                this.invoicePaid();
            }
        });
    }

    getInvoice() {
        const donation = {
            memoPrefix: this.memoPrefix,
            amount: this.amount
        };
        this.invoiceService.createDonation(donation).subscribe(invoice => {
            this.invoice = invoice;
        });
    }

    invoicePaid() {
        flash({
            element: $('#flash-receiver')[0],
            colorFlash: '#3b7bbe',
            zIndex: 9999,
            duration: SUCCESS_FLASH_DURATION
        });
        setTimeout(() => {
            this.paid = true;
            this.invoice = null;
        }, SUCCESS_FLASH_DURATION);
    }
}
