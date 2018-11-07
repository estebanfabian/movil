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

    private ValidarForm() {//se realiza la validacion de los campos  que cumpla los parametro de longitud establecidos
        return this.formBuilder.group({
            Buscar: ['', [Validators.required]],
            Consulta: ['', [Validators.required]],
        });
    }

    Datos_libro() {// se crea un caso para verificar el filtro que selecione el usuario

        switch (this.formu.value.Buscar) {
            case "Id": {
                this.respuesta = this.ConectServ.Traer_Id(this.formu.value);
                this.error(this.respuesta);
                break;
            } case "Tit": {
                this.respuesta = this.ConectServ.Traer_Titulo(this.formu.value);
                this.error(this.respuesta);
                break;
            } case "Aut": {
                this.respuesta = this.ConectServ.Traer_Autor(this.formu.value);
                this.error(this.respuesta);
                break;
            } case "Tema": {
                this.respuesta = this.ConectServ.Traer_Tema(this.formu.value);
                this.error(this.respuesta);;
                break;
            } case "Edit": {
                this.respuesta = this.ConectServ.Traer_Editorial(this.formu.value);
                this.error(this.respuesta);
                break;
            } case "Facu": {
                this.respuesta = this.ConectServ.Traer_Facultad(this.formu.value);
                this.error(this.respuesta);
                break;
            }
            default: {
                this.presentToast("Error en el servidor Contacte al administrador");
                break;
            }
        }
    }

    ProcesarTabla(listar) {//indica la cantidad de libro que este con el filtro y parametros de busqueda
        if (listar.length == 0) {
            this.presentToast("No hay libros registrados");
            this.ocultar = false;
        } else {
            this.tabla = listar;
            this.ocultar = true;
        }
    }
    presentToast(msg) {// se crea una funcion para mostrar los mensaje
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

    reservar(lista) {//esta funcion nos envia a la siguiente pagina
        this.navCtrl.push(ReservaPage, {
            lista: lista, info: this.info
        });
    }
    error(respuesta) {// maneja los errores que se proboque al momento de ejecucion
        this.respuesta.subscribe(data => {
            this.ProcesarTabla(data);
        }, err => {
            this.presentToast("Error en el servidor Contacte al administrador");
        });
    }
}