import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { ZeusSharedModule } from 'app/shared';
import { ZeusCoreModule } from 'app/core';
import { ZeusAppRoutingModule } from './app-routing.module';
import { ZeusShopModule } from 'app/shop/shop.module';
import { ZeusAdminModule } from 'app/admin/admin.module';
import * as moment from 'moment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { ErrorComponent, FooterComponent, JhiAdminComponent, JhiShopComponent, NavbarComponent, PageRibbonComponent } from './layouts';
import { AppComponent } from 'app/app.component';
import { ZeusDonateModule } from 'app/donate/donate.module';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        BrowserModule,
        ZeusAppRoutingModule,
        NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            alertTimeout: 5000
        }),
        ZeusSharedModule.forRoot(),
        ZeusCoreModule,
        ZeusShopModule,
        ZeusDonateModule,
        ZeusAdminModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiAdminComponent,
        JhiShopComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
        AppComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class ZeusAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
