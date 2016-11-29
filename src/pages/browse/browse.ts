import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EventService } from '../../providers/event-service/event-service';
import { UserService } from '../../providers/user-service/user-service';
import { EventPreviewPage } from '../event-preview/event-preview';
import { EventsAttendingPage } from '../events-attending/events-attending';
import { CreatePage } from '../create/create';
import { Alerts } from "../../providers/alerts/alerts";

/*
  Generated class for the BrowsePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: "browse-page",
    templateUrl: 'browse.html',
})
export class BrowsePage {
    public events;
    public status;
    public query = { maxDist: null, lat: null, lng: null, skip: null };
    public friends = [];
    public storage;

    constructor(private navCtrl: NavController, private EventService: EventService, private UserService: UserService, private modalCtrl: ModalController, private alertService: Alerts, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
        this.status = UserService.status;
        this.storage = new Storage();
        this.query.lng = this.status.loc[0];
        this.query.lat = this.status.loc[1];
    }

    ionViewWillEnter() {
        this.storage.get("friends").then((data) => {
            this.friends = data;
        });
        this.queryInit();
    }

    queryInit() {
        this.query.skip = 0;
        this.query.maxDist = 25;
        let load = this.loadingCtrl.create({});
        load.present();
        this.getAll().then(() => {
            load.dismiss().then(() => {
                if (this.events.length < 1) {
                    this.noEventAlert();
                }
            })
        }, err => {
            load.dismiss();
        });
    }

    radiusAdjust() {
        this.query.skip = 0;
        this.getAll();
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.EventService.getAll(this.query).then((data) => {
                this.events = data;
                if (this.events.length > 0 && this.friends && this.friends.length > 0) this.checkFriends(this.events);
                this.query.skip += this.events.length;
                resolve();
            }, (err) => {
                this.alertService.toast(err.message, "toastError");
                reject(err);
            })
        })
    }

    public checkFriends(arr) {
        arr.forEach((a) => {
            if (this.friends.indexOf(a.eventCreator.facebook.id) != -1) {
                a.friends = true;
            }
        })
    }

    infinite(infiniteScroll) {
        if (this.events.length % 30 != 0) infiniteScroll.complete();
        else if (this.events.length % 30 == 0) {
            this.getAll().then(() => {
                infiniteScroll.complete();
            }, err => {
                infiniteScroll.complete();
            })
        }
    }

    refresh(refresher) {
        this.query.skip = 0;
        this.query.maxDist = 25;
        this.getAll().then(() => {
            refresher.complete();
        })
    }

    info(event) {
        let modalPage = this.modalCtrl.create(EventPreviewPage, { event: event });
        modalPage.present();
    }

    showAlert() {
        this.alertService.basic("Slow down there high speed!", "You're already in this event. Pop smoke!")
    }

    attend(event) {
        if (event.eventCreator._id == this.status._id) {
            return this.showAlert();
        }
        for (let i = 0; i < event.attending.length; i++) {
            if (event.attending[i]._id == this.status._id) {
                return this.showAlert();
            }
        }
        this.EventService.attending(event._id).then(() => {
            this.alertService.toast("You're in!", null);
            this.navCtrl.setRoot(EventsAttendingPage);
        }, (err) => {
            this.alertService.basic("Our shit's all fucked up!", "Try pulling the page at the top to refresh");
        })
    }

    noEventAlert() {
        let alert = this.alertCtrl.create({
            title: "Dry Hole!",
            message: "Looks like there aren't any events in your area yet. Try increasing the search radius above, or create an event!",
            buttons: [
                {
                    text: 'Adjust Radius',
                    role: 'cancel',
                    handler: data => {
                        return;
                    }
                },
                {
                    text: 'Create Event',
                    handler: data => {
                        this.navCtrl.setRoot(CreatePage);
                    }
                }
            ]
        })
        alert.present();
    }

}
