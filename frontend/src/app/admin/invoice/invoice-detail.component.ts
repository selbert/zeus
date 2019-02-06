import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Invoice } from 'app/shared/model/invoice.model';
import { getSummaryItem, Product } from 'app/shared/model/product.model';
import { ShopService } from 'app/shop/shop.service';

@Component({
    selector: 'jhi-invoice-detail',
    templateUrl: './invoice-detail.component.html'
})
export class JhiInvoiceDetailComponent implements OnInit {
    products: Product[] = null;
    invoice: Invoice;

    constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute) {
        this.shopService.getConfiguration().subscribe(configuration => (this.products = configuration.products));
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ invoice }) => {
            this.invoice = invoice;
        });
    }

    previousState() {
        window.history.back();
    }

    getSummary() {
        if (this.products == null) {
            return;
        }
        return _.flatMap(this.invoice.orderItems, item => item.options.map(opt => getSummaryItem(this.products, item.productKey, opt)));
    }

    numItems(invoice) {
        return _.sumBy(invoice.orderItems, i => i.count);
    }
}
