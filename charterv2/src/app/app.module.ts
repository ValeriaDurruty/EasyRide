import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR'; // Importa la localización para Argentina
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { ReservarComponent } from './pages/reservar/reservar.component';
import { HeaderpComponent } from './components/headerp/headerp.component';
import { MatIconModule } from '@angular/material/icon';
import { MainComponent } from './pages/home/main/main.component';
import { TripComponent } from './components/trip/trip.component';
import { LmainComponent } from './pages/login/lmain/lmain.component';
import { HeadersComponent } from './components/headers/headers.component';
import { SearchmComponent } from './pages/search/searchm/searchm.component';
import { VistatripsComponent } from './pages/vistatrips/vistatrips.component';
import { CardtripComponent } from './components/cardtrip/cardtrip.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { ReservasEmpresaComponent } from './pages/reservas-empresa/reservas-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VClientComponent } from './pages/v-client/v-client.component';
import { VEmpresaComponent } from './pages/v-empresa/v-empresa.component';
import { EditViajeComponent } from './pages/edit-viaje/edit-viaje.component';
import { AddViajeComponent } from './pages/add-viaje/add-viaje.component';
import { ListadoViajesComponent } from './pages/listado-viajes/listado-viajes.component';
import { EditCharterComponent } from './pages/edit-charter/edit-charter.component';
import { VAdminComponent } from './pages/v-admin/v-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AgregarCharterComponent } from './pages/agregar-charter/agregar-charter.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AddEmpresaComponent } from './pages/add-empresa/add-empresa.component';
import { EditEmpresaComponent } from './pages/edit-empresa/edit-empresa.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { ListadoReservasComponent } from './components/listado-reservas/listado-reservas.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SobrenosotrosComponent } from './components/sobrenosotros/sobrenosotros.component';
import { AddParadaComponent } from './pages/add-parada/add-parada.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalcontactEmpresaComponent } from './components/modal-contact-empresa/modal-contact-empresa.component';
import { ModalshComponent } from './components/modalsh/modalsh.component';
import { MapComponentComponent } from './components/map-component/map-component.component';

registerLocaleData(localeEsAR); // Registra la localización para Argentina

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    LoginComponent,
    ReservarComponent,
    ReservasEmpresaComponent,
    HeaderpComponent,
    MainComponent,
    TripComponent,
    LmainComponent,
    HeadersComponent,
    SearchmComponent,
    VistatripsComponent,
    CardtripComponent,
    RegistrarComponent,
    VClientComponent,
    VEmpresaComponent,
    EditViajeComponent,
    AddViajeComponent,
    ListadoViajesComponent,
    EditCharterComponent,
    VAdminComponent,
    AgregarCharterComponent,
    AddEmpresaComponent,
    EditEmpresaComponent,
    ConfirmDialogComponent,
    UnauthorizedComponent,
    TicketComponent,
    ListadoReservasComponent,
    SobrenosotrosComponent,
    AddParadaComponent,
    ModalcontactEmpresaComponent,
    ModalshComponent,
    MapComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  exports: [
    HttpClientModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({"projectId":"easyride-3306a","appId":"1:409674269171:web:1e7f4a1e68c7c9fb32d286","storageBucket":"easyride-3306a.appspot.com","apiKey":"AIzaSyBmf5LQe1yqF_QQduzPo_BvaRhCdX3gHX4","authDomain":"easyride-3306a.firebaseapp.com","messagingSenderId":"409674269171","measurementId":"G-2ZPNGCK20M"})),
    provideAuth(() => getAuth()),
    { provide: LOCALE_ID, useValue: 'es-AR' } // Proveedor de localización
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
