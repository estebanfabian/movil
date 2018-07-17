import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CambioClavePage } from './cambio-clave';

@NgModule({
  declarations: [
    CambioClavePage,
  ],
  imports: [
    IonicPageModule.forChild(CambioClavePage),
  ],
})
export class CambioClavePageModule {}
