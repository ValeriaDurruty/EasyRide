import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { cuitAsyncValidator, cuitValidator, validarCuit } from '../../validators/validators';
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
      cuit:['', [Validators.required, cuitValidator], [cuitAsyncValidator(this._empresaService)]], // Ajusta según el largo del CUIT
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]], // Patrón para 9 dígitos
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]]
    });
  }
  ngOnInit(): void {
    
  }

  addEmpresa(){
   
    if(this.form.invalid) {
      this.mensaje('Por favor, corrige los errores en el formulario');
      return;
    } 
    const cuitValue = this.form.value.cuit;  // Capturamos el valor del CUIT
    console.log('Valor de CUIT ingresado:', cuitValue);  // Agrega el log para ver qué se captura
  
    // Validación del CUIT (puedes usar la función validarCUIT aquí si es necesario)
    if (!validarCuit(cuitValue)) {
      console.log('CUIT inválido:', cuitValue);
      this.mensaje('El CUIT no es válido');
      return;
    }
    const empresa: Empresa = {
      razon_social: this.form.value.razon_social,
      cuit: cuitValue,
      telefono: this.form.value.telefono,
      email: this.form.value.email
    };
    console.log(empresa);

    this._empresaService.addEmpresa(empresa).subscribe({
      next: () => {
        console.log('Empresa agregada con éxito');
        this.Router.navigate(['/V-admin'], { queryParams: { tab: 'tab3' } });
        this.mensaje('Empresa agregada con éxito');
    },
    error: (error) => {
      if (error.status === 400) {
        console.error('El CUIT ya está registrado');
        this.mensaje('El CUIT ya está registrado');
      } else {
        console.error('Error al agregar la empresa', error);
        this.mensaje('Error al agregar la empresa');
      }
      this.form.controls['cuit'].reset();
    }
  });
}

mensaje(mensaje:string) {
  this._snackBar.open(mensaje, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['custom-snackbar']  // Es para darle estilo
  });
}
}
