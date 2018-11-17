import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { LnPosSharedModule } from 'app/shared';
import { DonateComponent } from 'app/donate/donate.component';

@NgModule({
    imports: [LnPosSharedModule, QRCodeModule],
    declarations: [DonateComponent],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LnPosDonateModule {}
