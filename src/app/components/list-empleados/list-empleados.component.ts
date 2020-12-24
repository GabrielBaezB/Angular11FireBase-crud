import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { element } from 'protractor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {
  empleados: any[] = [];

  constructor(private _empleadosService: EmpleadoService, private toastr: ToastrService) {
       
     }

  ngOnInit(): void {
    this.getEmpleados()
  }


  getEmpleados(){
    this._empleadosService.getEmpleados().subscribe(data =>{
      this.empleados = [];
      data.forEach((element:any)=>{
        // console.log(element.payload.doc.id); ctrl + k ctrl + c (para comentar)
        // console.log(element.payload.doc.data()); 
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.empleados);
    });
  }

 eliminarEmpleado(id:string){
   this._empleadosService.eliminarEmpleado(id).then(() =>{
      console.log('empleado eliminado con exito');
      this.toastr.error('El empleado fue eliminado con exito', 'Registro eliminado!',{
        positionClass: 'toast-bottom-right'
      });
   }).catch(error =>{
     console.log(error);
   });
 
  }
}


