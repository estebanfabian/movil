import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular';
import {HomePage} from '../home/home';

@IonicPage()
@Component({
    selector: 'page-olvidar-contra',
    templateUrl: 'olvidar-contra.html',
})
export class OlvidarContraPage {
    formula: FormGroup;
    respuesta;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ConectServ: ConectarProvider,
        public formBuilder: FormBuilder,
        private toastCtrl: ToastController) {
        this.formula = this.ValidarForm();
    }
    private ValidarForm() {
        return this.formBuilder.group({
            codigo: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(20)]],
            emailPrincipal: ['', [Validators.required, Validators.email]],
        });
    }

    olvido() {
        this.respuesta = this.ConectServ.Olvido_Contra(this.formula.value);
        this.respuesta.subscribe(data => {
            if (data == "ok") {
                this.mensaje("Se ha enviado a su correo registarado la contraseña");
                this.navCtrl.setRoot(HomePage);
            }
            else {
                this.mensaje("Error,el codigo o el correo no coinciden");
            }
        }, err => {
            this.mensaje("Error consulte al administrador");
        });
    }
    mensaje(mensaje) {
        let toast = this.toastCtrl.create({
            message: mensaje,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
}