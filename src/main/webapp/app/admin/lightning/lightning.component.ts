import { Component, OnInit } from '@angular/core';
import { LightningService } from 'app/admin/lightning/lightning.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import * as _ from 'lodash';

@Component({
    selector: 'jhi-lightning',
    templateUrl: './lightning.component.html'
})
export class JhiLightningComponent implements OnInit {
    info: any = null;
    channels = [];
    activeChannels = [];

    constructor(private jhiAlertService: JhiAlertService, private lightningService: LightningService) {}

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.lightningService.getInfo().subscribe(
            res => {
                this.info = res;
                this.channels = this.info.lndChannels;
                this.activeChannels = this.channels.filter(c => c.active);

                this.channels.forEach(c => {
                    this.lightningService.getNodeInfo(c.remote_pubkey).subscribe(info => (c.remote = info));
                });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    capitalize(key) {
        return _.startCase(key);
    }
}
