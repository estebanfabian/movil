import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegistroPage} from '../registro/registro'
import {PrincipalPage} from '../principal/principal'
import {OlvidarContraPage} from '../olvidar-contra/olvidar-contra'
import {ToastController} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    form: FormGroup;
    respuesta;
    info;
    constructor(
        public navCtrl: NavController,
        public formBuilder: FormBuilder,
        public ConectServ: ConectarProvider,
        private toastCtrl: ToastController) {
        this.form = this.ValidarForm();
    }
    private ValidarForm() {//se realiza la validacion de los campos  que cumpla los parametro de longitud establecidos
        return this.formBuilder.group({
            codigo: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(10)]],
            contrasena: ['', [Validators.required, Validators.minLength(6)]],
        });
    }
    ValidarUsuario() {// realiza la validacion con la base de datos para permitit el acceso a los usuario
               this.respuesta = this.ConectServ.Validar_user(this.form.value);
        this.respuesta.subscribe(data => {
            this.info = data;
            if (this.info.length == 1) {
                this.mensaje("Bienvenido señor usuario!!");
                this.navCtrl.setRoot(PrincipalPage, {info: this.info});// envia al usuario a la pantalla principal si la infomacion  login es correcta
            }
            else {
                this.mensaje("Error! El codigo o la contraseña estan mal escritas");
                this.form.reset()
            }
        }, err => {
            this.mensaje("Error Consulte al administrador");
        });
    }
    Ir_Registro() {// envia al usuario al pagina de registro
        this.navCtrl.push(RegistroPage);
    }
    Ir_Contra() {// envia al usuario al pagina de olvide contraseña
        this.navCtrl.push(OlvidarContraPage);
    }
    mensaje(mensaje) {// se crea la funcion reducuir la linea de codigo
        let toast = this.toastCtrl.create({
            message: mensaje,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
}