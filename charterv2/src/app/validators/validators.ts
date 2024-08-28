import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
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

export function cuilAsyncValidator(empresaService: EmpresaService, currentEmpresaId?: number): AsyncValidatorFn {
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

        const cuil = Number(value);
        return empresaService.checkCUIL(cuil).pipe(
          map(response => {
            // Verifica si el CUIL ya está registrado
            if (response.exists && (currentEmpresaId === undefined || currentEmpresaId === null)) {
              return { cuilTaken: true };
            } else {
              return null;
            }
          }),
          catchError((error) => {
            console.error('Error en checkCUIL:', error);
            return of(null); // Maneja el error de manera segura
          })
        );
      })
    );
  };
}