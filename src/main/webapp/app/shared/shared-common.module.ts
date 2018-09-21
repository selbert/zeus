import { NgModule } from '@angular/core';

import { LnPosSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [LnPosSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [LnPosSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class LnPosSharedCommonModule {}
