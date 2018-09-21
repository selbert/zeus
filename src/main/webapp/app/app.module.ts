import './vendor.ts';

import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService, Ng2Webstorage, SessionStorageService } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { LnPosSharedModule } from 'app/shared';
import { LnPosCoreModule } from 'app/core';
import { LnPosAppRoutingModule } from './app-routing.module';
import { LnPosShopModule } from 'app/shop/shop.module';
import { LnPosAdminModule } from 'app/admin/admin.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { ErrorComponent, FooterComponent, JhiAdminComponent, JhiShopComponent, NavbarComponent, PageRibbonComponent } from './layouts';
import { AppComponent } from 'app/app.component';

@NgModule({
    imports: [
        BrowserModule,
        LnPosAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        LnPosSharedModule,
        LnPosCoreModule,
        LnPosShopModule,
        LnPosAdminModule
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
            multi: true,
            deps: [LocalStorageService, SessionStorageService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [Injector]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [JhiEventManager]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [Injector]
        }
    ],
    bootstrap: [AppComponent]
})
export class LnPosAppModule {}
