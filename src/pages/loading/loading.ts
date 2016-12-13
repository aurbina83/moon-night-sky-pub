import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, Platform } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import {WelcomePage} from '../welcome/welcome';
import {LoginPage} from '../login/login';

/*
  Generated class for the LoadingPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'loading-page',
  templateUrl: 'loading.html'
})
export class LoadingPage {
  public status;
  public load;
  public token: boolean;

  constructor(private navCtrl: NavController, private menu: MenuController, private UserService: UserService, private loadingCtrl: LoadingController, private platform: Platform) {
    this.load = this.loadingCtrl.create({});
    this.load.present();
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true, 'menu1');
    this.status = this.UserService.setUser();
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu1');
    this.status.id ? this.check() : this.preCheck();
  }

  // if token is deleted from local storage, check SQlite. If token, set user and check()
  public preCheck() {
    this.UserService.tokenCheck()
      .then(data => {
        this.status = data;
        this.check();
      })
      .catch(e => this.check());
  }

  //Check status and navigate to welcome page or login page
  public check() {
    this.load.dismiss().then(() => {
      this.status._id ? this.navCtrl.setRoot(WelcomePage) : this.navCtrl.setRoot(LoginPage);
    })
  }
}
