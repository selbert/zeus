import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';
import 'tableexport';
import { Invoice, InvoiceType } from 'app/shared/model/invoice.model';
import { Account, AccountService } from 'app/core';
import { InvoiceService } from 'app/shared/service/invoice.service';

export const YEAR_MONTH = 'YYYYMM';

@Component({
    selector: 'jhi-invoice',
    templateUrl: './invoice.component.html'
})
export class JhiInvoiceComponent implements OnInit {
    invoices: Invoice[];
    currentAccount: any;
    filterMonth = null;
    filterType = null;
    filterUnsettled = true;
    months = [];
    types = [];

    @ViewChild('invoiceTable') invoiceTable: ElementRef;

    constructor(private invoiceService: InvoiceService, private jhiAlertService: JhiAlertService, private accountService: AccountService) {}

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then((account: Account) => {
            this.currentAccount = account;
        });
    }

    loadAll() {
        this.invoiceService.query().subscribe(
            (res: HttpResponse<Invoice[]>) => {
                this.invoices = _.orderBy(res.body, ['settled', 'creationDate'], ['desc', 'desc']);
                this.months = _(this.invoices)
                    .map('creationDate')
                    .map(d => moment(d).format(YEAR_MONTH))
                    .uniq()
                    .value()
                    .sort();
                this.types = _(this.invoices)
                    .map('invoiceType')
                    .uniq()
                    .value()
                    .sort();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    get filteredInvoices() {
        let result = _.clone(this.invoices);
        if (this.filterType) {
            result = _.filter(result, i => i.invoiceType === this.filterType);
        }
        if (this.filterUnsettled) {
            result = _.filter(result, i => i.settled);
        }
        if (this.filterMonth) {
            result = _.filter(result, i => moment(i.creationDate).format(YEAR_MONTH) === this.filterMonth);
        }
        return result;
    }

    get filteredTotal() {
        return _.sumBy(this.filteredInvoices, 'amountChf');
    }

    get filteredTotalSat() {
        return _.sumBy(this.filteredInvoices, 'amount');
    }

    get filteredAvgRate() {
        return _.sumBy(this.filteredInvoices, 'exchangeRate') / this.filteredInvoices.length;
    }

    trackId(index: number, item: Invoice) {
        return item.id;
    }

    numItems(invoice) {
        return _.sumBy(invoice.orderItems, i => i.count);
    }

    formatMonth(month) {
        return moment(month, YEAR_MONTH).format('MMMM YYYY');
    }

    formatType(type) {
        switch (type) {
            case InvoiceType.SELF_ORDER:
                return 'Self Order';
            case InvoiceType.DONATION:
                return 'Donation';
            case InvoiceType.BEER_TAP:
                return 'Beer Tap';
            default:
                return 'Web Shop';
        }
    }

    excelExport() {
        const table = $('#tableExport').tableExport({
            footers: false,
            formats: ['xlsx'],
            position: 'top',
            ignoreCols: [12],
            exportButtons: false
        });
        const data = table.getExportData().tableExport.xlsx;
        table.export2file(data.data, data.mimeType, data.filename, data.fileExtension);
        table.remove();
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
