import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZeusSharedModule } from 'app/shared';
import {
    adminState,
    AuditsComponent,
    JhiConfigurationComponent,
    JhiDocsComponent,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiMetricsMonitoringComponent,
    LogsComponent,
    UserMgmtComponent,
    UserMgmtDetailComponent,
    JhiHomeComponent,
    JhiInvoiceComponent,
    JhiInvoiceDetailComponent,
    JhiLightningComponent
} from './';

/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
    imports: [
        ZeusSharedModule,
        RouterModule.forChild(adminState)
        /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    ],
    declarations: [
        AuditsComponent,
        UserMgmtComponent,
        UserMgmtDetailComponent,
        LogsComponent,
        JhiConfigurationComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        JhiDocsComponent,
        JhiMetricsMonitoringComponent,
        JhiHomeComponent,
        JhiInvoiceComponent,
        JhiInvoiceDetailComponent,
        JhiLightningComponent
    ],
    entryComponents: [JhiHealthModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ZeusAdminModule {}
