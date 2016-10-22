import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventService } from '../../providers/event-service/event-service';
import { CommentsPage } from '../comments/comments';
import { Alerts } from '../../providers/alerts/alerts';
import { WelcomePage } from '../welcome/welcome';

/*
  Generated class for the EventDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'event-details-page',
    templateUrl: 'event-details.html',
})
export class EventDetailsPage {
    public event;

    constructor(private navCtrl: NavController, private params: NavParams, private EventService: EventService, private alerts: Alerts) {
        this.event = params.get("event");
    }

    comments() {
        this.navCtrl.push(CommentsPage, { _id: this.event._id });
    }

}
