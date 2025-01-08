import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cuitAsyncValidator, cuitValidator } from '../../validators/validators';

@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
  styleUrls: ['./edit-empresa.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class EditEmpresaComponent implements OnInit{
  form: FormGroup;
  empresaId: number | undefined;

  constructor(private _empresaService: EmpresaService, 
    private route: ActivatedRoute,
    private router:Router,
    private _snackBar:MatSnackBar, private fb: FormBuilder){
    
      this.form = this.fb.group({
      razon_social: ['', [Validators.required, Validators.maxLength(30)]],
      cuit: ['', [Validators.required, cuitValidator],[cuitAsyncValidator(this._empresaService)]], // Pasar la ID actual para no validar contra sí misma  
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]], // Patrón para 9 dígitos
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      alias:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,20}$')]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.empresaId = +id; // Convertir a número
        this.loadEmpresa(this.empresaId);
      }
    });    
  }

  loadEmpresa(id: number){
    this._empresaService.getEmpresa(id).subscribe((empresa: any) => {
      //console.log(empresa);
      this.form.patchValue({
        razon_social: empresa.razon_social,
        cuit: empresa.cuit,
        telefono: empresa.telefono,
        email: empresa.email,
        alias:empresa.alias
      });
    });
  }

  updateEmpresa() {
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.errors); 
      this.mensaje('Por favor, corrige los errores en el formulario');
      return;
    }
  
    const empresa = {
      razon_social: this.form.value.razon_social,
      cuit: this.form.value.cuit,
      telefono: this.form.value.telefono,
      email: this.form.value.email,
      alias:this.form.value.alias
    };
  
    this._empresaService.editEmpresa(this.empresaId!, empresa).subscribe({
      next: () => {
        console.log('Empresa editada con éxito');
        this.router.navigate(['/V-admin'], { queryParams: { tab: 'tab3' } });
        this.mensaje('Empresa editada con éxito');
      },
      error: (error) => {
        console.error('Error al editar la empresa:', error);
        if (error.status === 400) {
          this.mensaje('El CUIT ya está registrado');
          this.form.controls['cuit'].reset();
        } else {
          this.mensaje('Error al editar la empresa');
          this.form.controls['cuit'].reset();  // Solo restablecer en otros errores
        }
      }
    });
  }

mensaje(mensaje: string): void {
  this._snackBar.open(mensaje, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
}

}