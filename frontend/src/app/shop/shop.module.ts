import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { ZeusSharedModule } from 'app/shared';
import { JhiCheckoutModalComponent } from 'app/shop/checkout.component';
import { SelfServiceComponent } from 'app/shop/self-service.component';
import { SelfServiceLandscapeComponent } from 'app/shop/self-service-landscape.component';
import { ShopComponent } from 'app/shop/shop.component';

@NgModule({
    imports: [ZeusSharedModule, QRCodeModule],
    declarations: [SelfServiceComponent, SelfServiceLandscapeComponent, JhiCheckoutModalComponent, ShopComponent],
    entryComponents: [JhiCheckoutModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ZeusShopModule {}
