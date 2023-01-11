import { DersComponent as ArabaDetaylariComponent } from './components/arabadetaylari/arabadetaylari.component';
import { LoginComponent } from './components/login/login.component';
import { UyeComponent } from './components/uye/uye.component';
import { KategoriComponent as ArabalarComponent } from './components/arabalar/araba.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['arabalar']);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'arabalar',
    component: ArabalarComponent,
    // canActivate: [AuthGuard],
    ...canActivate(redirectToLogin),
  },
  {
    path: 'uyeler',
    component: UyeComponent,
    // canActivate: [AuthGuard],
    ...canActivate(redirectToLogin),
  },
  {
    path: 'arabadetaylari',
    component: ArabaDetaylariComponent,
    // canActivate: [AuthGuard],
    ...canActivate(redirectToLogin),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
