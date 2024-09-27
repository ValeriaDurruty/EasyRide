import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ParadaService } from '../../services/parada.service';
import { ProvinciaService } from '../../services/provincia.service';
import { LocalidadService } from '../../services/localidad.service';
import { EmpresaService } from '../../services/empresa.service';
import { Parada } from '../../interfaces/parada.interface';
import { Provincia } from '../../interfaces/provincia.interface';
import { Localidad } from '../../interfaces/localidad.interface';
import { ModalshComponent } from '../../components/modalsh/modalsh.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-parada',
  templateUrl: './add-parada.component.html',
  styleUrls: ['./add-parada.component.css', '/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class AddParadaComponent implements OnInit {

  form: FormGroup;
  FK_empresa: number = 0;
  provincias: Provincia[] = [];
  localidades: Localidad[] = [];
  isEditMode: boolean = false;
  paradaId: number | null = null; // Para identificar si es edición o no

  constructor(
    private fb: FormBuilder,
    private _paradaService: ParadaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _provinciaService: ProvinciaService,
    private _localidadService: LocalidadService,
    private _empresaService: EmpresaService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      provincia: ['', Validators.required],
      localidad: ['', Validators.required],
      coordenadas: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._provinciaService.getProvincias().subscribe(data => {
      this.provincias = data;
      console.log('Provincias recibidas:', this.provincias);
    });

    this.form.get('provincia')?.valueChanges.subscribe((provinciaId: number) => {
      if (provinciaId) {
        this.getLocalidadesPorProvincia(provinciaId);
      }
    });

    this.FK_empresa = this._empresaService.getEmpresaId() ?? 0;

    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
      this.mensaje('No se pudo obtener el ID de la empresa.');
      return;
    }

    this.route.params.subscribe(params => {
      this.paradaId = +params['id']; // Obtener el ID de la ruta, si está presente
      if (this.paradaId) {
        this.isEditMode = true;
        this.loadParada(this.paradaId); // Cargar los datos de la parada para edición
      }
    });
  }

  getLocalidadesPorProvincia(provinciaId: number): void {
    this._localidadService.getLocalidadesPorProvincia(provinciaId).subscribe(
      data => {
        this.localidades = data;
        console.log('Localidades recibidas:', this.localidades);

        // Si estamos en modo edición, establecer el valor de localidad
        if (this.isEditMode) {
          const localidadId = this.form.get('localidad')?.value;
          if (localidadId) {
            this.form.get('localidad')?.setValue(localidadId);
          }
        }
      },
      error => {
        console.error('Error al obtener localidades:', error);
        this.localidades = [];
      }
    );
  }

  validateCoordinates(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/;
    if (control.value && !regex.test(control.value)) {
      return { invalidCoordinates: true };
    }
    return null;
  }

  onInputChange(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalshComponent, {
      data: {
        tipoOperacion: 'parada', // o 'viaje' o 'parada'
        nombre: this.form.get('nombre')?.value,
        provincia: this.form.get('provincia')?.value,
        localidad: this.form.get('localidad')?.value,
        coordenadas: this.form.get('coordenadas')?.value,
        // Agrega más propiedades según el tipo de operación
      }
    });
  
    dialogRef.componentInstance.confirm.subscribe((parada) => {
      console.log('Datos de la parada confirmados:', parada); // Muestra los datos en la consola para verificar
  
      // Aquí se llama al método para agregar la empresa
      this.saveParada(parada);
    });
  }
  
  saveParada(paradaData:any): void {
    if (this.form.invalid) {
      this.mensaje('Por favor, corrige los errores en el formulario');
      return;
    }

    const parada = {
      nombre: this.form.value.nombre,
      coordenadas: this.form.value.coordenadas,
      FK_Localidad: Number(this.form.value.localidad),
      FK_Empresa: this.FK_empresa
    };

    if (this.isEditMode && this.paradaId) {
      // Llamar al método de edición del servicio
      this._paradaService.updateParada(this.paradaId, parada).subscribe({
        next: () => {
          this.mensaje('Parada actualizada con éxito');
          this.router.navigate(['/V-empresa'], { queryParams: { tab: 'tab3' } });
        },
        error: (err) => {
          console.error('Error al actualizar la parada', err);
          this.mensaje('Error al actualizar la parada');
        }
      });
    } else {
      // Llamar al método de adición del servicio
      this._paradaService.AddParada(parada).subscribe({
        next: () => {
          this.mensaje('Parada agregada con éxito');
          this.router.navigate(['/V-empresa'], { queryParams: { tab: 'tab3' } });
        },
        error: (err) => {
          console.error('Error al agregar la parada', err);
          this.mensaje('Error al agregar la parada');
        }
      });
    }
  }

  loadParada(id: number): void {
    this._paradaService.getParadaById(id).subscribe({
      next: (data) => {
        // Mostrar los datos recibidos en la consola
        console.log('Datos recibidos:', data);
  
        // Verificar los valores que se van a establecer en el formulario
        console.log('Provincia recibida:', data.PK_Provincia);
        console.log('Localidad recibida:', data.FK_Localidad);
  
        // Actualizar el formulario con los datos recibidos
        this.form.patchValue({
          nombre: data.parada,
          coordenadas: data.coordenadas,
          provincia: data.PK_Provincia, 
          localidad: data.FK_Localidad 
        });
  
        // Mostrar el formulario después de patchValue
        console.log('Formulario después de patchValue:', this.form.value);
  
        // Cargar localidades si la provincia está definida
        if (data.PK_Provincia) {
          this.getLocalidadesPorProvincia(data.PK_Provincia);
        } else {
          // Si no hay provincia definida, vaciar las localidades
          this.localidades = [];
        }
  
        // Verificar los valores de provincia y localidad después de actualizar el formulario
        console.log('Provincia seleccionada:', this.form.get('provincia')?.value);
        console.log('Localidad seleccionada:', this.form.get('localidad')?.value);
      },
      error: (err) => {
        console.error('Error al cargar la parada', err);
      }
    });
  }


  mensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }
}
