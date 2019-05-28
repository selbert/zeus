import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiCheckoutModalComponent } from 'app/shop/checkout.component';
import { Invoice } from 'app/shared/model/invoice.model';
import { InvoiceService } from 'app/shared/service/invoice.service';

@Injectable({ providedIn: 'root' })
export class CheckoutDialogService {
    private isOpen = false;

    constructor(private modalService: NgbModal, private invoiceService: InvoiceService) {}

    openDialog(order: Invoice, paid = false, timeoutSeconds: number = null, beerTap = false): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.invoiceService.connect(() => null);
        const modalRef = this.modalService.open(JhiCheckoutModalComponent, { backdrop: 'static' });
        modalRef.componentInstance.order = order;

        if (timeoutSeconds !== null && timeoutSeconds > 0) {
            modalRef.componentInstance.showCloseButton = false;
            modalRef.componentInstance.countDownInitial = timeoutSeconds;
            modalRef.componentInstance.countDownValue = timeoutSeconds;
            const interval = setInterval(() => {
                modalRef.componentInstance.countDownValue -= 1;
                if (modalRef.componentInstance.countDownValue === 0) {
                    clearInterval(interval);
                    modalRef.close();
                }
            }, 1000);
        }

        if (paid) {
            modalRef.componentInstance.paid = true;
        }

        if (beerTap) {
            modalRef.componentInstance.beerTap = true;
        }

        modalRef.result.then(
            result => {
                this.isOpen = false;
                this.invoiceService.disconnect();
            },
            reason => {
                this.isOpen = false;
                this.invoiceService.disconnect();
            }
        );
        return modalRef;
    }
}
