import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table'; // Importação direta do módulo PrimeNG
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StockComponent } from './pages/stock/stock.component';
import { RegistryComponent } from './pages/registry/registry.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { InitialScreenComponent } from './pages/initial-screen/initial-screen.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { UsersComponent } from './pages/users/users.component';
import { ProductsComponent } from './pages/products/products.component';
import { TableComponent } from './shared/components/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    StockComponent,
    RegistryComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    InitialScreenComponent,
    HeaderComponent,
    UsersComponent,
    ProductsComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TableModule // Adicionando PrimeNG corretamente
  ],
  providers: [], // Removemos providePrimeNG
  bootstrap: [AppComponent]
})
export class AppModule { }
