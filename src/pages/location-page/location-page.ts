import {
    Component
} from '@angular/core';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { Diagnostic } from 'ionic-native';
import {WelcomePage} from '../welcome/welcome';

/*
  Generated class for the LocationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'location-page',
  templateUrl: 'location-page.html',
  // animations: [
  //     trigger('button2', [
  //         state('inactive', style({
  //             opacity: 0,
  //             transform: 'translateX(-200%)'
  //         })),
  //         state('active', style({
  //             opacity: 1,
  //             transform: 'translateX(0)'
  //         })),
  //         transition('inactive => active', animate('0.9s ease-in-out')),
  //         transition('active => inactive', animate('0.9s ease-in-out'))
  //     ]),
  //     trigger('button1', [
  //         state('inactive', style({
  //             opacity: 0,
  //             transform: 'translateX(200%)'
  //         })),
  //         state('active', style({
  //             opacity: 1,
  //             transform: 'translateX(0)'
  //         })),
  //         transition('inactive => active', animate('0.9s ease-in-out')),
  //         transition('active => inactive', animate('0.9s ease-in-out'))
  //     ])
  // ]
})
export class LocationPage {

    drip;
    permission;

  constructor(public navCtrl: NavController, public menu: MenuController, public platform: Platform) {
      this.drip = true;
      this.permission = false;
      document.addEventListener('resume', () =>{
          this.test();
      })
  }

  ionViewDidEnter(){
      this.menu.swipeEnable(false, 'menu1');
  }

  ionViewWillLeave(){
      this.menu.swipeEnable(true, 'menu1');
  }

  ionViewDidLoad() {

  }

  ionViewCanLeave() {
      if(this.permission) return true;
      else return false;
  }

  toggle(){
      setTimeout(() => this.drip = !this.drip, 3000);
  }

  goToSettings(){
      Diagnostic.switchToSettings().then(()=>{
          this.toggle();
      }).catch(e => this.toggle());
  }

  test(){
      Diagnostic.getLocationAuthorizationStatus().then(status => {
          if (status != "denied" || status != "not_requested" || status != "DENIED" || status == "NOT_REQUESTED"){
              this.permission = true;
              this.navCtrl.setRoot(WelcomePage);
          }else {
              this.toggle();
          }
      }).catch(e => this.toggle());
  }

}
