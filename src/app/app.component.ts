import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav, AlertController} from 'ionic-angular';
import {StatusBar, NativeStorage, Diagnostic} from 'ionic-native';
import {BrowsePage} from '../pages/browse/browse';
import {CreatePage} from '../pages/create/create';
import {EventsAttendingPage} from '../pages/events-attending/events-attending';
import { EventDetailsPage } from '../pages/event-details/event-details';
import {MyEventsPage} from '../pages/my-events/my-events';
import { LoginPage } from '../pages/login/login';
import {LoadingPage} from '../pages/loading/loading';
import { QrfCreatePage } from '../pages/qrf-create/qrf-create';
import {QrfListPage} from '../pages/qrf-list/qrf-list';
import { QrfChatPage } from '../pages/qrf-chat/qrf-chat';
import { QrfAcceptPage } from '../pages/qrf-accept/qrf-accept';
import {UserService} from '../providers/user-service/user-service';
import {EventService} from '../providers/event-service/event-service';
import {QrfService} from '../providers/qrf-service/qrf-service';
import {WelcomePage} from '../pages/welcome/welcome';
import {LocationPage} from '../pages/location-page/location-page';

@Component({
    selector: 'app-menu',
    templateUrl: 'app.template.html',
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage: any = this.UserService.getToken() ? WelcomePage : LoadingPage;
    pages: Array<{ title: string, component: any, icon: any }>;
    public status;
    public storage;
    public zone;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public UserService: UserService,
        public EventService: EventService,
        public QrfService: QrfService,
        public alertCtrl: AlertController) {
        this.status = UserService.status;
        this.initializeApp();

        // set our app's pages
        this.pages = [
            { title: 'Find Events', component: BrowsePage, icon: "search" },
            { title: 'Create Event', component: CreatePage, icon: "create" },
            { title: 'My Events', component: MyEventsPage, icon: "person" },
            { title: 'Attending', component: EventsAttendingPage, icon: "people" },
            { title: 'Request QRF', component: QrfCreatePage, icon: "alert" },
            { title: 'QRF Teams', component: QrfListPage, icon: 'flash' }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleLightContent();

            let notificationReceivedCallback = (data) => {
                if (data.payload.additionalData) {
                    let d = data.payload.additionalData;
                    if (d.type && d.type == "qrf" && data.isAppInFocus) {
                        this.alertQRF(data);
                    }
                } else return;
            }

            let notificationOpenedCallback = (data) => {
                let view = this.nav.getActive();
                if (view.instance instanceof LoadingPage || view.instance instanceof LoginPage) {
                    this.notificationLoading(data);
                }
                else if (data.notification.payload.additionalData) {

                    let d = data.notification.payload.additionalData;
                    if (d.type && d.type == "deleted") this.nav.push(BrowsePage);
                    if (d.type && d.type == "qrf") {
                        this.QrfService.getOne(d.id).then((data) => {
                            this.nav.push(QrfAcceptPage, { qrf: data });
                        }, (err) => {
                            console.log(err.message);
                        })
                    }
                    if (d.type && d.type == "qrfChat") this.nav.push(QrfChatPage, { _id: d.id });
                    if (d.type && d.type == "event") {
                        this.EventService.getOne(d.id).then((data) => {
                            this.nav.push(EventDetailsPage, { event: data });
                        }, (err) => {
                            console.log(err.message);
                        })
                    }
                } else return;
            }

            let iosSettings = {};
            iosSettings['kOSSettingsKeyAutoPrompt'] = false;
            iosSettings['kOSSettingsKeyInAppLaunchUrl'] = false;

            window['plugins'].OneSignal
                .startInit("30dda287-6c9b-42b6-a979-07089bfe9784", "531852131773")
                .inFocusDisplaying(window['plugins'].OneSignal.OSInFocusDisplayOption.None)
                .handleNotificationOpened(notificationOpenedCallback)
                .handleNotificationReceived(notificationReceivedCallback)
                .iOSSettings(iosSettings)
                .endInit();
        });
    }

    public notificationLoading(data) {
        NativeStorage.setItem('notification', data);
    }


    welcome() {
        this.menu.close();
        this.nav.setRoot(WelcomePage);
    }

    alertQRF(data) {
        let d = data.payload.additionalData;
        this.QrfService.getOne(d.id).then((event) => {
            let alert = this.alertCtrl.create({
                title: data.payload.title,
                message: data.payload.body,
                buttons: [
                    {
                        text: 'Ignore',
                        role: 'destructive',
                        handler: data => {
                            return;
                        }
                    },
                    {
                        text: 'Help',
                        handler: data => {
                            this.nav.push(QrfAcceptPage, { qrf: event });
                        }
                    }
                ]
            })
            alert.present();
        }, (err) => {
            console.log(err);
        })

    }

    logout() {
        this.menu.close();
        this.UserService.logout();
        this.nav.setRoot(LoginPage);
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }
}
