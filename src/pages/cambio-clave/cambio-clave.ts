import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from 'ionic-angular';
import {PrincipalPage} from '../principal/principal'
import {ConectarProvider} from '../../providers/conectar/conectar';

@IonicPage()
@Component({
    selector: 'page-cambio-clave',
    templateUrl: 'cambio-clave.html',
})
export class CambioClavePage {
    myForm: FormGroup;
    ClaveAntigua;
    ClaveNueva;
    Confirmacion;
    respuesta;
    info;
    codigo;
    nombre;
    foto;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public ConectServ: ConectarProvider,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController) {
        this.myForm = this.ValidarForm();
        this.info = navParams.get("info");
        for (var cod of this.info) {
            this.codigo = cod.codigo;
        }
    }
    private ValidarForm() {//se realiza la validacion de los campos  que cumpla los parametro de longitud establecidos
        return this.formBuilder.group({
            contrasena: ['', [Validators.required, Validators.minLength(6)]],
            contrasena1: ['', [Validators.required, Validators.minLength(6)]],
            contrasena2: ['', [Validators.required, Validators.minLength(6)]],
        });
    }
    CambioClave() {
        let info = {//se  crea el json  para poder enviar los parametros por POST
            codigo: this.codigo,
            contrasena: this.myForm.value.contrasena
        }
        this.respuesta = this.ConectServ.Validar_user(info);
        this.respuesta.subscribe(data => {
            this.respuesta = data;
            if (this.respuesta != null) {
                let info = {
                    codigo: this.codigo,
                    contrasena: this.myForm.value.contrasena1
                }
                this.respuesta = this.ConectServ.Cambio_Clave(info);
                this.respuesta.subscribe(data => {
                    this.respuesta = data;
                    if (this.respuesta.sucess == "ok") {// se verifica la respuesta del Query 
                        this.mensaje("Se cambio la contraseña con exito");
                        this.navCtrl.setRoot(PrincipalPage, {info: this.info});// se envia a la pantalla principal
                    } else {
                        this.mensaje("No se pudo cambiar la contraseña");
                        this.myForm.reset();
                    }
                });
            } else {
                this.mensaje("No se pudo cambiar la contraseña");
                this.myForm.reset()
            }
        });
    }
    validacion() {// esta funcion verifica que los dos campos tenga el mismo contenido
        if (this.myForm.value.contrasena1 == this.myForm.value.contrasena2) {
            this.CambioClave();
        } else {
            this.mensaje("Los campos nueva contraseña no coinciden");
        }
    }
    mensaje(mensaje) {// se crea una funcion para enviar los mensajes
        let toast = this.toastCtrl.create({
            message: mensaje,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
}