import { DataService } from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public servis: DataService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var sonuc: boolean = false;
    if (this.servis.OturumKontrol()) {
      sonuc = true;
    } else {
      this.router.navigate(['/login']);
      // location.href = "/login";
    }
    return sonuc;
  }
}
