import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, ActionSheetController, Platform } from 'ionic-angular';
import { BrowsePage } from '../browse/browse';
import { CreatePage } from '../create/create';
import {PendingPage} from '../pending/pending';
import {RegisterPage} from '../register/register';
import { QrfChatPage } from '../qrf-chat/qrf-chat';
import { QrfAcceptPage } from '../qrf-accept/qrf-accept';
import { LocationPage } from '../location-page/location-page';
import { EventDetailsPage } from '../event-details/event-details';
import { UserService } from '../../providers/user-service/user-service';
import { EventService } from '../../providers/event-service/event-service';
import { QrfService} from '../../providers/qrf-service/qrf-service';
import { Alerts } from '../../providers/alerts/alerts';
import { NativeStorage, Diagnostic, InAppBrowser } from 'ionic-native';
/*
  Generated class for the WelcomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  public status;


  constructor(private navCtrl: NavController, private menu: MenuController, private UserService: UserService, private QrfService: QrfService, private EventService: EventService, private alertService: Alerts, private loadingCtrl: LoadingController, private actionCtrl: ActionSheetController, private platform: Platform) {
    this.status = UserService.status;
  }

  ionViewWillEnter() {
    this.UserService.checkLocation();
  }
  ionViewDidEnter() {
    if (!this.status.branch) this.navCtrl.setRoot(RegisterPage);
    else if (this.status.branch && !this.status.verified) this.navCtrl.setRoot(PendingPage);
    else {
      this.platform.ready().then(() => {
        this.pushToken();
        this.locationCheck();
        this.notificationStore();
      })
    }
  }

  // Check to see if user has granted location permissions. If not, send them to pergatory.
  locationCheck() {
    Diagnostic.getLocationAuthorizationStatus().then(status => {
      if (status == "denied" || status == "not_requested" || status == "DENIED" || status == "NOT_REQUESTED") this.navCtrl.push(LocationPage);
    }).catch(e => console.log(e));
  }

  // Check to see if there are any pending notifications.
  notificationStore() {
    NativeStorage.getItem('notification').then((data) => {
      this.notificationCheck(data);
    }, (err) => {
      return;
    })
  }

  // If notifications exist, check to see if they are routable notifications.
  notificationCheck(data) {
    if (data.notification.payload.additionalData) {
      let d = data.notification.payload.additionalData;
      if (d.type && d.type == "deleted") this.navCtrl.push(BrowsePage);
      if (d.type && d.type == "web") {
        let browser = new InAppBrowser(d.url, '_system');
        browser.show();
      }
      if (d.type && d.type == "qrf") {
        this.QrfService.getOne(d.id).subscribe((data) => {
          this.navCtrl.push(QrfAcceptPage, { qrf: data });
        }, (err) => {
          console.log(err.message);
        })
      }
      if (d.type && d.type == "qrfChat") this.navCtrl.push(QrfChatPage, { _id: d.id });
      if (d.type && d.type == "event") {
        this.EventService.getOne(d.id).subscribe((data) => {
          this.navCtrl.push(EventDetailsPage, { event: data });
        }, (err) => {
          console.log(err.message);
        })
      }
    }
    NativeStorage.remove('notification');
  }

  // Send push token to database.
  pushToken() {
    let callback = (data) => {
      let pushToken = {
        id: data.userId,
        pushToken: data.pushToken
      }
      this.UserService.updateUser("push", this.status._id, pushToken).then((res) => {
        return;
      }, (err) => {
        this.alertService.toast(err.message, "toastError");
      });
    };
    window['plugins'].OneSignal.getIds(callback);
  }

  browse() {
    this.navCtrl.setRoot(BrowsePage);
  }

  create() {
    this.navCtrl.setRoot(CreatePage);
  }
}
