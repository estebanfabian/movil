import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular';
import {PrincipalPage} from '../principal/principal';
import {AlertController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-mis-reservas',
    templateUrl: 'mis-reservas.html',
})
export class MisReservasPage {
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
        this.respuesta = this.ConectServ.Traer_Tarje(infor);
        this.respuesta.subscribe(data => {
            this.ProcesarTabla(data);
        }, err => {
            console.log(err);
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
    cancelar(lista) {

        let alert = this.alertCtrl.create({
            title: 'Cancelar reserva',
            message: 'Esta seguro que desea cancelar la reserva?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        let infor = {
                            idPrestamo: lista
                        }
                        this.respuesta = this.ConectServ.Eliminar_reser(infor);
                        this.respuesta.subscribe(data => {
                            console.log(data);
                            this.respuesta = data
                            if (this.respuesta.sucess == "ok") {
                                let toast = this.toastCtrl.create({
                                    message: "Su reserva ha sido cancelada",
                                    duration: 3000,
                                    position: 'bottom'
                                });
                                toast.present();
                                this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                            }
                            else if (this.respuesta.sucess == "no") {
                                this.presentToast("No se ha podido cancelar el libro");
                            }
                        }, err => {
                            console.log(err)
                            this.presentToast("Error en el servidor.Contacte al administrador");
                        });
                    }
                }
            ]
        });
        alert.present();

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