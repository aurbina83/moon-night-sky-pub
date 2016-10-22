import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { VerifyPage } from '../verify/verify';
import { UserService } from "../../providers/user-service/user-service";

/*
  Generated class for the PendingPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'pending-page',
    templateUrl: 'pending.html'
})

export class PendingPage {
    status;
    constructor(private navCtrl: NavController, private menu: MenuController, private UserService: UserService) {
        this.status = UserService.status;
    }
    ionViewDidEnter() {
        this.menu.swipeEnable(false, 'menu1');
    }

    ionViewWillLeave() {
        this.menu.swipeEnable(true, 'menu1');
    }


    click() {
        this.UserService.logout();
        this.navCtrl.setRoot(LoginPage);
    }

    route() {
        this.navCtrl.setRoot(VerifyPage);
    }

}
