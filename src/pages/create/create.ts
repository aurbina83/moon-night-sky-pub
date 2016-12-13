import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import _ from 'lodash';
import { Yelp } from '../../providers/yelp/yelp';
import { UserService } from '../../providers/user-service/user-service';
import {EventService} from '../../providers/event-service/event-service';
import { Alerts } from '../../providers/alerts/alerts';
import { MyEventsPage} from'../my-events/my-events';
import moment from 'moment';

/*
  Generated class for the CreatePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: "create-page",
  templateUrl: 'create.html'
})
export class CreatePage {
  public status;
  public event = { title: null, name: null, description: null, numGuests: null, loc: null, eventAddress: null, city: null, state: null, dateTime: null };
  public query = { term: null, location: null, cll: { lat: null, lng: null }, offset: 0 }
  public results = [];
  public page;
  public min;
  public max;
  public guestArray = [];

  constructor(private navCtrl: NavController, private Yelp: Yelp, private UserService: UserService, private EventService: EventService, private params: NavParams, private alertService: Alerts, private loadingCtrl: LoadingController) {
    this.status = this.UserService.status;
    this.query.cll.lat = this.status.loc[1];
    this.query.cll.lng = this.status.loc[0];
  }

  ionViewWillEnter() {
    this.guestArray = _.range(1, 100);
    this.page = [true, false, false, false, false, false];
    this.min = moment().format("YYYY-MM-DD");
    this.max = moment().add(1, 'months').format("YYYY-MM-DD");
  }


  public yelpSet() {
    this.query.offset = 0;
    this.results = [];
    this.yelp();
  }

  // Search yelp for public venues. Optional infinite scroll;
  public yelp(infiniteScroll?) {
    this.Yelp.yelp(this.query).subscribe((res) => {
      this.results = this.results.concat(res['businesses']);
      this.query.offset += 20;
      if (infiniteScroll) infiniteScroll.complete();
    }, (err) => {
      this.alertService.toast(err.message, "toastError");
    })
  }

  // Set Yelp venue info to the event object.
  submit(r) {
    this.event.name = r.name;
    this.event.eventAddress = r.location.address[0];
    this.event.loc = [r.location.coordinate.longitude, r.location.coordinate.latitude];
    this.event.city = r.location.city;
    this.event.state = r.location.state_code;
  }

  // Save event to database;
  subEvent() {
    let loading = this.loadingCtrl.create({});
    loading.present();
    let offset = moment().utcOffset();

    // Format date to local time (Please Ionic fix this)
    this.event.dateTime = moment(new Date(this.event.dateTime));
    this.event.dateTime = this.event.dateTime.utcOffset(-offset)._d;

    this.EventService.createEvent(this.event).subscribe(() => {
      loading.dismiss().then(() => {
        this.navCtrl.setRoot(MyEventsPage);
      })
    }, (err) => {
      loading.dismiss().then(() => {
        this.alertService.toast(err.message, "toastError");
      })
    })
  }


  /*
  Navigate between each event creation step.
   */
  next(index) {
    this.page[index] = false;
    this.page[index + 1] = true;
  }

  prev(index) {
    if (index === 3) {
      this.page[index] = false;
      this.page[index - 2] = true;
    } else {
      this.page[index] = false;
      this.page[index - 1] = true;
    }
  }

}
