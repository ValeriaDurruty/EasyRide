import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { UserDataService } from '../../shared/user-data.service';
import { Usuario } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ConfirmationService } from '../../services/dialog.confirm';

@Component({
  selector: 'app-v-admin',
  templateUrl: './v-admin.component.html',
  styleUrls: ['./v-admin.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})

export class VAdminComponent implements OnInit {

  listEmpresas: Empresa[] = [];
  listUsuariosPendientes: Usuario[] = [];
  listUsuariosValidados: Usuario[] = [];
  user: Usuario | null = null;
  private userSubscription: Subscription | null = null;
  private logoutSubscription: Subscription | null = null;
  currentTab: string = 'tab1'; // Pestaña activa por defecto
  loading: boolean = false; // Variable para mostrar la barra de carga
  showTab(tabId: string) {
    this.currentTab = tabId;
  }

  constructor(private _empresaService : EmpresaService,  
    private _userService : UserService, 
    private Router: Router, 
    private userDataService: UserDataService, 
    private route: ActivatedRoute, 
    private _snackBar: MatSnackBar,
    private _dialog: ConfirmationService,) {}

  //Apenas se inicializa el componente se ejecuta el método para obtener las empresas y los usuarios
  ngOnInit() : void {
    this.getUsuarioCompartido();
    this.obtenerEmpresas();
    this.obtenerusuariosPendientes();
    this.obtenerUsuariosValidados();
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.showTab(tab);
      }
    });
  }

  getUsuarioCompartido(): void {
    this.userSubscription = this.userDataService.currentUser$.subscribe(user => {
      this.user = user;
      if (this.user) { //Deberia irse
        //console.log('Nombre de usuario:', this.user.nombre);
        //console.log('Apellido de usuario:', this.user.apellido);
        //console.log('Email de usuario:', this.user.email);
       // console.log('Rol de usuario:', this.user.FK_Rol);
    }});
  };

  // Método para obtener los datos de las empresas
  obtenerEmpresas() {
    this.loading = true;

    this._empresaService.getEmpresas().subscribe(data => {
      this.loading = false;
      this.listEmpresas = data;
    }
    )
  }
  obtenerusuariosPendientes(): void {
    this._userService.getUsuarios().subscribe(usuarios => {
      this._empresaService.getEmpresas().subscribe(empresas => {
        this.listUsuariosPendientes = usuarios
          .filter(usuario => usuario.validar === 0 && usuario.FK_Rol === 2)
          .map(usuario => {
            usuario['nombreEmpresa'] = empresas.find(empresa => empresa.PK_Empresa === usuario.FK_Empresa)?.razon_social;
            return usuario;
          });
      });
    });
  }

  obtenerUsuariosValidados(): void {
    this._userService.getUsuarios().subscribe(usuarios => {
      this._empresaService.getEmpresas().subscribe(empresas => {
        this.listUsuariosValidados = usuarios
          .filter(usuario => usuario.validar === 1 && usuario.FK_Rol === 2)
          .map(usuario => {
            usuario['nombreEmpresa'] = empresas.find(empresa => empresa.PK_Empresa === usuario.FK_Empresa)?.razon_social;
            return usuario;
          });
      });
    });
  }

  // Método para confirmar y eliminar un usuario
  confirmDeleteEmpresa(id: number): void {
    this._dialog.confirm('¿Seguro que quieres eliminar?').subscribe(result => {
      if (result) {
        this.deleteEmpresa(id);
      }
    });
  }

  // Método para eliminar una empresa
  deleteEmpresa(id: number) {
    this.loading = true;
    this._empresaService.deleteEmpresa(id).subscribe(
      () => {
        this.obtenerEmpresas();
        this.currentTab = 'tab3';      
        this.mensaje('Empresa eliminada con éxito');
      },
      error => {
        this.loading = false;
        console.error('Error al eliminar la empresa:', error);
        this.mensaje(error.error.message);
      }
    );
  }

  // Método para confirmar y eliminar un usuario
  confirmDeleteUsuario(id: number): void {
    this._dialog.confirm('¿Seguro que quieres eliminar?').subscribe(result => {
      if (result) {
        this.deleteUsuario(id);
      }
    });
  }

  // Método para eliminar un usuario
  deleteUsuario(id: number) {
      this.loading = true;
      this._userService.deleteUsuario(id).subscribe(
        () => {
        this.obtenerusuariosPendientes();
        this.obtenerUsuariosValidados();
        this.mensaje('Usuario eliminado con éxito');
      },
      error => {
        this.loading = false;
        console.error('Error al eliminar el usuario:', error);
        this.mensaje(error.error.message);
      }
    );
  }

    // Método para confirmar y eliminar un usuario
    confirmValidarUsuario(id: number): void {
      this._dialog.confirm('¿Seguro que quieres validar este usuario?').subscribe(result => {
        if (result) {
          this.validarUsuario(id);
        }
      });
    }

  // Método para validar un usuario
  validarUsuario(id: number) {
    this.loading = true;
    this._userService.validarUsuario(id).subscribe(
      () => {
      this.obtenerusuariosPendientes();
      this.obtenerUsuariosValidados();
      this.currentTab = 'tab2';
      this.mensaje('El usuario fue validado con éxito');
    },
    error => {
      this.loading = false;
      console.error('Error al validar el usuario:', error);
      this.mensaje(error.error.message);
    }
  );
}

mensaje(mensaje: string): void {
  this._snackBar.open(mensaje, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
}

}