import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { EventService } from '../../providers/event-service/event-service';
import { UserService } from '../../providers/user-service/user-service';
import { CommentService } from '../../providers/comment-service/comment-service';
import { Alerts } from '../../providers/alerts/alerts';
declare var io;

@Component({
    selector: 'comments-page',
    templateUrl: 'comments.html',
})


export class CommentsPage {
    @ViewChild('chat') chat: any;
    public socketHost = "https://app.veteranconnect.co";
    public socket;
    public status;
    public event;
    public comments;
    public message;
    public comment = { message: null, event: null };
    public zone;
    constructor(private navCtrl: NavController,
        private params: NavParams,
        private EventService: EventService,
        private UserService: UserService,
        private CommentService: CommentService,
        private alertService: Alerts,
        private loadingCtrl: LoadingController) {
        /**
         * Get messages from server;
         */
        this.status = UserService.status;
        let id = params.get('_id');
        let load = this.loadingCtrl.create({});
        load.present();
        EventService.getOne(id).then((data) => {
            load.dismiss();
            this.event = data;
            this.comments = data['comments'];
        }, err => {
            load.dismiss();
            alert(err.message);
            this.alertService.toast(err.message, "toastError");
        })
        /**
         * Socket Set up
         */
        this.zone = new NgZone({enableLongStackTrace: false});
        this.socket = io("https://app.veteranconnect.co", {port: 3000});
        this.socket.emit('join', {event: id});
        this.socket.on('receive', (data) => {
            this.zone.run(() => {
                this.comments.push(data);
                this.chat.scrollTo(0, 99999, 0);
            });
        });


    }

    ionViewDidEnter() {
        this.chat.scrollTo(0, 99999, 0);
    }

    ionViewWillLeave() {
        this.socket.disconnect();
    }
    public createComment() {
        this.comment.event = this.event._id;
        this.CommentService.create(this.comment);
    }

    public socketM() {
        if(this.comment.message != "") {
            this.comment.message = this.message;
            let name = this.status.name.split(' ');
            let date = new Date();
            let message = {
                event: this.event._id,
                message: this.comment.message,
                user: {
                    firstName: name[0],
                    lastName: name[1],
                    imgUrl: this.status.imgUrl
                },
                datePosted: date
            }
            this.socket.emit('message', message);
            this.createComment();
            this.message = "";
        } else return;
    }

}
