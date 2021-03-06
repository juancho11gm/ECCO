import { Component, OnInit, Output } from '@angular/core';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Servis } from '../../../model/servis';
import { Router, OutletContext } from '@angular/router';
import { CarritoCompras } from '../../../model/carrito-compras';
import { CarritoService } from '../../../servicios/carrito.service';
import { EventEmitter } from 'events';
import { TarjetaCarritoService } from '../../../servicios/tarjeta-carrito.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  //servicios:Servis[]=[];
  servicios;
  //total:number[]=[];
  total;
  carrito: CarritoCompras;
  // tslint:disable-next-line: max-line-length
  _subscripcion: any;
  constructor(private _SesionServicio:SesionService, private router: Router, private carritoService: CarritoService, private tarjetaCarrito: TarjetaCarritoService) { }

  ngOnInit() {
     /*this.total=this._SesionServicio.getTotal();
     this.servicios=this._SesionServicio.getServicios();*/
     /*this._subscripcion = this.tarjetaCarrito.servicios.subscribe((servicioss) => {
       this.servicios = servicioss;
     });*/

     this.servicios = this.carritoService.getCarritoServiciosByUsernameJSON(this._SesionServicio.id).then(res =>{
        this.servicios = res;
        console.log(this.servicios);
        this.total = this.carritoService.getCarritoCostoByUsernameJSON(this._SesionServicio.id).then(res2 =>{
            this.total=res2;
            console.log(this.total);
        });
    });
     
  }
  actualizarTotal(){
    //this.total=this._SesionServicio.getTotal();
  }
  quitarServicio(servicio:Servis){
    //this._SesionServicio.quitarServicio(servicio);
    //this.total=this._SesionServicio.getTotal();

    this.carritoService.removerDelCarrito(this._SesionServicio.id, servicio);
    var tot = +this.total;
    for(var i=0;i<this.servicios.length;i++) {
          if(this.servicios[i].nombre === servicio.nombre){
              this.servicios.splice(i, 1);
              tot-=servicio.costo;
              break;
          }
      }
    this.total = String(tot);
  }

  pago() {
    //create Order en el servidor
    this.router.navigate(['/pago']);
  }
}
