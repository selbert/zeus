import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiCheckoutModalComponent } from 'app/shop/checkout.component';
import { Invoice } from 'app/shared/model/invoice.model';
import { CheckoutService } from 'app/shop/checkout.service';

@Injectable({ providedIn: 'root' })
export class CheckoutDialogService {
    private isOpen = false;

    constructor(private modalService: NgbModal, private checkoutService: CheckoutService) {}

    openDialog(order: Invoice, paid = false, timeoutSeconds: number = null): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.checkoutService.connect(() => null);
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

        modalRef.result.then(
            result => {
                this.isOpen = false;
                this.checkoutService.disconnect();
            },
            reason => {
                this.isOpen = false;
                this.checkoutService.disconnect();
            }
        );
        return modalRef;
    }
}
