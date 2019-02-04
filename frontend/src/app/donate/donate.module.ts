import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { ZeusSharedModule } from 'app/shared';
import { DonateComponent } from 'app/donate/donate.component';

@NgModule({
    imports: [ZeusSharedModule, QRCodeModule],
    declarations: [DonateComponent],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ZeusDonateModule {}
