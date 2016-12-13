import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { CrisisPage } from '../crisis/crisis';
import { QrfListPage } from '../qrf-list/qrf-list';
import {QrfService} from '../../providers/qrf-service/qrf-service';
import {UserService} from '../../providers/user-service/user-service';
import { Alerts } from '../../providers/alerts/alerts';


@Component({
  selector: 'qrf-create-page',
  templateUrl: 'qrf-create.html'
})
export class QrfCreatePage {
  public view = true;
  public createView;
  public status;
  public qrf;
  public warningModal;

  create() {
    let date = new Date();
    let expire = new Date(date.setHours(date.getHours() + 24));
    this.qrf.expirationDate = expire;

    let load = this.loadingCtrl.create({});
    load.present();

    this.qrfSerivce.create(this.qrf).subscribe(() => {
      load.dismiss().then(() => {
        this.alerts.toast("QRF Request Sent!", null);
        this.navCtrl.setRoot(QrfListPage);
      });
    }, (err) => {
      load.dismiss().then(() => {
        this.alerts.basic("Oops!", "We're a little ate up right now. Try again in a minute");
      });
    })
  }

  start() {
    this.view = false;
    this.createView = true;
  }

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private qrfSerivce: QrfService, private UserService: UserService, private alerts: Alerts, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.status = UserService.status;
    this.createView = false;

    let name = this.status.name.split(" ");
    let date = new Date();

    this.qrf = {
      description: '',
      location: this.status.loc,
      limit: 5,
      creator: this.status._id,
      dateCreated: date,
      expirationDate: null,
      creatorInfo: {
        firstName: name[0],
        lastName: name[1],
        imgUrl: this.status.imgUrl,
        branch: this.status.branch,
        branchImg: `images/${this.status.branch.toLowerCase()}.png`
      }
    }
  }

  ionViewDidLoad() {
    // Check to see if user has gone to crisis page in the last 24 hours. If so, send them back to crisis page.
    setTimeout(() => {
      NativeStorage.getItem("crisis").then((data) => {
        let date = new Date();
        let dataDate = new Date(data);
        if (dataDate > date) {
          this.navCtrl.setRoot(CrisisPage);
        } else {
          this.warningModal = this.modalCtrl.create(Warning);
          this.warningModal.onDidDismiss((data) => {
            if (data == 'crisis') {
              this.navCtrl.setRoot(CrisisPage);
            } else {
              this.view = true
            }
          });
          this.warningModal.present();
        }
      }, err => {
        this.warningModal = this.modalCtrl.create(Warning);
        this.warningModal.onDidDismiss((data) => {
          if (data == 'crisis') {
            this.navCtrl.setRoot(CrisisPage);
          } else {
            this.view = true
          }
        });
        this.warningModal.present();
      })
    }, 75);
  }
}

//////////////////////////////
///////////Modal/////////
///////////////////////////


@Component({
  selector: 'warning-page',
  templateUrl: 'warning.html',
})
export class Warning {
  constructor(private navCtrl: NavController, private viewCtrl: ViewController) {
  }

  crisis() {
    let date = new Date();
    date = new Date(date.setHours(date.getHours() + 24));
    NativeStorage.setItem("crisis", date);
    this.viewCtrl.dismiss('crisis');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
