import { Component } from '@angular/core';
import * as _ from 'lodash';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutDialogService } from 'app/shop/checkout-dialog.service';
import { ShopService } from 'app/shop/shop.service';
import { Product } from 'app/shared/model/product.model';
import { Invoice, InvoiceType } from 'app/shared/model/invoice.model';

@Component({
    selector: 'jhi-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['shop.component.scss']
})
export class ShopComponent {
    modalRef: NgbModalRef;
    products: Product[] = [];
    order: Invoice = {
        invoiceType: InvoiceType.WEB_SHOP,
        orderItems: []
    };
    closed = false;

    constructor(private shopService: ShopService, private checkoutDialogService: CheckoutDialogService) {
        this.shopService.getConfiguration().subscribe(configuration => {
            this.products = configuration.products;
            this.products.forEach(p => (p.cart = []));
        });
        this.shopService.getAvailability().subscribe(() => null, () => (this.closed = true));
    }

    add(product) {
        product.cart.push({ selection: product.options[0] });
    }

    remove(item, product) {
        product.cart.splice(product.cart.indexOf(item), 1);
    }

    checkout() {
        this.order.orderItems = _.chain(this.products)
            .filter(p => p.cart.length > 0)
            .flatMap(p => ({
                productKey: p.productKey,
                count: p.cart.length,
                options: p.cart.map(c => c.selection)
            }))
            .value();
        this.modalRef = this.checkoutDialogService.openDialog(this.order);
        this.modalRef.result.then(() => this.onFinished());
    }

    onFinished() {
        this.products.forEach(p => (p.cart = []));
        this.order = {
            invoiceType: InvoiceType.WEB_SHOP,
            orderItems: []
        };
    }

    get hasCart() {
        return this.products && this.products.filter(p => p.cart.length > 0).length;
    }

    get cartItems() {
        return _.flatMap(this.products, p => p.cart).length;
    }

    get cartTotal() {
        return _.sumBy(this.products, p => p.cart.length * p.price);
    }
}
