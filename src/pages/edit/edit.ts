import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Yelp } from '../../providers/yelp/yelp';
import { UserService } from '../../providers/user-service/user-service';
import {EventService} from '../../providers/event-service/event-service';
import { MyEventsPage} from'../my-events/my-events';
import moment from 'moment';

/*
  Generated class for the CreatePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'edit-page',
    templateUrl: 'edit.html'
})
export class EditPage {
    public status;
    public event;
    public query = { term: null, location: null, cll: { lat: null, lng: null }, offset: 0 }
    public results = [];
    public page;
    public min;
    public max;
    public guestArray = [];

    constructor(private navCtrl: NavController, private Yelp: Yelp, private UserService: UserService, private EventService: EventService, private params: NavParams) {
        this.status = this.UserService.status;
        this.query.cll.lat = this.status.loc[1];
        this.query.cll.lng = this.status.loc[0];

        this.event = params.get("event");
        let offset = moment().utcOffset();

        this.event.dateTime = moment(this.event.dateTime);
        this.event.dateTime = this.event.dateTime.utcOffset(offset)._d;

        for (let i = 2; i < 99; i++) {
            this.guestArray.push(i);
        }
        this.page = [false, false, false, false, false, false, true];
    }

    ionViewWillEnter() {
        this.min = moment().format("YYYY-MM-DD");
        this.max = moment().add(1, 'months').format("YYYY-MM-DD");
    }


    public yelpSet() {
        this.page[1] = false;
        this.page[2] = true;
        this.query.offset = 0;
        this.results = [];
        this.yelp();
    }
    public yelp(infiniteScroll?) {
        this.Yelp.yelp(this.query).then((res) => {
            this.results = this.results.concat(res['businesses']);
            this.query.offset += 20;
            if (infiniteScroll) infiniteScroll.complete();
        }, (err) => {
            let error = err;
            console.log(error);
        })
    }

    backtoSearch() {
        this.page[2] = false;
        this.page[1] = true;
    }

    submit(r) {
        this.page[2] = false;
        this.page[6] = true;
        this.event.name = r.name;
        this.event.eventAddress = r.location.address[0];
        this.event.loc = [r.location.coordinate.longitude, r.location.coordinate.latitude];
        this.event.city = r.location.city;
        this.event.state = r.location.state_code;
    }

    subEvent() {
        this.EventService.update(this.event).then(() => {
            this.navCtrl.setRoot(MyEventsPage);
        })
    }

    active(index) {
        this.page[index] = true;
        this.page[6] = false;
    }

    prev(index) {
        this.page[index] = false;
        this.page[6] = true;
    }

}
