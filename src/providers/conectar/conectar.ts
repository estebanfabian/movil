import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ConectarProvider {
    constructor(public http: HttpClient) {
    }
    url = 'http://192.168.0.15/biblioteca/'// 
    //url = 'http://192.168.0.11/biblioteca/'// 
    //url = 'http://192.168.0.21/'// servi
    options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    Insertar_tabla(dataJSON) {
        var url = this.url + 'Insert_user';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Validar_user(dataJSON) {
        var url = this.url + 'Validar';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Id(dataJSON) {

        var url = this.url + 'tablaXid';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Titulo(dataJSON) { 
        var url = this.url + 'tablaXtitulo';
           return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Autor(dataJSON) {
        var url = this.url + 'tablaXautor';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Tema(dataJSON) {
        var url = this.url + 'tablaXtema';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Editorial(dataJSON) {
        var url = this.url + 'tablaXEditorial';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Facultad(dataJSON) {
        var url = this.url + 'tablaXFacultad';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Olvido_Contra(dataJSON) {
        var url = this.url + 'Correo';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_portada(dataJSON) {
        var url = this.url + 'Portada';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Reservar_libro(dataJSON) {
        var url = this.url + 'reserva';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Actualizar_Foto(dataJSON) {
        var url = this.url + 'Act_fot';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Contar_reser(dataJSON) {
        var url = this.url + 'Conta_res';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Traer_Tarje(dataJSON) {
        var url = this.url + 'Tarjeta';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Eliminar_reser(dataJSON) {
        var url = this.url + 'Suprimir';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    mod_usuario(dataJSON) {
        var url = this.url + 'Modificar_usuario';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    mostrar_usuario(dataJSON) {
        var url = this.url + 'Most_usuario';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
    Mis_Multas(dataJSON) {
        var url = this.url + 'multas';
        return this.http.post(url, JSON.stringify(dataJSON), this.options)
    }
}