import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QRCodeGeneratorPage } from './qrcode-generator.page';

const routes: Routes = [
  {
    path: '',
    component: QRCodeGeneratorPage
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
  declarations: [QRCodeGeneratorPage]
})
export class QRCodeGeneratorPageModule {}
