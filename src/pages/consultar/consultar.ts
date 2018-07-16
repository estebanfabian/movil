import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from 'ionic-angular';
import {ReservaPage} from '../reserva/reserva';


@IonicPage()
@Component({
    selector: 'page-consultar',
    templateUrl: 'consultar.html',
})
export class ConsultarPage {

    formu: FormGroup;
    respuesta;
    tabla;
    info;
    public ocultar: boolean = false;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public ConectServ: ConectarProvider,
        public formBuilder: FormBuilder,
        public toastCtrl: ToastController) {
        this.formu = this.ValidarForm();
        this.info = navParams.get("info");
    }

    private ValidarForm() {
        return this.formBuilder.group({
            Buscar: ['', [Validators.required]],
            Consulta: ['', [Validators.required]],
        });
    }

    Datos_libro() {

        if (this.formu.value.Buscar == "Id") {
            this.respuesta = this.ConectServ.Traer_Id(this.formu.value);
            console.log(this.formu.value);
            this.respuesta.subscribe(data => {
                this.ProcesarTabla(data);
                console.log(data);
            }, err => {
                this.presentToast("Error en el servidor.Contacte al administrador");

            });
        }

        else if (this.formu.value.Buscar == "Tit") {
            this.respuesta = this.ConectServ.Traer_Titulo(this.formu.value);
            this.respuesta.subscribe(data => {
                this.ProcesarTabla(data);
            }, err => {
                this.presentToast("Error en el servidor.Contacte al administrador");
            });
        }
        else if (this.formu.value.Buscar == "Aut") {
            this.respuesta = this.ConectServ.Traer_Autor(this.formu.value);
            this.respuesta.subscribe(data => {
                this.ProcesarTabla(data);
            }, err => {
                this.presentToast("Error en el servidor.Contacte al administrador");
            });
        }
        else if (this.formu.value.Buscar == "Tema") {
            this.respuesta = this.ConectServ.Traer_Tema(this.formu.value);
            this.respuesta.subscribe(data => {
                this.ProcesarTabla(data);
            }, err => {
                this.presentToast("Error en el servidor.Contacte al administrador");
            });;
        }
        else if (this.formu.value.Buscar == "Edit") {
            this.respuesta = this.ConectServ.Traer_Editorial(this.formu.value);
            this.respuesta.subscribe(data => {
                this.ProcesarTabla(data);
            }, err => {
                this.presentToast("Error en el servidor.Contacte al administrador");
            });
        }
        else if (this.formu.value.Buscar == "Facu") {
            this.respuesta = this.ConectServ.Traer_Facultad(this.formu.value);
            this.respuesta.subscribe(data => {
                this.ProcesarTabla(data);

            }, err => {
                this.presentToast("Error en el servidor.Contacte al administrador");
            });
        }
    }

    ProcesarTabla(listar) {

        if (listar.length == 0) {
            this.presentToast("No hay Valores");
            this.ocultar = false;
        } else {
            this.tabla = listar;
            this.ocultar = true;
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

    reservar(lista) {
        this.navCtrl.push(ReservaPage, {
            lista: lista, info: this.info
        });
    }

}