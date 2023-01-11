import { Sonuc } from './../../models/Sonuc';
import { HotToastService } from '@ngneat/hot-toast';
import { Uye } from './../../models/Uye';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { FbserviceService } from 'src/app/services/fbservice.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { GoogleLogin } from 'src/app/models/GoogleLogin';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: any;
  loggedIn: any;
  fbuye: GoogleLogin = new GoogleLogin();
  sonuc: Sonuc = new Sonuc();
  usermail!: any;
  constructor(
    public dataServis: DataService,
    public toast: HotToastService,
    public fbservice: FbserviceService,
    public router: Router,
    private authService: SocialAuthService
  ) {}

  ngOnInit() {
    this.authService.authState.pipe().subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      this.fbuye.mail = this.user.email;
      this.fbuye.displayName = this.user.name;
      this.fbuye.foto = this.user.photoUrl;
      this.usermail = this.fbuye.mail;

      this.fbservice
        .KayitOl(this.usermail, '123456')
        .pipe(
          switchMap(({ user: { uid } }) =>
            this.fbservice.UyeEkle({
              uid,
              ...this.fbuye,
            })
          ),
          this.toast.observe({
            success: 'Giriş Başarılı',
            loading: 'Giriş Yapılıyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe(() => this.router.navigate(['home']));
    });
  }
  OturumAc(mail: string, parola: string) {
    this.fbservice
      .OturumAc(mail, parola)
      .pipe(
        this.toast.observe({
          success: 'Oturum Açıldı',
          loading: 'Oturum Açılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
    // this.fbservice.OturumAc()
    // this.dataServis.OturumAc(mail, parola).subscribe((d) => {
    //   if (d.length > 0) {
    //     var kayit: Uye = d[0];
    //     localStorage.setItem('adsoyad', kayit.adsoyad);
    //     localStorage.setItem('admin', kayit.admin.toString());
    //     location.href = '/';
    //   } else {
    //     var s: Sonuc = new Sonuc();
    //     s.islem = false;
    //     s.mesaj = 'E-Posta Adresi veya Parola Geçersizdir!';
    //     this.toast.ToastUygula(s);
    //   }
    // });
  }

  KayitOl(mail: string, password: string, displayName: string) {
    this.fbservice
      .KayitOl(mail, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbservice.UyeEkle({
            uid,
            email: mail,
            displayName: displayName,
            adres: 'null',
          })
        ),
        this.toast.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['arabalar']);
      });
  }
}
