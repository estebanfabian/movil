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

    private ValidarForm() {
        return this.formBuilder.group({
            codigo: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(10)]],
            contrasena: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    ValidarUsuario() {

        this.respuesta = this.ConectServ.Validar_user(this.form.value);
        this.respuesta.subscribe(data => {
            this.info = data;
            console.log(data);
            if (this.info.length == 1) {
                let toast = this.toastCtrl.create({
                    message: 'Bienvenido señor usuario!!',
                    duration: 5000,
                    position: 'bottom'
                });
                toast.present();
                this.navCtrl.setRoot(PrincipalPage, {
                    info: this.info
                });
            }
            else if (this.info.length == 0) {
                let toast = this.toastCtrl.create({
                    message: 'Error! El codigo o la contraseña estan mal escritas',
                    duration: 5000,
                    position: 'bottom'
                });
                toast.present();
            }
        }, err => {
            console.log(JSON.stringify(err));
            let toast = this.toastCtrl.create({
                message: 'Error! Consulte al administrador',
                duration: 5000,
                position: 'bottom'
            });
            toast.present();
        });
    }

    Ir_Registro() {
        this.navCtrl.push(RegistroPage);
    }

    Ir_Contra() {
        this.navCtrl.push(OlvidarContraPage);
    }
}