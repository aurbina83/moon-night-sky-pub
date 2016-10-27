import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

/*
  Generated class for the CrisisPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'crisis-page',
    templateUrl: 'crisis.html'
})

export class CrisisPage {

    constructor(private navCtrl: NavController, private menu: MenuController) {

    }

    ionViewWillLoad(){
        this.menu.swipeEnable(true, 'menu1');
    }

}
