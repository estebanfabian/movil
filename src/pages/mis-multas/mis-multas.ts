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
            this.ProcesarMulta(data);
        }, err => {
            this.presentToast("Error servidor.Contacte al administrador");
        });
    }
    ProcesarMulta(listar) {

        if (listar.length == 0) {
            this.presentToast("Error servidor.Contacte al administrador");
        } else {
            this.tarje = listar;
        }
    }
    presentToast(msg) {// se crea la funcion reducuir la linea de codigo
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
}