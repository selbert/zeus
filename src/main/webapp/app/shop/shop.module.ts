import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { LnPosSharedModule } from 'app/shared';
import { JhiCheckoutModalComponent } from 'app/shop/checkout.component';
import { SelfServiceComponent } from 'app/shop/self-service.component';
import { SelfServiceLandscapeComponent } from 'app/shop/self-service-landscape.component';

@NgModule({
    imports: [LnPosSharedModule, QRCodeModule],
    declarations: [SelfServiceComponent, SelfServiceLandscapeComponent, JhiCheckoutModalComponent],
    entryComponents: [JhiCheckoutModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LnPosShopModule {}
