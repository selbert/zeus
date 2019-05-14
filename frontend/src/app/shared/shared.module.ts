import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HasAnyAuthorityDirective, JhiLoginModalComponent, ZeusSharedCommonModule, ZeusSharedLibsModule } from './';

@NgModule({
    imports: [ZeusSharedLibsModule, ZeusSharedCommonModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
    entryComponents: [JhiLoginModalComponent],
    exports: [ZeusSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ZeusSharedModule {
    static forRoot() {
        return {
            ngModule: ZeusSharedModule
        };
    }
}
