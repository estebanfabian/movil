import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {ConectarProvider} from '../../providers/conectar/conectar';
import {ToastController} from 'ionic-angular'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PrincipalPage} from '../principal/principal'

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
    cambio = 1;
    nombre;
    myForm: FormGroup;
    fechaNacimiento;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public ConectServ: ConectarProvider,
        public toastCtrl: ToastController,
        public formBuilder: FormBuilder,
        private camera: Camera,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController) {
        this.myForm = this.ValidarForm();
        this.info = navParams.get("info");

        for (var cod of this.info) {
            this.codigo = cod.codigo;
            this.nombre = cod.nombre;
        }
        let infor = {
            codigo: this.codigo
        }
        this.respuesta = this.ConectServ.mostrar_usuario(infor);
        this.respuesta.subscribe(data => {
            this.lista = data;
            for (var usuario of this.lista) {
                this.foto = usuario.foto;
                this.fechaNacimiento = usuario.fechaNacimiento;
            }
            console.log(this.fechaNacimiento);
        }, err => {
            console.log(err);
        });
    }

    private ValidarForm() {
        return this.formBuilder.group({// se realiza la validacion según los datos 
            nombre: ['', [Validators.required, Validators.pattern('[a-zA-Zñ]*'), Validators.minLength(3)]],
            apellido: ['', [Validators.required, Validators.pattern('[a-zA-Zñ]*'), Validators.minLength(3)]],
            codigo: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(10)]],
            telefonoPrincipal: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
            direccion: ['', [Validators.required]],
            fechaNacimiento: [this.fechaNacimiento, [Validators.required]],
            emailPrincipal: ['', [Validators.required, Validators.email]],

        });
    }

    ActivarCAM() {// se realiza la funcio para poder acceder a la camara del dispositivo
        let options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
        }
        this.camera.getPicture(options)
            .then(imageData => {
                this.foto = `data:image/jpeg;base64,${imageData}`;
                this.cambio = 0;
            })
            .catch(error => {
                this.mensaje('Error al activar la camara');
            });
    }
    BuscarSD() {// se realiza la funcion para poder ingresar a la SD si el usuario lo desea
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
                this.cambio = 0;
            })
            .catch(error => {
                this.mensaje('Erro al carga imagen de la SD');
            });
    }
    SubirSer() {
        let loader = this.loadingCtrl.create({
            content: "Actualizando su informacion..."
        });
        loader.present();
        if (this.cambio == 0) {// si el usuario cambio la foto hace la subida de la nueva foto
            const fileTransfer: FileTransferObject = this.transfer.create();
            var random = Math.floor(Math.random() * 1000000);
            let options: FileUploadOptions = {
                fileKey: 'photo',
                fileName: "http://192.168.0.15/biblioteca/img/usuario/foto_" + random + ".jpg",//mirar  como hacer para no subir la direcion por si se cambia el servidor
                chunkedMode: false,
                mimeType: "image/jpeg",
                headers: {},
                httpMethod: 'POST',
            }

            fileTransfer.upload(this.foto, 'http://192.168.0.15/biblioteca/Foto', options)
                .then((data) => {
                    let datos = {
                        codigo: this.myForm.value.codigo,
                        nombre: this.nombre,
                        foto: options.fileName
                    };

                    this.respuesta = this.ConectServ.Actualizar_Foto(datos);
                    this.respuesta.subscribe(data => {
                        loader.dismiss();
                        this.mensaje('Su información se ha Actualizado satisfactoriamente');
                        this.paginaPrincipal(datos);

                    }, (err) => {
                        loader.dismiss();
                    });
                });
        } else {
            let info = {
                codigo: this.myForm.value.codigo,
                nombre: this.nombre,
                foto: this.foto
            }
            loader.dismiss();
            this.mensaje('Su información se ha Actualizado satisfactoriamente');
            this.paginaPrincipal(info);
        }
    }
    Modificar() {// se realiza la funcion para modificar los datos que sea necesitados del usuario
        let info = {
            codigo: this.myForm.value.codigo,
            telefonoPrincipal: this.myForm.value.telefonoPrincipal,
            direccion: this.myForm.value.direccion,
            emailPrincipal: this.myForm.value.emailPrincipal,
            foto: this.foto
        }
        this.respuesta = this.ConectServ.mod_usuario(info);
        this.respuesta.subscribe(data => {
            this.respuesta = data;
            if (this.respuesta.sucess == "ok") {
                if (info.foto == "assets/imgs/icono_foto.png") {
                    this.mensaje('Su información se ha Actualizado satisfactoriamente');
                    this.paginaPrincipal(info);
                }
                else {
                    this.SubirSer();
                }
            }
            else {
                this.mensaje('El usuario no se ha podido registrar en la  base de datos');
            }
        }, err => {
            this.mensaje('Error consulte al administrador');
        });
    }
    mensaje(respuesta) {// se crea la funcion reducuir la linea de codigo al momento de imprimir mensajes
        let toast = this.toastCtrl.create({
            message: respuesta,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
    paginaPrincipal(info) {// esta funciona se hace para que el cambio de la foto se hag de manera inmediata
        var pluginArrayArg = new Array();
        pluginArrayArg.push(info);
        var myString = JSON.stringify(pluginArrayArg);
        var obj = JSON.parse(myString);
        this.info = obj;
        this.navCtrl.setRoot(PrincipalPage, {info: this.info});
    }
}