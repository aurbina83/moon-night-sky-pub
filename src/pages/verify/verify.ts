import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController} from 'ionic-angular';
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


    constructor(private navCtrl: NavController, private menu: MenuController, private UserService: UserService, private alerts: Alerts, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {}

    ionViewDidEnter() {
        this.menu.swipeEnable(false, 'menu1');
    }

    ionViewWillLeave() {
        this.menu.swipeEnable(true, 'menu1');
    }

    public confirm(){
        let date = moment(this.date).format("MM/DD/YY");
        let dob = moment(this.dob).format("MM/DD/YYYY");
        let alert = this.alertCtrl.create({
            title: 'Confirm your information',
            message: `Last Name: ${this.name}, DOB: ${dob}, Service Date: ${date}`,
            buttons:[
                {
                    text: "Cancel",
                    role: 'destructive',
                    handler: data =>{
                        return;
                    }
                },
                {
                    text: 'Continue',
                    handler: data =>{
                        this.verify();
                    }
                }
            ]
        })
        alert.present();
    }


    public verify() {
        let load = this.loadingCtrl.create({});
        load.present();
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
            load.dismiss().then(()=>{
                this.alerts.toast("Service Verified!", null);
                this.navCtrl.setRoot(WelcomePage);
            })
        }, (err) =>{
            load.dismiss().then(()=>{
                this.alerts.toast(err.message, null);
                this.navCtrl.setRoot(PendingPage);
            })
        })
    }
}
