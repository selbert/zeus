import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { ZeusSharedModule } from 'app/shared';
import { JhiCheckoutModalComponent } from 'app/shop/checkout.component';
import { SelfServiceComponent } from 'app/shop/self-service.component';
import { BeerTapComponent } from 'app/shop/beer-tap.component';
import { ShopComponent } from 'app/shop/shop.component';

@NgModule({
    imports: [ZeusSharedModule, QRCodeModule],
    declarations: [SelfServiceComponent, BeerTapComponent, JhiCheckoutModalComponent, ShopComponent],
    entryComponents: [JhiCheckoutModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ZeusShopModule {}
