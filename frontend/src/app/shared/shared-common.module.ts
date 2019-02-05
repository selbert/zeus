import { NgModule } from '@angular/core';

import { ZeusSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [ZeusSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [ZeusSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class ZeusSharedCommonModule {}
