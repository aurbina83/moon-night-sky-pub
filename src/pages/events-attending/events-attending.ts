import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { EventService } from '../../providers/event-service/event-service';
import { EventDetailsPage} from '../event-details/event-details';
import { Alerts } from '../../providers/alerts/alerts';

/*
  Generated class for the MyEventsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'events-attending-page',
    templateUrl: 'events-attending.html'
})
export class EventsAttendingPage {
    public events = [];

    constructor(private navCtrl: NavController, private EventSerivce: EventService, private alert: Alerts, private loadingCtrl: LoadingController) {

        let load = this.loadingCtrl.create({});
        load.present();
        this.EventSerivce.getAttending().then((data) => {
            load.dismiss().then(() =>{
            this.events = this.events.concat(data);
        })
        }, err => {
            load.dismiss().then(() =>{
                this.alert.toast(err.message, "toastError");
            })
        });

    }

    ionViewDidEnter() {

    }

    public go(e) {
        this.navCtrl.push(EventDetailsPage, { event: e })
    }

    public backout(e) {
        let load = this.loadingCtrl.create({});
        load.present();
        this.EventSerivce.notAttending(e._id).then(() => {
            load.dismiss();
            this.events.splice(this.events.indexOf(e), 1);
            this.alert.toast("You're out!", null);
        }, err => {
            load.dismiss();
            this.alert.toast(err.message, "toastError");
        })
    }


}
