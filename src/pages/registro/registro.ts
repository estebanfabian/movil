import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from 'ionic-angular';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {HomePage} from '../home/home';


@IonicPage()
@Component({
    selector: 'page-registro',
    templateUrl: 'registro.html',
})
export class RegistroPage {
    myForm: FormGroup;

    foto;
    infor;
    respuesta;



    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public ConectServ: ConectarProvider,
        private toastCtrl: ToastController,
        private camera: Camera,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController) {
        this.foto = "assets/imgs/icono_foto.png";
        this.myForm = this.ValidarForm();
    }



    private ValidarForm() {
        return this.formBuilder.group({
            nombre: ['', [Validators.required, Validators.pattern('[a-zA-Zñ]*'), Validators.minLength(3)]],
            apellido: ['', [Validators.required, Validators.pattern('[a-zA-Zñ]*'), Validators.minLength(3)]],
            codigo: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(10)]],
            telefonoPrincipal: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
            direccion: ['', [Validators.required]],
            fechaNacimiento: ['', [Validators.required]],
            sexo: ['', [Validators.required]],
            emailPrincipal: ['', [Validators.required, Validators.email]],
            contrasena: ['', [Validators.required, Validators.minLength(6)]],

        });
    }


    Insertar() {
        let info = {

            nombre: this.myForm.value.nombre,
            apellido: this.myForm.value.apellido,
            codigo: this.myForm.value.codigo,
            telefonoPrincipal: this.myForm.value.telefonoPrincipal,
            direccion: this.myForm.value.direccion,
            fechaNacimiento: this.myForm.value.fechaNacimiento,
            sexo: this.myForm.value.sexo,
            emailPrincipal: this.myForm.value.emailPrincipal,
            contrasena: this.myForm.value.contrasena,
            foto: this.foto
        }


        this.respuesta = this.ConectServ.Insertar_tabla(info);

        this.respuesta.subscribe(data => {

            this.respuesta = data;

            if (this.respuesta.sucess == "ok") {
                
                if (info.foto=="assets/imgs/icono_foto.png"){
                   let toast = this.toastCtrl.create({
                    message: 'El usuario ha sido registrado Satisfactoriamente',
                    duration: 5000,
                    position: 'bottom'

                });
                toast.present(); 
                 this.navCtrl.setRoot(HomePage);
                }
                else{
                   this.SubirSer(); 
                }
                
            }
            else if (this.respuesta.sucess == "no") {
                let toast = this.toastCtrl.create({
                    message: 'El usuario no se ha podido registrar en nuestras base de datos',
                    duration: 5000,
                    position: 'bottom'

                });
                toast.present();
            }

        }, err => {
            console.error(err);
            let toast = this.toastCtrl.create({

                message: 'Error consulte al administrador',
                duration: 5000,
                position: 'bottom'

            });
            toast.present();
        });

    }


    ActivarCAM() {
        let options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
        }
        this.camera.getPicture(options)
            .then(imageData => {
                this.foto = `data:image/jpeg;base64,${imageData}`;


            })
            .catch(error => {
                console.error(error);
            });
    }

    BuscarSD() {
        let options: CameraOptions = {
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 500,
            targetHeight: 500,
            quality: 100
        }
        this.camera.getPicture(options)
            .then(imageData => {
                this.foto = imageData;

            })
            .catch(error => {
                console.error(error);
            });
    }



    SubirSer() {

        let loader = this.loadingCtrl.create({
            content: "Registrando su informacion..."
        });
        loader.present();

        const fileTransfer: FileTransferObject = this.transfer.create();
        var random = Math.floor(Math.random() * 1000000);
        let options: FileUploadOptions = {
            fileKey: 'photo',
            fileName: "http://192.168.0.10/BibliotecaClienteServidor/img/usuario/foto_" + random + ".jpg",
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            httpMethod: 'POST',

        }


        fileTransfer.upload(this.foto, 'http://192.168.0.10/BibliotecaClienteServidor/Foto', options)
            .then((data) => {
                let datos = {
                    codigo: this.myForm.value.codigo,
                    foto: options.fileName
                };
                this.respuesta = this.ConectServ.Actualizar_Foto(datos);
                this.respuesta.subscribe(data => {

                   
                loader.dismiss();
                let toast = this.toastCtrl.create({
                    message: 'El usuario ha sido registrado Satisfactoriamente',
                    duration: 5000,
                    position: 'bottom'

                });
                toast.present();

                this.navCtrl.setRoot(HomePage);

            }, (err) => {
                loader.dismiss();


            });
    });
    }


}
