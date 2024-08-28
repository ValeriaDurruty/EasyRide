import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { cuilAsyncValidator } from '../../validators/validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
 styleUrls: ['/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css','./add-empresa.component.css']
})
export class AddEmpresaComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
    private _empresaService : EmpresaService,
     private Router: Router,
     private _snackBar: MatSnackBar
  ){
    this.form = this.fb.group({
      razon_social: ['', [Validators.required, Validators.maxLength(30)]],
      cuil: [null, [Validators.required, Validators.min(1), Validators.max(99999999999)], [cuilAsyncValidator(this._empresaService)]], // Ajusta según el largo del CUIL
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]], // Patrón para 9 dígitos
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]]
    });
  }
  ngOnInit(): void {
    
  }

  addEmpresa(){
    if(this.form.invalid) {
      this.mensajeError('Por favor, complete todos los campos');
      return;
    }

    const empresa: Empresa = {
      razon_social: this.form.value.razon_social,
      cuil: this.form.value.cuil,
      telefono: this.form.value.telefono,
      email: this.form.value.email
    };
    console.log(empresa);

    this._empresaService.addEmpresa(empresa).subscribe({
      next: () => {
        console.log('Empresa agregada con éxito');
        this.Router.navigate(['/V-admin'], { queryParams: { tab: 'tab3' } });
        this.mensajeExito('Empresa agregada con éxito');
    },
    error: (error) => {
      if (error.status === 400) {
        console.error('El CUIL ya está registrado');
        this.mensajeError('El CUIL ya está registrado');
      } else {
        console.error('Error al agregar la empresa', error);
        this.mensajeError('Error al agregar la empresa');
      }
      this.form.controls['cuil'].reset();
    }
  });
}

mensajeExito(mensaje:string) {
  this._snackBar.open(mensaje, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['custom-snackbar']  // Es para darle estilo
  });
}

mensajeError(mensaje: string) {
  this._snackBar.open(mensaje, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['error-snackbar']  // Es para darle estilo
  });
}
}
