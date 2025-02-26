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

const routes: Routes = [
  { path: "", component: InitialScreenComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "login", component: LoginComponent },
  { path: "signUp", component: SignUpComponent },
  { path: "home", component: HomeComponent },
  { path: "profile", component: ProfileComponent },
  { path: "registry", component: RegistryComponent },
  { path: "stock", component: StockComponent },
  { path: "users", component: UsersComponent, canActivate: [admGuard] },
  { path: "products", component: ProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
