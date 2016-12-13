import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the EventPreviewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'event-preview-page',
  templateUrl: 'event-preview.html',
})
export class EventPreviewPage {
  public event;

  constructor(private navCtrl: NavController, private params: NavParams, private viewCtrl: ViewController) {
    this.event = this.params.get("event");
  }

  public close() {
    this.viewCtrl.dismiss();
  }

}
