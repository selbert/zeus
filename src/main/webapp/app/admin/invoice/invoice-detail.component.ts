import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Invoice } from 'app/shared/model/invoice.model';
import { getPriceByType, getTitleByType } from 'app/shared/model/products.model';

@Component({
    selector: 'jhi-invoice-detail',
    templateUrl: './invoice-detail.component.html'
})
export class JhiInvoiceDetailComponent implements OnInit {
    invoice: Invoice;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ invoice }) => {
            this.invoice = invoice;
        });
    }

    previousState() {
        window.history.back();
    }

    getSummary() {
        return _.flatMap(this.invoice.orderItems, item => {
            return item.options.map(opt => ({
                text: `${getTitleByType(item.itemType)} ${opt}`,
                price: getPriceByType(item.itemType)
            }));
        });
    }

    numItems(invoice) {
        return _.sumBy(invoice.orderItems, i => i.count);
    }
}
