import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the Alerts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Alerts {

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {}

  basic(title, subtitle) {
    let alert = this.alertCtrl.create({
        title: title,
        subTitle: subtitle,
        buttons: ['OK']
    });
    alert.present();
  }

  toast(message, css){
      let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          cssClass: css
      });
      toast.present();
  }

}
