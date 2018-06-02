import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular';
import * as moment from 'moment';
import {PrincipalPage} from '../principal/principal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@IonicPage()
@Component({
    selector: 'page-reserva',
    templateUrl: 'reserva.html',
})
export class ReservaPage {
    lista;
    respuesta;
    img;
    fecha1;
    fecha2;
    info;
    codigo;
    cont;
    myForm: FormGroup;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ConectServ: ConectarProvider,
        public toastCtrl: ToastController,
        public formBuilder: FormBuilder) {
        this.lista = navParams.get("lista");
        this.info = navParams.get("info");
        this.myForm = this.ValidarForm();
        this.respuesta = this.ConectServ.Traer_portada(this.lista);
        this.respuesta.subscribe(data => {
            if (data.length == 0) {
                let toast = this.toastCtrl.create({
                    message: "Error consulte  administrador",
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            } else {
                this.img = data;
            }
        }, err => {
       
            let toast = this.toastCtrl.create({
                message: "Error consulte  administrador",
                duration: 3000,
                position: 'bottom'
            });

            toast.present();
        });
        this.fecha1 = moment().format('YYYY/MM/DD hh:mm:ss');
        
    }

    
       
   
    private ValidarForm() {
        return this.formBuilder.group({
            dias: ['', [Validators.required]],
        });
    }

    calcular_dias() {


        if (this.myForm.value.dias == "1") {
            this.fecha2 = moment(this.fecha1).add(1, "days").format('YYYY/MM/DD hh:mm:ss');
            if (moment(this.fecha2).format("dddd") == "Sunday") {
                this.fecha2 = moment(this.fecha1).add(2, "days").format('YYYY/MM/DD hh:mm:ss');
            }
        }
        else if (this.myForm.value.dias == "2") {
            this.fecha2 = moment(this.fecha1).add(2, "days").format('YYYY/MM/DD hh:mm:ss');
            if (moment(this.fecha2).format("dddd") == "Sunday") {
                this.fecha2 = moment(this.fecha1).add(3, "days").format('YYYY/MM/DD hh:mm:ss');
            }
        }
        else if (this.myForm.value.dias == "3") {
            this.fecha2 = moment(this.fecha1).add(3, "days").format('YYYY/MM/DD hh:mm:ss');
            if (moment(this.fecha2).format("dddd") == "Sunday") {
                this.fecha2 = moment(this.fecha1).add(4, "days").format('YYYY/MM/DD hh:mm:ss');
            }
        }
    }


    reservar() {

        for (var cod of this.info) {
            this.codigo = cod.codigo;
        }
      
        let infor = {
            diaPrestamo: this.fecha1,
            isbn: this.lista.isbn,
            codigo: this.codigo,
            diaEntrega: this.fecha2
        }
        this.respuesta = this.ConectServ.Contar_reser(infor);

        this.respuesta.subscribe(data => {

            if (data.length == 0) {
                let toast = this.toastCtrl.create({
                    message: "Error consulte  administrador",
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
                this.navCtrl.setRoot(PrincipalPage, {info: this.info});
            } else {


                for (var conta of data) {
                    this.cont = conta.count;
                }

                if (this.cont >= "3") {

                    let toast = this.toastCtrl.create({
                        message: "Lo sentimos.Ya ha superado el limite de libros registrados",
                        duration: 5000,
                        position: 'bottom'
                    });
                    toast.present();
                    this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                }
                else {
                    this.respuesta = this.ConectServ.Reservar_libro(infor);
                    this.respuesta.subscribe(data => {

                        this.respuesta = data;

                        if (this.respuesta.sucess == "ok") {
                            let toast = this.toastCtrl.create({
                                message: 'Su libro ha sido reservado,porfavor pase a la biblioteca',
                                duration: 5000,
                                position: 'bottom'

                            });
                            toast.present();
                            this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                        }
                        else if (this.respuesta.sucess == "no") {
                            let toast = this.toastCtrl.create({
                                message: 'Su libro no fue reservado.Intentelo mas tarde',
                                duration: 5000,
                                position: 'bottom'

                            });
                            toast.present();
                            this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                        }

                    }, err => {
                        console.error(err);
                        let toast = this.toastCtrl.create({

                            message: 'Error consulte al administrador',
                            duration: 5000,
                            position: 'bottom'

                        });
                        toast.present();
                        this.navCtrl.setRoot(PrincipalPage, {info: this.info});
                    });
                }
            }
        },
            err => {
                console.error(err);
                let toast = this.toastCtrl.create({

                    message: 'Error consulte al administrador',
                    duration: 5000,
                    position: 'bottom'

                });
                toast.present();
                this.navCtrl.setRoot(PrincipalPage, {info: this.info});
            });



    }

}




