import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViajeService } from '../../services/viaje.service';
import { ParadaService } from '../../services/parada.service';
import { CharterService } from '../../services/charter.service';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Viaje } from '../../interfaces/viaje.interface';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { fechaNoPasada, validarFechasYHorarios } from '../../validators/validators';


//Agrego Validators

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
      horario_salida: ['', [Validators.required]],
      horario_llegada: ['', [Validators.required]],
      fecha_salida: ['', [Validators.required, fechaNoPasada()]], // Valida fecha no pasada
      fecha_llegada: ['', [Validators.required, fechaNoPasada()]], // Valida fecha no pasada
      precio: ['', [Validators.required, Validators.min(1)]],
      cupo: ['', [Validators.min(1)]],
      FK_Charter: ['', [Validators.required]],
      fechaLlegadaIgual: ['', [Validators.required]],
      link_pago:[''],
    }, { validators: validarFechasYHorarios() }); // Valida fechas y horarios en conjunto
  }

  ngOnInit(): void {

    this.FK_empresa = this._empresaService.getEmpresaId() ?? 0; // Asegúrate de que sea un número

    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
      // Manejar el caso donde FK_empresa es 0 o no está disponible
    }

    this._paradaService.getParadasXEmpresa(this.FK_empresa).subscribe(
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

  onFechaLlegadaChange(): void {
    const seleccion = this.form.get('fechaLlegadaIgual')?.value;
  
    if (seleccion === 'no') {
      this.form.get('fecha_llegada')?.setValue(''); // Limpia el campo de fecha de llegada
    } else if (seleccion === 'si') {
      const fechaSalida = this.form.get('fecha_salida')?.value;
      this.form.get('fecha_llegada')?.setValue(fechaSalida); // Establece la fecha de llegada igual a la de salida
    }
  }

  addViaje() {
    const viaje: Viaje = {
      horario_salida: this.form.get('horario_salida')?.value ?? '',
      horario_llegada: this.form.get('horario_llegada')?.value ?? '',
      fecha_salida: new Date(this.form.get('fecha_salida')?.value ?? ''),
      fecha_llegada:new Date (this.form.get('fecha_llegada')?.value ?? ''),
      precio: +this.form.get('precio')?.value || 0,
      FK_Charter: +this.form.get('FK_Charter')?.value || 0, //Si no anda en donde esta || ponele ??
      cupo: +this.form.get('cupo')?.value || 0,
      paradas: this.paradasSeleccionadas.map(parada => ({
          PK_Viaje_Parada: 0,
          orden: this.paradasSeleccionadas.length + 1,
          FK_Viaje: 0,
          FK_Parada: parada.FK_Parada
      })),
      link_pago: this.form.get('link_pago')?.value,
  };

    // Validación de charter
    if (!viaje.FK_Charter) { // Cambiado de `=== 0` a `!viaje.FK_charter` para manejar `null` y `0`
      this._snackBar.open('Por favor, selecciona un charter', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
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
      panelClass: ['custom-snackbar']
    });
  }
}