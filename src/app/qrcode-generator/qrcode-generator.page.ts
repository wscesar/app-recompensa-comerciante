import { Component, OnInit } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-qrcode-generator',
  templateUrl: './qrcode-generator.page.html',
})
export class QRCodeGeneratorPage implements OnInit {

    form: FormGroup;
    encodeData: any;
    scannedData: {};
    barcodeScannerOptions: BarcodeScannerOptions;

    constructor(
        private authService: AuthService,
        private barcodeScanner: BarcodeScanner,
        private restaurantService: RestaurantService,
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            score: new FormControl(null)
        });

        this.barcodeScannerOptions = {
            showTorchButton: true,
            showFlipCameraButton: true
        };
    }

    onSubmit() {
        const uniqueId = Math.random().toString(36); // .substr(2, 9);
        const restaurantId =  this.authService.getUserId();

        this.encodeData = restaurantId + '-' + this.form.value.score  + '-' +  uniqueId;

        this.barcodeScanner
            .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
            .then(
                response => {
                    alert(response);
                    this.encodeData = response;
                    this.form.patchValue({score: null});
                },
                error => {
                    alert('Error occured : ' + error);
                }
            )
            .catch(error => alert(error));
    }
}
