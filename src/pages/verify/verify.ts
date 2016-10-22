import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { Alerts } from '../../providers/alerts/alerts';
import { WelcomePage } from '../welcome/welcome';
import { PendingPage } from '../pending/pending';
import moment from 'moment';
import 'rxjs/add/operator/map';


/*
  Generated class for the VerifyPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'verify-page',
    templateUrl: 'verify.html'
})
export class VerifyPage {
    public name;
    public date;
    public dob;


    constructor(private navCtrl: NavController, private menu: MenuController, private UserService: UserService, private alerts: Alerts) {}

    ionViewDidEnter() {
        this.menu.swipeEnable(false, 'menu1');
    }

    ionViewWillLeave() {
        this.menu.swipeEnable(true, 'menu1');
    }


    public verify() {
        this.date = moment(this.date).format("MM/DD/YYYY");
        this.dob = moment(this.dob).format("MM/DD/YYYY");

        this.date = this.date.toString();
        this.dob = this.dob.toString();
        let body = {
            name: this.name,
            date: this.date,
            dob: this.dob
        }
        this.UserService.verifyUser(body).then((res) =>{
            this.alerts.toast("Service Verified!", null);
            this.navCtrl.setRoot(WelcomePage);
        }, (err) =>{
            this.alerts.toast(err, null);
            this.navCtrl.setRoot(PendingPage);
        })
    }
}
