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
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

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
  paradaId: number | null = null;

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
      coordenadas: ['', [Validators.required, this.validateCoordinates]] // Incluí la validación de coordenadas
    });
  }

  ngOnInit(): void {
    this._provinciaService.getProvincias().subscribe(data => {
      this.provincias = data;
      //console.log('Provincias recibidas:', this.provincias);
    });

    this.form.get('provincia')?.valueChanges.subscribe((provinciaId: number) => {
      if (provinciaId) {
        this.loadLocalidades(provinciaId);
      }
    });

    const storedFKEmpresa = sessionStorage.getItem('FK_empresa') || localStorage.getItem('FK_empresa');
    if (storedFKEmpresa) {
      this.FK_empresa = +storedFKEmpresa;
    } else {
      this.FK_empresa = this._empresaService.getEmpresaId() ?? 0;
      if (this.FK_empresa !== 0) {
        sessionStorage.setItem('FK_empresa', this.FK_empresa.toString());
      }
    }

    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
    }

    this.route.params.subscribe(params => {
      this.paradaId = +params['id'];
      if (this.paradaId) {
        this.isEditMode = true;
        this.loadParada(this.paradaId);
      }
    });
  }

  loadLocalidades(provinciaId: number): void {
    this._localidadService.getLocalidadesPorProvincia(provinciaId).subscribe(localidades => {
      this.localidades = localidades;
      console.log('Localidades cargadas:', this.localidades);
    });
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

  saveParada(paradaData: any): void {
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
        //console.log('Datos recibidos:', data);
  
        // Primero, establecemos el valor de la provincia y las coordenadas

        this.form.patchValue({
          nombre: data.parada,
          coordenadas: data.coordenadas,
          provincia: data.PK_Provincia
        });

        // Luego, cargamos las localidades asociadas a la provincia seleccionada
        this._localidadService.getLocalidadesPorProvincia(Number(data.PK_Provincia)).subscribe(localidades => {
          this.localidades = localidades;
          console.log('Localidades cargadas:', this.localidades);
  
          // Una vez cargadas las localidades, usamos un pequeño retraso para asegurarnos
          // de que las localidades estén completamente renderizadas antes de aplicar el valor de localidad.
          setTimeout(() => {
            this.form.patchValue({
              localidad: data.PK_Localidad
            });
            console.log('Formulario después de cargar:', this.form.value);
          }, 100); // Retraso de 100ms para permitir que el DOM se actualice
        });

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
