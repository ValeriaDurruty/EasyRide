import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharterService } from '../../services/charter.service';
import { ModeloService } from '../../services/modelo.service';
import { MarcaService } from '../../services/marca.service';
import { Charter } from '../../interfaces/charter.interface';
import { Modelo } from '../../interfaces/modelo.interface';
import { Marca } from '../../interfaces/marca.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-agregar-charter',
  templateUrl: './agregar-charter.component.html',
  styleUrls: ['./agregar-charter.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class AgregarCharterComponent implements OnInit {
  modelos: Modelo[] = [];
  marcas: Marca[] = [];
  form: FormGroup;
  maxYear: number;
  FK_empresa: number = 0;

  constructor(private fb: FormBuilder, 
    private router:Router,
    private _charterService : CharterService, 
    private _modeloService: ModeloService,
     private _marcaService: MarcaService,
     private _snackBar: MatSnackBar,
     private route: ActivatedRoute,
    private _empresaService:EmpresaService) {
    this.maxYear = new Date().getFullYear();
    this.form = this.fb.group({

      //[patenteAsyncValidator(this._charterService)] iria en patente si queres el validador
      patente: ['', [
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(7),
        Validators.pattern('^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$')
      ]],
      capacidad: [null, [Validators.required, Validators.min(1), Validators.max(25)]],
      anio: [null, [Validators.required, Validators.min(this.maxYear-10), Validators.max(this.maxYear)]],
      modelo: ['', Validators.required],
      marca: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.FK_empresa = this._empresaService.getEmpresaId() ?? 0;

    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
      // Manejar el caso donde FK_empresa es 0 o no está disponible
      this.mensaje('No se pudo obtener el ID de la empresa.'); // Mensaje de error al usuario
      return; // Salir del método si no hay un ID válido
    }

    this._marcaService.getMarcas().subscribe(data => {
      this.marcas = data;
    });

    // Detectar cambios en la selección de marca
    this.form.get('marca')?.valueChanges.subscribe((marcaId: number) => {
      console.log(marcaId);
      this.cargarModelosPorMarca(marcaId);
    });
  }

  // Método para convertir el texto de patente a mayúsculas automáticamente
  onInputChange(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false }); // Convierte a mayúsculas
    }
  }

  cargarModelosPorMarca(marcaId: number): void {
    this._modeloService.getModelosXMarca(marcaId).subscribe(data => {
      console.log(marcaId);
      
      if (Array.isArray(data) && data.length > 0) {
        this.modelos = data; // Asignar los modelos si existen
      } else if (typeof data === 'string')  {
        this.mensaje(data);
        this.modelos = []; // Si no hay modelos, establecer un array vacío
      }
    }, error => {
      console.error('Error al cargar los modelos', error);
      this.mensaje('Error al cargar los modelos.');
      this.modelos = []; // En caso de error, manejar el select y mensaje adecuadamente
    });
  }

  addCharter() {
    if (this.form.invalid) {
      console.error('Formulario inválido');
      this.mensaje('Por favor, corrige los errores en el formulario');
      return;
    }
  
    const charter: Charter = {
      patente: this.form.value.patente,
      capacidad: +this.form.value.capacidad,
      anio: this.form.value.anio,
      FK_Empresa: this.FK_empresa,
      FK_Modelo: this.form.value.modelo,
    };
  
    this._charterService.addCharter(charter).subscribe({
      next: () => {
        console.log('Charter agregado con éxito');
        // Resetear solo los campos necesarios
        this.form.reset({
          marca: this.form.value.marca  // Mantener el valor actual de 'marca'
        });
        this.router.navigate(['/V-empresa'], { queryParams: { tab: 'tab2' } });
        this.mensaje('Charter agregado con éxito');
      },
      error: (error) => {
        if (error.status === 400) {
          console.error('La patente ya está registrada');
          this.mensaje('La patente ya está registrada');
        } else {
          console.error('Error al agregar el charter', error);
          this.mensaje('Error al agregar el charter');
        }
        this.form.controls['patente'].reset();
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