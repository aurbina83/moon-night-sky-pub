import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service/user-service';
import { QrfService } from '../../providers/qrf-service/qrf-service';
import { Alerts } from '../../providers/alerts/alerts';
declare var io;

/*
  Generated class for the QrfChatPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'qrf-chat-page',
    templateUrl: 'qrf-chat.html'
})
export class QrfChatPage {
    @ViewChild('chat') chat: any;
    public socketHost = "https://app.veteranconnect.co";
    public socket;
    public status;
    public qrf;
    public message;
    public messages;
    public qrfChat = { message: null, imgUrl: null, name: null, branch: null, datePosted: null };
    public zone;

    constructor(private navCtrl: NavController, private params: NavParams,
        private UserService: UserService,
        private qrfService: QrfService,
        private alerts: Alerts) {

        ////Get Messages
        this.status = UserService.status;
        let id = params.get('_id');
        qrfService.getOne(id).then((data) => {
            this.qrf = data;
            this.messages = data['messages'];
            console.log(this.messages);
            console.log(this.qrf);
        }, (err) => {
            this.alerts.toast(err.message, "toastError");
        });
        /////qrfChat template
        this.qrfChat.imgUrl = this.status.imgUrl;
        this.qrfChat.name = this.status.name;
        this.qrfChat.branch = this.status.branch;


        ////Sockets
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.socket = io("https://app.veteranconnect.co", { port: 3000 });
        this.socket.emit('join', { event: id });
        this.socket.on('receive', (data) => {
            this.zone.run(() => {
                this.messages.push(data['chat']);
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
        this.qrfService.chat(this.qrf._id, this.qrfChat);
    }

    public socketM() {
        if (this.message != "") {
            this.qrfChat.message = this.message;
            this.qrfChat.datePosted = new Date();
            let message = {
                event: this.qrf._id,
                chat: this.qrfChat
            }
            this.socket.emit('message', message);
            this.createComment();
            this.message = "";
        } else return;
    }

}
