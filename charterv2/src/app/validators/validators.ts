import { AbstractControl, AsyncValidatorFn, ValidationErrors,ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { CharterService } from '../services/charter.service';
import { EmpresaService } from '../services/empresa.service';

/*export function patenteAsyncValidator(charterService: CharterService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (!value) {
          return of(null);
        }
        return charterService.checkPatente(value).pipe(
          map(response => (response.exists ? { patenteTaken: true } : null)),
          catchError(() => of(null))
        );
      })
    );
  };
}*/

export function cuitAsyncValidator(empresaService: EmpresaService, currentEmpresaId?: number): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Retorna null si el control está vacío
    if (!control.value) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (!value) {
          return of(null);
        }

        const cuit = Number(value);
        return empresaService.checkCUIT(cuit).pipe(
          map(response => {
            // Verifica si el CUIT ya está registrado
            if (response.exists && (currentEmpresaId === undefined || currentEmpresaId === null)) {
              return { cuitTaken: true };
            } else {
              return null;
            }
          }),
          catchError((error) => {
            console.error('Error en checkCUIT:', error);
            return of(null); // Maneja el error de manera segura
          })
        );
      })
    );
  };
}

// Validador personalizado para la fecha
export function fechaNoPasada(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fecha = new Date(control.value);
    const hoy = new Date();
    if (fecha < hoy) {
      return { fechaPasada: true };
    }
    return null;
  };
}

// Validador personalizado para horarios iguales
export function horariosDiferentes(control: AbstractControl): { [key: string]: any } | null {
  const horarioSalida = control.get('horario_salida')?.value;
  const horarioLlegada = control.get('horario_llegada')?.value;

  if (horarioSalida && horarioLlegada && horarioSalida === horarioLlegada) {
    return { horariosIguales: true };
  }
  return null;
}