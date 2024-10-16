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
import { Charter } from '../../interfaces/charter.interface';
import { EmpresaService } from '../../services/empresa.service';
import { fechaNoPasada, validarFechasYHorarios } from '../../validators/validators';


//Agrego Validators
@Component({
  selector: 'app-edit-viaje',
  templateUrl: './edit-viaje.component.html',
  styleUrls: ['./edit-viaje.component.css',
    '/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class EditViajeComponent implements OnInit {
  charters: any[] = [];
  paradas: Parada[] = [];
  paradasSeleccionadas: ViajeParada[] = [];
  paradaSeleccionadaControl = new FormControl<Parada | null>(null);
  selectedCharter: Charter | null = null;
   paradasExistentes: ViajeParada[] = [];
   idViaje: number = 0;
   FK_empresa: number = 0;

  form: FormGroup;

  constructor(
    private _snackBar: MatSnackBar,
    private _viajeService: ViajeService,
    private _paradaService: ParadaService,
    private fb: FormBuilder,
    private _charterService: CharterService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _empresaService:EmpresaService
  ) {
    this.form = this.fb.group({
      horario_salida: ['', [Validators.required]],
      horario_llegada: ['', [Validators.required]],
      fecha_salida: ['', [Validators.required, fechaNoPasada()]], // Valida fecha no pasada
      fecha_llegada: ['', [Validators.required, fechaNoPasada()]], // Valida fecha no pasada
      precio: ['', [Validators.required, Validators.min(1)]],
      cupo: ['', [Validators.min(1)]],
      FK_Charter: ['', [Validators.required]]
    }, { validators: validarFechasYHorarios() }); // Valida fechas y horarios en conjunto
  }


  //NO ME CAMBIEN EL ORDEN DE COMO SE CARGA
  ngOnInit(): void {
    this.FK_empresa = this._empresaService.getEmpresaId() ?? 0; // Asegúrate de que sea un número
  
    if (this.FK_empresa === 0) {
      console.error('FK_Empresa no está disponible.');
      this.mensaje('Error: FK_empresa no está disponible');
      return; // Salir del método si FK_empresa no está disponible
    }
  
    // Cargar charters y luego procesar parámetros y paradas
    this.cargarCharters(this.FK_empresa)
      .then(() => {
        this._route.paramMap.subscribe(params => {
          const id = +params.get('id')!;
          this.idViaje = id;
          this.obtenerViajeXid(id); // Llama a la función para obtener el viaje
          this.cargarParadas(); // Llama a la función para cargar las paradas
        });
      })
      .catch(error => {
        console.error('Error al cargar los charters:', error);
        this.mensaje('Error al cargar los charters');
      });
  }
  
  //CARGAR PARADAS

  cargarParadas(): void {
    this._paradaService.getParadas().subscribe(
      (paradas: Parada[]) => {
        this.paradas = paradas; // Asigna las paradas al array en tu componente
        console.log('Paradas cargadas:', this.paradas); // Verifica los datos cargados
      },
      (error) => {
        console.error('Error al cargar las paradas:', error);
        this.mensaje('Error al cargar las paradas'); // Muestra un mensaje de error
      }
    );
  }
  //CARGA DE CHARTERS
  cargarCharters(FK_empresa: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._charterService.getChartersXEmpresa(FK_empresa).subscribe(
        (charters: Charter[]) => {
          this.charters = charters;
          //console.log('Charters cargados:', this.charters);
          resolve();
        },
        (error) => {
          console.error('Error al cargar los charters:', error);
          this.mensaje('Error al cargar los charters');
          reject(error);
        }
      );
    });
  }
  
  //OBTENER VIAJE POR ID
  obtenerViajeXid(id: number): void {
    //this.loading = true; // Activa el estado de carga
    this._viajeService.getViajeXid(id).subscribe(
      response => {
        // Verifica que la respuesta sea un array y obtén el primer elemento
        if (Array.isArray(response) && response.length > 0) {
          const viaje: Viaje = response[0];
          console.log(viaje);

          this.idViaje = viaje.PK_Viaje ?? 0;
          
        // Optimizar la conversión de fecha
        const fechaConvertida_salida = this.convertirCadenaODateAFormatoInput(viaje.fecha_salida);
        const fechaConvertida_llegada = this.convertirCadenaODateAFormatoInput(viaje.fecha_llegada);

        this.form.patchValue({
            horario_salida: viaje.horario_salida,
            horario_llegada: viaje.horario_llegada,
            fecha_salida: fechaConvertida_salida,
            fecha_llegada: fechaConvertida_llegada,
            precio: viaje.precio,
            FK_Charter: viaje.FK_Charter
          });
          if (typeof viaje.paradas === 'string') {
            this.paradasSeleccionadas = this.parseParadas(viaje.paradas);
          } else {
            this.paradasSeleccionadas = [];
          }
          // Busca el charter por patente
          this.selectedCharter = this.charters.find(charter => charter.patente === viaje.patente) || null;
          // Actualiza el valor del formulario para FK_Charter
          this.form.get('FK_Charter')?.setValue(this.selectedCharter ? this.selectedCharter.PK_Charter : '');
        
          /* Logging individual form field values
          console.log('Horario de Salida:', this.form.get('horario_salida')?.value);
          console.log('Horario de Llegada:', this.form.get('horario_llegada')?.value);
          console.log('Fecha:', this.form.get('fecha')?.value);
          console.log('Precio:', this.form.get('precio')?.value);
          console.log('FK_Charter:', this.form.get('FK_Charter')?.value);*/
        } else {
          console.error('Respuesta inesperada del servidor');
        }

        //this.loading = false; // Desactiva el estado de carga
      },
      error => {
        //this.loading = false; // Desactiva el estado de carga en caso de error
        console.error('Error al obtener el viaje:', error);
        this.mensaje('Error al obtener el viaje'); // Muestra un mensaje de error
      }
    );
  }

  //EDITAR VIAJE 
  EditarViaje() {
    if (this.idViaje) {
      //console.log('ID de viaje:', this.idViaje);
  
      const viaje: Viaje = {
        PK_Viaje: this.idViaje, // Incluye el PK_Viaje aquí
        horario_salida: this.form.get('horario_salida')?.value ?? '',
        horario_llegada: this.form.get('horario_llegada')?.value ?? '',
        fecha_salida: new Date(this.form.get('fecha_salida')?.value ?? ''),
        fecha_llegada: new Date(this.form.get('fecha_llegada')?.value ?? ''),
        precio: +this.form.get('precio')?.value || 0,
        FK_Charter: +this.form.get('FK_Charter')?.value || 0,
        cupo: +this.form.get('cupo')?.value || 0,
        paradas: this.paradasSeleccionadas.map(parada => ({
          PK_Viaje_Parada: parada.PK_Viaje_Parada || 0, // Asegúrate de manejar PK_Viaje_Parada correctamente
          orden: parada.orden,
          FK_Parada: parada.FK_Parada,
          FK_Viaje: this.idViaje // Asegúrate de que FK_Viaje esté correctamente asignado
        }))
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
  
      //console.log('Datos a enviar:', viaje);
  
      this._viajeService.updateViaje(this.idViaje, viaje).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.mensaje('El viaje fue actualizado con éxito');
          this._router.navigate(['/V-empresa'], { queryParams: { tab: 'tab1' } });
        },
        error => {
          console.error('Error al actualizar el viaje:', error);
          console.error('Cuerpo del error:', error.error);
        }
      );
    } else {
      console.error('ID de viaje no definido.');
    }
  }
  
  //PARADAS
   //AGREGAR PARADA
   agregarParada(event: Event) {
    event.preventDefault();
    
    // Asegúrate de que 'paradaSeleccionadaControl' es de tipo FormControl<Parada | null>
    const paradaSeleccionada: Parada | null = this.paradaSeleccionadaControl.value;
    
    if (paradaSeleccionada) {
      // Verifica si la parada ya está en la lista
      const existeParada = this.paradasSeleccionadas.some(p => p.FK_Parada === paradaSeleccionada.PK_Parada);
      
      if (!existeParada) {
        this.paradasSeleccionadas.push({
          PK_Viaje_Parada: 0,
          orden: this.paradasSeleccionadas.length + 1,
          FK_Viaje: this.idViaje, // Asegúrate de que esto tenga un valor válido
          FK_Parada: paradaSeleccionada.PK_Parada,
          parada: paradaSeleccionada.parada
        });
        // Limpia la selección después de agregar
        this.paradaSeleccionadaControl.setValue(null);
      } else {
        this.mensaje('La parada ya está en la lista');
      }
    }
  }
  //ELIMINAR PARADA
  eliminarParada(index: number) {
    this.paradasSeleccionadas.splice(index, 1);
    this.paradasSeleccionadas.forEach((parada, i) => parada.orden = i + 1);
  }
  
  //PARA PODER SEPARAR LAS PARADAS RECIBIDAS
  parseParadas(paradasString: string): ViajeParada[] {
    const paradasArray = paradasString.split(';').map(paradaString => {
      const partes = paradaString.split(',').map(part => part.trim());
      
      // Asegúrate de que todas las propiedades necesarias están presentes
      const paradaObj: ViajeParada = {
        PK_Viaje_Parada: Number(partes[0].split(':')[1]),
        FK_Parada: Number(partes[1].split(':')[1]),
        orden: Number(partes[2].split(':')[1]),
        parada: partes[3].split(':')[1].trim(),
        FK_Viaje: 0 // Asigna un valor adecuado para FK_Viaje si lo tienes
      };
      //console.log('Parada procesada:', paradaObj); 
      return paradaObj;
    });
    return paradasArray;
  }

  //CHARTER
  onCharterChange(event: Event): void {
    const selectedCharterId = (event.target as HTMLSelectElement).value;
    this.selectedCharter = this.charters.find(charter => charter.PK_Charter.toString() === selectedCharterId) || null;
  }
  
  // Función genérica para convertir fechas (sea Date o string) al formato input (YYYY-MM-DD)
  convertirCadenaODateAFormatoInput(fecha: string | Date): string {
    const dateObj = typeof fecha === 'string' ? this.convertirCadenaADate(fecha) : new Date(fecha);
    const anio = dateObj.getFullYear();
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dia = String(dateObj.getDate()).padStart(2, '0');
    
    return `${anio}-${mes}-${dia}`;
  }

  // Función para convertir cadenas de fecha (DD-MM-YYYY) a objetos Date
  convertirCadenaADate(fechaStr: string): Date {
    const [dia, mes, anio] = fechaStr.split('-').map(Number);
    return new Date(anio, mes - 1, dia); // Ajustar el mes (0-indexado en JS)
  }

   //MENSAJES DE NOTIFICACION
 
  mensaje(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-error']
    });
  }
}


