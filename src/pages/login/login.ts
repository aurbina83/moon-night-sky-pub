import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController} from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { RegisterPage } from '../register/register';
import { PendingPage} from '../pending/pending';
import {UserService} from '../../providers/user-service/user-service';
import {Alerts} from '../../providers/alerts/alerts';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})
export class LoginPage {
    public loggingIn;
    public status;
    constructor(private navCtrl: NavController, private UserService: UserService, private menu: MenuController, private loadingCtrl: LoadingController, private alertService: Alerts) {
        this.loggingIn = false;
    }

    ionViewDidEnter() {
        this.menu.swipeEnable(false, 'menu1');
    }

    ionViewWillLeave() {
        this.menu.swipeEnable(true, 'menu1');
    }

    public login() {
        this.loggingIn = true;
        let loading = this.loadingCtrl.create({
            showBackdrop: false
        });
        loading.present();
        this.UserService.login().then((res) => {
            this.status = res;
            loading.dismiss().then(()=>{
                if(!this.status.branch) this.navCtrl.setRoot(RegisterPage);
                if(this.status.branch && !this.status.verified) this.navCtrl.setRoot(PendingPage);
                if(this.status.branch && this.status.verified) this.navCtrl.setRoot(WelcomePage);
            });
        }, (err) => {
            loading.dismiss().then(() => {
                this.loggingIn = false;
                this.alertService.toast(err, null);
            });
        });
    }
}
