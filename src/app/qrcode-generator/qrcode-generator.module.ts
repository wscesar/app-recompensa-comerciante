import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QrcodeGeneratorPage } from './qrcode-generator.page';

const routes: Routes = [
  {
    path: '',
    component: QrcodeGeneratorPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QrcodeGeneratorPage]
})
export class QrcodeGeneratorPageModule {}
