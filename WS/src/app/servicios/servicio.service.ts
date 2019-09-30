
import { Injectable } from '@angular/core';
import {xmlToJson} from './lib';
import { Servis } from '../model/servis';

@Injectable()
export class ServicioService {
  serv: Servis = new Servis (
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  );
  serviciosCopia:any=[];
  servicios:any=[];


  constructor() {
    console.log("Servicio listo para usar!!!");
    this.getServiciosJSON().then(res => {
      this.serviciosCopia = res;
      this.servicios = res;
      console.log(this.servicios);
    });
  }

  getServicios(){
    return this.servicios;
  }

  crearServicio(registerForm,base64data,ext,tipo){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://whatsmusic.pythonanywhere.com/soap/', true);
    let sr='';
    if(tipo === 'Alimentacion'){
      console.log("si");
      sr='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:djan="django.soap.service" xmlns:ser="servicios.soapServices">'+
      '<soapenv:Header/>'+
     '<soapenv:Body>'+
         '<djan:createServicioAlimentacion>'+
            '<!--Optional:-->'+
            '<djan:servicio>'+
               '<ser:nombre>'+registerForm.value.nombres+'</ser:nombre>'+
               '<ser:pais>'+registerForm.value.pais+'</ser:pais>'+
               '<ser:ciudad>'+registerForm.value.ciudad+'</ser:ciudad>'+
               '<ser:idioma>'+registerForm.value.idioma+'</ser:idioma>'+
               '<ser:costo>'+registerForm.value.costo+'</ser:costo>'+
               '<ser:descripcion>'+registerForm.value.descripcion+'</ser:descripcion>'+
               '<ser:foto>'+base64data+'</ser:foto>'+
               '<ser:tipo>'+ext+'</ser:tipo>'+
               '<ser:numeroPersonas>'+registerForm.value.numeropersonas+'</ser:numeroPersonas>'+
               '<ser:nombreProveedor>'+'pepe@gmail.com'+'</ser:nombreProveedor>'+
               '<ser:tipoComida>'+registerForm.value.tipocomida+'</ser:tipoComida>'+
               '<ser:cantidadPlatos>'+ registerForm.value.cantidadplatos+'</ser:cantidadPlatos>'+
            '</djan:servicio>'+
         '</djan:createServicioAlimentacion>'+
      '</soapenv:Body>'+
   '</soapenv:Envelope>';
    }else if(tipo === 'Transporte'){

      sr='';
    }else{

    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
              alert("Se creó el servicio correctamente");
            }
      }
    }
    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
  }


  async getServiciosJSON(){
    return new Promise(resolve => {
      setTimeout(() => {

        var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://whatsmusic.pythonanywhere.com/soap/', true);
    let sr= '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:djan="django.soap.service">'+
          '<soapenv:Header/>'+
          '<soapenv:Body>'+
            '<djan:getServiciosAlimentaicon/>'+
          '</soapenv:Body>'+
      '</soapenv:Envelope>';
    var y = this;
    let data;
    xmlhttp.onreadystatechange =  function () {
     if (xmlhttp.readyState == 4) {
         if (xmlhttp.status == 200) {
             var doc =  xmlToJson(xmlhttp.responseXML);
             console.log(doc);
             data=doc['soap11env:Envelope']['soap11env:Body']['tns:getServiciosAlimentaiconResponse']['tns:getServiciosAlimentaiconResult']['s0:AlimentacionRes'];
             console.log(data);
             let serviciosCopia=[];
             if(data.length === undefined && data!==undefined){
                  let serv = new Servis (
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                  );
                  console.log(data['s0:nombre']['#text']);
                  serv.nombre= data['s0:nombre']['#text'];
                  serv.descripcion=data['s0:descripcion']['#text'];
                  serv.costo=+data['s0:costo']['#text'];
                  let inf= data['s0:foto']['#text'];
                  serv.img="data:image/"+data['s0:tipo']['#text']+";base64, "+inf.slice(2,inf.length-1);
                  serv.idx=data['s0:id']['#text'];
                  serv.pais=data['s0:pais']['#text'];
                  serv.ciudad=data['s0:ciudad']['#text'];
                  serv.tipo="Alimentacion";
                  serviciosCopia.push(serv);
                  resolve(serviciosCopia);
             }else if(data!==undefined){

                data.forEach(element => {
                  let serv = new Servis (
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                  );
                  console.log(element['s0:nombre']['#text']);
                  serv.nombre= element['s0:nombre']['#text'];
                  serv.descripcion=element['s0:descripcion']['#text'];
                  serv.costo=+element['s0:costo']['#text'];
                  let inf= element['s0:foto']['#text'];
                  serv.img="data:image/"+element['s0:tipo']['#text']+";base64, "+inf.slice(2,inf.length-1);
                  serv.idx=element['s0:id']['#text'];
                  serv.pais=element['s0:pais']['#text'];
                  serv.ciudad=element['s0:ciudad']['#text'];
                  serv.tipo="Alimentacion";
                  serviciosCopia.push(serv);
                  resolve(serviciosCopia);
            });
          }
        }
     }
   }
   xmlhttp.setRequestHeader('Content-Type', 'text/xml');
   xmlhttp.send(sr);
      }, 1500);
    });

  }
  getServicioJSON(id){

    this.getServiciosJSON().then(res => {
      this.serviciosCopia = res;
      this.servicios = res;
      console.log(this.servicios);

  });
  }

  getServicio( idx: string ){
    return this.servicios[idx];
  }

  buscarServicios( termino:string ):Servi[]{

    let serviciosArr:Servi[] = [];
    termino = termino.toLowerCase();

    for( let i = 0; i < this.servicios.length; i ++ ){

      let servicio = this.servicios[i];

      let nombre = servicio.nombre.toLowerCase();

      if( nombre.indexOf( termino ) >= 0  ){
        servicio.idx = i;
        serviciosArr.push( servicio )
      }

    }

    return serviciosArr;

  }


}


export interface Servi{
  nombre: string;
  pais: string;
  ciudad:string;
  descripcion:string;
  tipo:string;
  costo:number;
  img: string;
  idx?: number;
  opiniones:Opinion[];
};

export interface Opinion{
  nombre:string;
  comentario:string;
  calificacion:number;
}
