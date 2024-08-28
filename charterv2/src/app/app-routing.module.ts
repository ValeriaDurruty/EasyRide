import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SearchComponent } from './pages/search/search.component';
import { ReservarComponent } from './pages/reservar/reservar.component';
import { ReservasEmpresaComponent } from './pages/reservas-empresa/reservas-empresa.component';
import { VistatripsComponent } from './pages/vistatrips/vistatrips.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { VClientComponent } from './pages/v-client/v-client.component';
import { VEmpresaComponent } from './pages/v-empresa/v-empresa.component';
import { EditViajeComponent } from './pages/edit-viaje/edit-viaje.component';
import { AddViajeComponent } from './pages/add-viaje/add-viaje.component';
import { ListadoViajesComponent } from './pages/listado-viajes/listado-viajes.component';
import { EditCharterComponent } from './pages/edit-charter/edit-charter.component';
import { VAdminComponent } from './pages/v-admin/v-admin.component';
import { AgregarCharterComponent } from './pages/agregar-charter/agregar-charter.component';
import { AddEmpresaComponent } from './pages/add-empresa/add-empresa.component';
import { EditEmpresaComponent } from './pages/edit-empresa/edit-empresa.component';
import { RoleGuard } from './guards/admin.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

// RUTAS DE NAVEGACIÓN

const routes: Routes = [
  //Rutas principales
  {path:"",component:HomeComponent},
  {path: "LogIn",component: LoginComponent },
  {path: "Search",component: SearchComponent,canActivate: [RoleGuard]},
  {path:"Reservar/:id",component: ReservarComponent, canActivate: [RoleGuard]},
  {path: "Vista-Trips",component: VistatripsComponent, canActivate: [RoleGuard]},
  {path:"Registrar",component: RegistrarComponent},

  //Vistas de usuario
  {path:"V-cliente",component:VClientComponent, canActivate: [RoleGuard]},
  {path:"V-empresa",component:VEmpresaComponent,canActivate: [RoleGuard]},
  {path:"V-admin",component:VAdminComponent, canActivate: [RoleGuard]},

  //Viajes
  {path:"Editar-viaje/:id",component:EditViajeComponent, canActivate: [RoleGuard]},
  {path:"Agregar-viaje",component:AddViajeComponent, canActivate: [RoleGuard]},
  {path:"Listado-viaje",component:ListadoViajesComponent, canActivate: [RoleGuard]},

  //Charters
  {path: "Editar-charter/:id", component: EditCharterComponent, canActivate: [RoleGuard] },
  {path:"Agregar-charter",component:AgregarCharterComponent, canActivate: [RoleGuard]},
  
  //Empresas
  {path:"Agregar-empresa",component:AddEmpresaComponent, canActivate: [RoleGuard]},
  {path:"Editar-empresa/:id",component:EditEmpresaComponent, canActivate: [RoleGuard]},

  //Reservas Empresa
  {path:"Reservas-empresa",component:ReservasEmpresaComponent, canActivate: [RoleGuard]},


  //Unauthorized
  {path:"unauthorized", component:UnauthorizedComponent}
    
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }