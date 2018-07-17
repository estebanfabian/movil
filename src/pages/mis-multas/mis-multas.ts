import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-mis-multas',
    templateUrl: 'mis-multas.html',
})
export class MisMultasPage {
    info;
    respuesta;
    tarje;
    codigo;
    id;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ConectServ: ConectarProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController) {
        this.info = navParams.get("info")
        for (var cod of this.info) {
            this.codigo = cod.codigo;
        }
        let infor = {
            codigo: this.codigo
        }
        this.respuesta = this.ConectServ.Mis_Multas(infor);
        this.respuesta.subscribe(data => {
            this.ProcesarTabla(data);
        }, err => {
            this.presentToast("Error servidor.Contacte al administrador");
        });
    }
    ProcesarTabla(listar) {

        if (listar.length == 0) {
            this.presentToast("No hay libros reservados");
        } else {
            this.tarje = listar;
        }
    }
    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
}