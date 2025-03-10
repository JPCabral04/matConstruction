import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistryComponent } from './pages/registry/registry.component';
import { StockComponent } from './pages/stock/stock.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { InitialScreenComponent } from './pages/initial-screen/initial-screen.component';
import { UsersComponent } from './pages/users/users.component';
import { ProductsComponent } from './pages/products/products.component';
import { admGuard } from './shared/guards/adm.guard';
import { authGuard } from './shared/guards/auth.guard';
import { unauthGuard } from './shared/guards/unauth.guard';

const routes: Routes = [
  { path: "", component: InitialScreenComponent },
  { path: "forgot-password", component: ForgotPasswordComponent, canActivate: [unauthGuard] },
  { path: "login", component: LoginComponent, canActivate: [unauthGuard] },
  { path: "signUp", component: SignUpComponent, canActivate: [unauthGuard] },
  { path: "home", component: HomeComponent, canActivate: [authGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: "registry", component: RegistryComponent, canActivate: [authGuard] },
  { path: "stock", component: StockComponent, canActivate: [authGuard] },
  { path: "users", component: UsersComponent, canActivate: [admGuard, authGuard] },
  { path: "products", component: ProductsComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
