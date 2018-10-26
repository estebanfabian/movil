import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular';
import {PrincipalPage} from '../principal/principal';
import {AlertController} from 'ionic-angular';
import * as moment from 'moment';

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
    dateTime;
    myDate;
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
            this.presentToast("Error servidor Contacte al administrador");
        });
    }

    ProcesarTabla(listar) {
        if (listar.length == 0) {
            this.presentToast("No hay libros reservados");
        } else {
            this.tarje = listar;
        }
        this.calcular_dias();
    }
    renovacion(lista) {
        let alert = this.alertCtrl.create({
            title: 'Renovacion en linea',
            message: '¿Desea realizar la renovacion en linea?',
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
                        this.calcular_dias();
                        let infor = {
                            diaEntrega: this.myDate,
                            idPrestamo: lista
                        };
                        this.respuesta = this.ConectServ.Renovacion_liena(infor);
                        this.respuesta.subscribe(data => {
                            this.respuesta = data;
                            if (this.respuesta.sucess == "ok") {
                                this.presentToast("Se a  renovado el libro con exito");
                                this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                            }
                            else {
                                this.presentToast("No se ha podido cancelar el libro");
                            }
                        }, err => {
                            this.presentToast("Error en el servidor Contacte al administrador");
                        });
                    }
                }
            ]
        });
        alert.present();
    }
    cancelar(lista) {

        let alert = this.alertCtrl.create({
            title: 'Cancelar reserva',
            message: '¿Esta seguro que desea cancelar la reserva?',
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
                            this.respuesta = data
                            if (this.respuesta.sucess == "ok") {
                                this.presentToast("Se a eliminado la reserva con exito");
                                this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                            }
                            else {
                                this.presentToast("No se ha podido cancelar el libro");
                            }
                        }, err => {
                            this.presentToast("Error en el servidor Contacte al administrador");
                        });
                    }
                }
            ]
        });
        alert.present();
    }
    presentToast(msg) {// se crea la funcion reducuir la linea de codigo al momento de imprimir mensajes
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
    calcular_dias() {

        if (moment(this.myDate).format("dddd") == "Sunday") {
            this.myDate = moment(this.myDate).add(4, "days").format('YYYY/MM/DD hh:mm:ss');
        } else {
            this.myDate = moment(this.myDate).add(3, "days").format('YYYY/MM/DD hh:mm:ss');
        }
    }
}