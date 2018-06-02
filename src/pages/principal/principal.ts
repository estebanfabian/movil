import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConsultarPage} from '../consultar/consultar';
import {MisReservasPage} from '../mis-reservas/mis-reservas';
import {HomePage} from '../home/home';


@IonicPage()
@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html',
})
export class PrincipalPage {

    info;
    public ocultar: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams) {
        this.info = navParams.get("info");
    }
    listar() {

        this.ocultar = !this.ocultar;
    }

    consultar() {

        this.navCtrl.push(ConsultarPage, {info: this.info});
    }
    Mis_Reservas() {
        this.navCtrl.push(MisReservasPage, {info: this.info});
    }
    Ir_Home() {
        this.navCtrl.setRoot(HomePage);
    }
    Multas(){
        
    }
    Modificar(){
        
    }
}





