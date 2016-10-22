import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QrfService } from '../../providers/qrf-service/qrf-service';
import { Alerts } from '../../providers/alerts/alerts';
import { QrfChatPage } from '../qrf-chat/qrf-chat';
import { WelcomePage } from '../welcome/welcome';

/*
  Generated class for the QrfAcceptPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'qrf-accept-page',
    templateUrl: 'qrf-accept.html'
})
export class QrfAcceptPage {
    public qrf;

    constructor(private navCtrl: NavController, private params: NavParams, private qrfService: QrfService, private alertService: Alerts) {
        this.qrf = params.get("qrf");
    }

    decline(){
        this.navCtrl.setRoot(WelcomePage);
    }

    join() {
        this.qrfService.join(this.qrf._id).then(() => {
            this.navCtrl.setRoot(QrfChatPage, {_id: this.qrf._id});
        }, (err) => {
            this.alertService.toast(err.message, "toastError");
        })
    }
}
