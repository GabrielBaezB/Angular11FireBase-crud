import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';
  

  constructor(private fb: FormBuilder, 
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
      this.createEmpleado = this.fb.group({
        name:['', Validators.required],
        last:['', Validators.required],
        document:['', Validators.required],
        salary:['', Validators.required]
      })
      this.id = this.aRoute.snapshot.paramMap.get('id');
      console.log(this.id);
   }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarEmpleado(){
    this.submitted = true;

    if(this.createEmpleado.invalid){
      return;
    }
    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }
  
  }

  agregarEmpleado(){
    const empleado: any = {
      name: this.createEmpleado.value.name,
      last: this.createEmpleado.value.last,
      document: this.createEmpleado.value.document,
      salary: this.createEmpleado.value.salary,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
this._empleadoService.agregarEmpleado(empleado).then(() =>{
  this.toastr.success('El empleado fue registrado', 'Empleado Registrado', {
    positionClass : 'toast-bottom-right'
  });
  this.loading = false;
  this.router.navigate(['/list-empleados']);
}).catch(error => {
  console.log(error);
  this.loading = false;
})
 
  }

  editarEmpleado(id: string){

     const empleado: any = {
      name: this.createEmpleado.value.name,
      last: this.createEmpleado.value.last,
      document: this.createEmpleado.value.document,
      salary: this.createEmpleado.value.salary,
      fechaActualizacion: new Date()
    }
       this.loading = true;
    this._empleadoService.actualizarEmpleado(id, empleado).then(() => {
      this.loading = false;
      this.toastr.info('El empleado fue modificado con exito', 'Empleado Modificado', {
        positionClass: 'toast-bottom-right'
      })
       this.router.navigate(['/list-empleados']);
    })

  }

  esEditar(){
    this.titulo = 'Editar Empleado'
    if(this.id !== null){
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data =>{
        this.loading = false;
        // console.log(data.payload.data()['name']); para verificar los datos en la consola
        this.createEmpleado.setValue({
          name: data.payload.data()['name'],
          last: data.payload.data()['last'],
          document: data.payload.data()['document'],
          salary: data.payload.data()['salary'],
        })
      })
    }
  }

}
