import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { cuitAsyncValidator, cuitValidator, validarCuit } from '../../validators/validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalshComponent } from '../../components/modalsh/modalsh.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrls: ['/src/assets/assets/css/now-ui-kit.min.css',
              '/src/assets/assets/css/bootstrap.min.css',
              '/src/assets/assets/css/now-ui-kit.css',
              './add-empresa.component.css']
})
export class AddEmpresaComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _empresaService: EmpresaService,
    private Router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      razon_social: ['', [Validators.required, Validators.maxLength(30)]],
      cuit: ['', [Validators.required, cuitValidator], [cuitAsyncValidator(this._empresaService)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {}

  openModal() {
    const dialogRef = this.dialog.open(ModalshComponent, {
      data: {
        tipoOperacion: 'empresa', // o 'viaje' o 'parada'
        razonSocial: this.form.get('razon_social')?.value,
        cuit: this.form.get('cuit')?.value,
        email: this.form.get('email')?.value,
        telefono: this.form.get('telefono')?.value,
        // Agrega más propiedades según el tipo de operación
      }
    });
  
    dialogRef.componentInstance.confirm.subscribe((empresa) => {
      console.log('Datos de la empresa confirmados:', empresa); // Muestra los datos en la consola para verificar
  
      // Aquí se llama al método para agregar la empresa
      this.addEmpresa(empresa);
    });
  }
  

  addEmpresa(empresaData: any) {
    if (this.form.invalid) {
      this.mensaje('Por favor, corrige los errores en el formulario');
      return;
    }

    const cuitValue = empresaData.cuit; // Capturamos el valor del CUIT desde empresaData
    console.log('Valor de CUIT ingresado:', cuitValue);

    if (!validarCuit(cuitValue)) {
      console.log('CUIT inválido:', cuitValue);
      this.mensaje('El CUIT no es válido');
      return;
    }

    const empresa: Empresa = {
      razon_social: empresaData.razonSocial,
      cuit: cuitValue,
      telefono: empresaData.telefono,
      email: empresaData.email
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

  mensaje(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }
}