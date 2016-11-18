declare var require;
import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, Platform } from 'ionic-angular';
import { Validate } from '../../providers/validate/validate';
import { UserService } from '../../providers/user-service/user-service';
import {VerifyPage} from '../verify/verify';
import {WelcomePage} from '../welcome/welcome';
import { Alerts } from '../../providers/alerts/alerts';
/*
  Generated class for the RegisterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})
export class RegisterPage {

    public status;

    displayMos: string = "MOS";
    maxNum: number;
    pattern: any;
    user = {
        branch: null,
        mos: null,
        branchImg: null
    }
    patternMessage;
    mosCheck = true;
    mosTouch;

    constructor(private navCtrl: NavController, private menu: MenuController, private validator: Validate,
        private UserService: UserService, private alerts: Alerts, private loadingCtrl: LoadingController, private platform: Platform) {
        this.status = UserService.status;
        this.user.branch = "Army";
        this.setMos();
        this.platform.ready().then(()=>{
            UserService.getLocation();
        });
    }

    onSubmit() {
        let loader = this.loadingCtrl.create({});
        loader.present();
        this.user.mos = this.user.mos.toUpperCase();
        this.UserService.updateUser('register', this.status._id, this.user).then(() => {
            loader.dismiss();
            this.status.verified ? this.navCtrl.setRoot(WelcomePage) : this.navCtrl.setRoot(VerifyPage);
        }, err => {
            loader.dismiss();
            this.alerts.basic("Error", err.message);
        })
    }

    validateMos() {
        this.mosCheck = this.validator.validateMos(this.user.mos, this.pattern, this.maxNum)
    }

    ionViewDidEnter() {
        this.menu.swipeEnable(false, 'menu1');
    }

    ionViewWillLeave() {
      this.menu.swipeEnable(true, 'menu1');
  }

    public setMos() {
        if (this.user.branch == "Army") {
            this.displayMos = "MOS";
            this.maxNum = 3;
            this.pattern = /^[a-zA-Z0-9]+$/;
            this.patternMessage = "Two numbers and one letter only. No AKIs or SQIs"
            this.user.branchImg = "images/army.png"
        }
        if (this.user.branch == "Marines") {
            this.displayMos = "MOS";
            this.maxNum = 4;
            this.pattern = /^[0-9]+$/;
            this.patternMessage = "Four numbers only. No other identifiers please."
            this.user.branchImg = "images/marines.png"
        }
        if (this.user.branch == "Air Force") {
            this.displayMos = "AFSC";
            this.maxNum = 5;
            this.pattern = /^[a-zA-Z0-9]+$/;
            this.patternMessage = "Numbers and letters only"
            this.user.branchImg = "images/airforce.png"
        }
        if (this.user.branch == "Navy") {
            this.displayMos = "General & Service Rating Abbr.";
            this.maxNum = 3;
            this.pattern = /^[a-zA-Z0-9]+$/;
            this.patternMessage = "Max of 3 letters and numbers. No rank or other identifiers please."
            this.user.branchImg = "images/navy.png"
        }
    }
}
