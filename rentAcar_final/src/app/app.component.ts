import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { FbserviceService } from './services/fbservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  session!: boolean;
  uye = this.fbservice.AktifUyeBilgi;
  currentUserName!: any;
  constructor(public fbservice: FbserviceService, public servis: DataService) {}

  ngOnInit(): void {
    this.fbservice.AktifUyeBilgi.subscribe((d) => {
      d == null ? (this.session = false) : (this.session = true);
      this.currentUserName = d?.displayName;
    });
  }

  OturumKapat() {
    this.fbservice.OturumKapat();
    // localStorage.clear();
    // location.href = '/';
  }
}
