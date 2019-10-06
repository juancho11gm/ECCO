import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../model/usuario';
import { DomSanitizer } from '@angular/platform-browser';
import { SesionService } from '../../servicios/sesion.service';
import { ProveedorService } from '../../servicios/proveedor.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  usuarios;
  usuariosCopia:Usuario[]=[];

  usuarioMostrar=[];

  _subscription: any;
  cambio=false;

  base64data: string;
  ext : string;
  image :string;

  url:string;

  constructor( private route: ActivatedRoute,
    private router: Router,
    private usuarioService:UsuarioService,
    private sanitization:DomSanitizer,
    private sesionService:SesionService,
    private proveedorService:ProveedorService
    ) {

    }

  ngOnInit() {
    this.user = this.sesionService.id;
    if(this.sesionService.sesion === 'usuario'){
      this.usuarioService.getUsuarioByUsernameJSON(this.user).then( res => {
        this.usuarioMostrar[0] = res;
        this.base64data=this.usuarioMostrar[0].img;
        this.ext=this.usuarioMostrar[0].tipo;
        console.log(this.usuarioMostrar);
      });
    }else{
      this.proveedorService.getProveedorByUsernameJSON(this.user).then( res => {
        this.usuarioMostrar[0] = res;
        this.base64data=this.usuarioMostrar[0].img;
        this.ext=this.usuarioMostrar[0].tipo;
        console.log(this.usuarioMostrar);
      });
    }

  }
  public getSantizeUrl() {
    this.image = "data:image/"+this.usuarioMostrar[0].tipo+";base64, "+this.usuarioMostrar[0].img;
    return this.sanitization.bypassSecurityTrustUrl(this.image);
 }

 onSelectFile(event) { // called each time file input changes
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    this.ext=event.target.files[0].type;
    reader.onload = (event) => { // called once readAsDataURL is completed
          this.base64data=btoa(reader.result as string);
          this.cambio = true;
      }
    }
  }
  normal(){
    this.image = "data:image/"+this.ext+";base64, "+this.base64data;
    return this.sanitization.bypassSecurityTrustUrl(this.image);
  }

  actualizar(){
    if(this.sesionService.sesion === 'usuario'){
        this.usuarioService.updateUsuario(this.usuarioMostrar[0],this.base64data,this.ext);

    }else{
      this.usuarioMostrar[0].password =(<HTMLInputElement>document.getElementById("password")).value;
      this.proveedorService.updateProveedor(this.usuarioMostrar[0],this.base64data,this.ext);

    }
  }

  eliminar(){
    if(this.sesionService.sesion === 'usuario'){
           this.usuarioService.borrarUsuario(this.usuarioMostrar[0].email);
                this.router.navigate(['login']);

    }else{
     this.proveedorService.borrarProveedor(this.usuarioMostrar[0].email);
     this.router.navigate(['login']);
    }
  }
}
