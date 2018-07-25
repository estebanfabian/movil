import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModificarPage } from './modificar';

@NgModule({
  declarations: [
    ModificarPage,
  ],
  imports: [
    IonicPageModule.forChild(ModificarPage),
  ],
})
export class ModificarPageModule {}