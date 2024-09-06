import { Component, OnInit } from '@angular/core';
import { CharterService } from '../../services/charter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modelo } from '../../interfaces/modelo.interface';
import { Marca } from '../../interfaces/marca.interface';
import { MarcaService } from '../../services/marca.service';
import { ModeloService } from '../../services/modelo.service';
import { ActivatedRoute } from '@angular/router'; 
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-edit-charter',
  templateUrl: './edit-charter.component.html',
  styleUrls: ['./edit-charter.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class EditCharterComponent implements OnInit{
  modelos: Modelo[] = [];
  marcas: Marca[] = [];
  form: FormGroup;
  maxYear: number;
  charterId: number | undefined;
  FK_empresa: number = 0;

  constructor(
    private _charterservice: CharterService,
    private _modeloService: ModeloService,
    private _marcaService: MarcaService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private _snackBar:MatSnackBar,
    private _empresaService: EmpresaService
  ) {

    //CHEQUEAR VALIDACION DE CAPACIDAD
    this.maxYear = new Date().getFullYear();
    this.form = this.fb.group({
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID recibido:', id); // Log para depuración
      if (id) {
        this.charterId = +id; // Convertir a número
        this.loadCharter(this.charterId);
      }
    });

    this.FK_empresa = this._empresaService.getEmpresaId() ?? 0; // Asegúrate de que sea un número

    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
      // Manejar el caso donde FK_empresa es 0 o no está disponible
    }

    this._marcaService.getMarcas().subscribe(data => {
      this.marcas = data;
    });

      // Detectar cambios en la selección de marca
      this.form.get('marca')?.valueChanges.subscribe((marcaId: number) => {
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
      // Llamar al servicio para obtener modelos filtrados por marca
      this._modeloService.getModelosXMarca(marcaId).subscribe(data => {
        this.modelos = data;
      }, error => {
        console.error('Error al cargar los modelos', error);
        this.mensaje('Error al cargar los modelos.');
      });
    };

  loadCharter(id: number) {
    this._charterservice.getCharter(id).subscribe((charter: any) => {
      console.log('Datos del charter:', charter);  // Verifica que `charter` contenga el campo `marca`
  
      this.form.patchValue({
        patente: charter.patente || '',
        capacidad: charter.capacidad || null,
        anio: charter.anio || null,
        modelo: charter.FK_Modelo || '',
        marca: charter.FK_Marca || ''  // Verifica el valor de `charter.marca`
      });
      console.log('Formulario después de patchValue:', this.form.value);
    });
  }

  //ANDA TODO
  updateCharter() {
    // Verifica si el formulario es válido
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.errors);
      this.mensaje('Por favor, complete todos los campos'); 
      // Para depuración
      return;
    }

    // Construye el objeto para enviar al backend
    const charter: any = {
      patente: this.form.value.patente,     // Valor del campo patente
      capacidad: this.form.value.capacidad, // Valor del campo capacidad
      anio: this.form.value.anio,           // Valor del campo año
      FK_Modelo: this.form.value.modelo,    // Valor del campo modelo (debe ser FK_Modelo en backend)
      FK_Empresa: this.FK_empresa                        // Asegúrate de incluir el ID correcto de la empresa
    };

    // Llama al servicio para actualizar el charter
    this._charterservice.editCharter(this.charterId!, charter).subscribe({
      next: () => {
        this.mensaje('Charter editado con éxito');
        // Puedes redirigir o mostrar un mensaje de éxito aquí
        this.router.navigate(['/V-empresa'], { queryParams: { tab: 'tab2' } });
      },
      error: (err) => {
        if (err.status === 400) {
          console.error('La patente ya está registrada');
          this.mensaje('La patente ya está registrada');
        } else {
          this.mensaje('Error al editar charter'); // Maneja errores aquí
          console.error('Error al editar charter:', err); // Maneja errores aquí
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