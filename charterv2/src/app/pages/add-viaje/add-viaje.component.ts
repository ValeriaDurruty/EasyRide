import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViajeService } from '../../services/viaje.service';
import { ParadaService } from '../../services/parada.service';
import { CharterService } from '../../services/charter.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Viaje } from '../../interfaces/viaje.interface';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { fechaNoPasada, horariosDiferentes } from '../../validators/validators';

@Component({
  selector: 'app-add-viaje',
  templateUrl: './add-viaje.component.html',
  styleUrls: ['./add-viaje.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class AddViajeComponent implements OnInit {
  charters: any[] = [];
  paradas: Parada[] = [];
  paradasSeleccionadas: ViajeParada[] = [];
  paradaSeleccionadaControl = new FormControl<Parada | null>(null);
  FK_empresa: number = 0;
  form: FormGroup;

  constructor(
    private _snackBar: MatSnackBar,
    private _viajeService: ViajeService,
    private _paradaService: ParadaService,
    private fb: FormBuilder,
    private _charterService: CharterService,
    private _router:Router,
    private route: ActivatedRoute,
    private _empresaService:EmpresaService
  ) {
    this.form = this.fb.group({
      horario_salida: [''],
      horario_llegada: [''],
      fecha: ['', [fechaNoPasada()]],
      precio: ['', [Validators.required, Validators.min(1)]],
      cupo: ['', [Validators.min(1)]],
      FK_Charter: ['', [Validators.required]]
    }, { validators: horariosDiferentes });
  }

  ngOnInit(): void {

    this.FK_empresa = this._empresaService.getEmpresaId() ?? 0; // Asegúrate de que sea un número

    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
      // Manejar el caso donde FK_empresa es 0 o no está disponible
    }

    this._paradaService.getParadas().subscribe(
      data => {
        this.paradas = data;
      },
      error => {
        console.error('Error al obtener las paradas:', error);
      }
    );

    this._charterService.getChartersXEmpresa(this.FK_empresa).subscribe(
      data => {
        this.charters = data;
      },
      error => {
        console.error('Error al obtener los charters:', error);
      }
    );
  }

  addViaje() {
    const viaje: Viaje = {
      horario_salida: this.form.get('horario_salida')?.value ?? '',
      horario_llegada: this.form.get('horario_llegada')?.value ?? '',
      fecha: new Date(this.form.get('fecha')?.value ?? ''),
      precio: +this.form.get('precio')?.value || 0,
      FK_Charter: +this.form.get('FK_Charter')?.value || 0, //Si no anda en donde esta || ponele ??
      cupo: +this.form.get('cupo')?.value || 0,
      paradas: this.paradasSeleccionadas.map(parada => ({
          PK_Viaje_Parada: 0,
          orden: this.paradasSeleccionadas.length + 1,
          FK_Viaje: 0,
          FK_Parada: parada.FK_Parada
      }))
  };

    if (this.form.invalid) {
      this.mensaje('Por favor, corrige los errores en el formulario');
      return;
    }

    // Validación de número de paradas
    if (this.paradasSeleccionadas.length < 2) {
      this.mensaje('El viaje debe tener al menos dos paradas');
      return;
    }
  
    // Enviar el viaje al servicio
    console.log('Datos a enviar:', viaje);
  
    this._viajeService.addViaje(viaje).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.mensaje('Viaje agregado con éxito');
        this._router.navigate(['/V-empresa'], { queryParams: { tab: 'tab1' } })
      },
      error => {
        console.error('Error al agregar el viaje:', error);
        console.error('Cuerpo del error:', error.error);
      }
    );
  }
  
  agregarParada(event: Event) {
    event.preventDefault();
    const paradaSeleccionada: Parada | null = this.paradaSeleccionadaControl.value;
  
    if (paradaSeleccionada && !this.paradasSeleccionadas.some(p => p.FK_Parada === paradaSeleccionada.PK_Parada)) {
      this.paradasSeleccionadas.push({
        PK_Viaje_Parada: 0, // Este valor se asignará después
        orden: this.paradasSeleccionadas.length + 1, // Asigna un orden basado en la longitud actual
        FK_Viaje: 0, // Este valor se asignará después
        FK_Parada: paradaSeleccionada.PK_Parada,
        parada: paradaSeleccionada.parada
      });
      this.paradaSeleccionadaControl.setValue(null); // Limpia el control
    }
  }
  eliminarParada(index: number) {
    this.paradasSeleccionadas.splice(index, 1);
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