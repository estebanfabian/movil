import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera, CameraOptions} from '@ionic-native/camera';

@IonicPage()
@Component({
    selector: 'page-modificar',
    templateUrl: 'modificar.html',
})
export class ModificarPage {
    info;
    codigo;
    respuesta
    lista;
    foto;
    myForm: FormGroup;
    fechaNacimiento;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public ConectServ: ConectarProvider,
        public toastCtrl: ToastController,
        public formBuilder: FormBuilder,
        private camera: Camera,
        private transfer: FileTransfer) {
        this.myForm = this.ValidarForm();
        this.info = navParams.get("info");
        for (var cod of this.info) {
            this.codigo = cod.codigo;
        }
        let infor = {
            codigo: this.codigo
        }

        this.respuesta = this.ConectServ.mostrar_usuario(infor);
        this.respuesta.subscribe(data => {
            this.lista = data;
            console.log(this.lista)
            for (var fech of this.lista) {
                this.fechaNacimiento = fech.fechaNacimiento;
            }
           

        }, err => {
            console.log(err);
        });

    }

    private ValidarForm() {
        return this.formBuilder.group({
            nombre: ['', [Validators.required, Validators.pattern('[a-zA-Zñ]*'), Validators.minLength(3)]],
            apellido: ['', [Validators.required, Validators.pattern('[a-zA-Zñ]*'), Validators.minLength(3)]],
            codigo: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(10)]],
            telefonoPrincipal: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
            direccion: ['', [Validators.required]],
            fechaNacimiento: [this.fechaNacimiento, [Validators.required]],
            sexo: ['', [Validators.required]],
            emailPrincipal: ['', [Validators.required, Validators.email]],
            contrasena: ['', [Validators.required, Validators.minLength(6)]],

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

}
