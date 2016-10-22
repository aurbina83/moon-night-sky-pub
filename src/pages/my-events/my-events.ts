import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { EventService } from '../../providers/event-service/event-service';
import { EventDetailsPage} from '../event-details/event-details';
import { EditPage } from '../edit/edit';
import { Alerts } from '../../providers/alerts/alerts';

/*
  Generated class for the MyEventsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'my-events-page',
    templateUrl: 'my-events.html'
})
export class MyEventsPage {
    public events = [];

    constructor(private navCtrl: NavController, private EventSerivce: EventService, private alert: Alerts, private loadingCtrl: LoadingController) {
        let load = this.loadingCtrl.create({});
        load.present();
        this.EventSerivce.getMine().then((data) => {
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

    public delete(e) {
        let load = this.loadingCtrl.create({});
        load.present();
        this.EventSerivce.remove(e._id).then(() => {
            load.dismiss();
            this.events.splice(this.events.indexOf(e), 1);
            this.alert.toast("Event Deleted!", null);
        }, err => {
            load.dismiss();
            this.alert.toast(err.message, "toastError");
        })
    }

    public edit(e) {
        this.navCtrl.push(EditPage, { event: e });
    }


}
