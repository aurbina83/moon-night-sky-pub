import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import {QrfService} from '../../providers/qrf-service/qrf-service';
import {UserService} from '../../providers/user-service/user-service';
import { Alerts } from '../../providers/alerts/alerts';
import {QrfChatPage} from '../qrf-chat/qrf-chat';

/*
  Generated class for the QrfListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'qrf-list-page',
  templateUrl: 'qrf-list.html'
})
export class QrfListPage {
  public events;

  constructor(private navCtrl: NavController, private qrfSerivce: QrfService, private UserService: UserService, private alerts: Alerts, private loadingCtrl: LoadingController) {
    let load = this.loadingCtrl.create({});
    load.present();

    this.qrfSerivce.getMine().subscribe((data) => {
      load.dismiss();
      this.events = data;
    }, (err) => {
      load.dismiss();
      this.alerts.toast(err.message, "toastError");
    })
  }

  public go(e) {
    this.navCtrl.push(QrfChatPage, { _id: e._id });
  }

}
