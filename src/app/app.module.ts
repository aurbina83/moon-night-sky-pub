import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {Http} from "@angular/http";
import {Storage} from '@ionic/storage';

// Pages
import { BrowsePage } from '../pages/browse/browse';
import { CommentsPage } from '../pages/comments/comments';
import { CreatePage } from '../pages/create/create';
import { CrisisPage } from '../pages/crisis/crisis';
import { EditPage } from '../pages/edit/edit';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { EventPreviewPage } from '../pages/event-preview/event-preview';
import { EventsAttendingPage } from '../pages/events-attending/events-attending';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';
import { MyEventsPage } from '../pages/my-events/my-events';
import { PendingPage } from '../pages/pending/pending';
import { QrfAcceptPage } from '../pages/qrf-accept/qrf-accept';
import { QrfChatPage } from '../pages/qrf-chat/qrf-chat';
import { QrfCreatePage, Warning } from '../pages/qrf-create/qrf-create';
import { QrfListPage } from '../pages/qrf-list/qrf-list';
import { RegisterPage } from '../pages/register/register';
import { VerifyPage } from '../pages/verify/verify';
import { WelcomePage } from '../pages/welcome/welcome';

//Providers
import { Alerts } from '../providers/alerts/alerts';
import { CommentService } from '../providers/comment-service/comment-service';
import { ErrorService } from '../providers/error-service/error-service';
import { EventService } from '../providers/event-service/event-service';
import { QrfService } from '../providers/qrf-service/qrf-service';
import { UserService } from '../providers/user-service/user-service';
import { Validate } from '../providers/validate/validate';
import { Yelp } from '../providers/yelp/yelp';

//Pipes
import { Moment, MomentFromNow } from '../pipes/pipe';

let storage = new Storage();

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        noJwtError: true,
        tokenGetter: (() => storage.get('id_token'))
    }), http)
}

@NgModule({
  declarations: [
    MyApp,
    BrowsePage,
    CommentsPage,
    CreatePage,
    EditPage,
    EventDetailsPage,
    EventPreviewPage,
    EventsAttendingPage,
    LoadingPage,
    CrisisPage,
    LoginPage,
    MyEventsPage,
    PendingPage,
    QrfAcceptPage,
    QrfChatPage,
    QrfCreatePage,
    Warning,
    QrfListPage,
    RegisterPage,
    VerifyPage,
    WelcomePage,
    Moment,
    MomentFromNow
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    // HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BrowsePage,
    CommentsPage,
    CreatePage,
    CrisisPage,
    EditPage,
    EventDetailsPage,
    EventPreviewPage,
    EventsAttendingPage,
    LoadingPage,
    LoginPage,
    MyEventsPage,
    PendingPage,
    QrfAcceptPage,
    QrfChatPage,
    QrfCreatePage,
    Warning,
    QrfListPage,
    RegisterPage,
    VerifyPage,
    WelcomePage
  ],
  providers: [ Storage, Alerts, CommentService, ErrorService, EventService, QrfService, UserService, Validate, Yelp, AuthHttp, {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
  }]
})
export class AppModule {}
