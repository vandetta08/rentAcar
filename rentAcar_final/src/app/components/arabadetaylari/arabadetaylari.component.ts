import { ActivatedRoute } from '@angular/router';
import { Kategori } from '../../models/Kategori';
import { Sonuc } from '../../models/Sonuc';
import { MytoastService } from '../../services/mytoast.service';
import { Ders } from '../../models/Ders';
import { DataService } from '../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { FbserviceService } from 'src/app/services/fbservice.service';

@Component({
  selector: 'app-arabadetaylari',
  templateUrl: './arabadetaylari.component.html',
  styleUrls: ['./arabadetaylari.component.scss'],
})
export class DersComponent implements OnInit {
  aboutTheAllCars: any;
  currentUser!: any;
  dersler!: Ders[];
  kategoriler!: Kategori[];
  modal!: Modal;
  modalBaslik: string = '';
  secDers!: Ders;
  katId: number = 0;
  secKat: Kategori = new Kategori();
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    dersadi: new FormControl(),
    derskredi: new FormControl(),
    categoryId: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl(),
  });
  constructor(
    public servis: DataService,
    public toast: MytoastService,
    public route: ActivatedRoute,
    public fbservice: FbserviceService
  ) {}

  ngOnInit() {
    // this.route.params.subscribe((p: any) => {
    //   if (p.katId) {
    //     this.katId = p.katId;
    //     this.KategoriGetir();
    //   }
    // });
    // this.KategoriListele();
    this.fbservice.AktifUyeBilgi.subscribe((d) => {
      this.currentUser = d;
      this.fbservice.getTheCars().subscribe((a) => {
        this.aboutTheAllCars = a.filter((car) => car.kiralayanKisi == d?.uid);
      });
      console.log(this.aboutTheAllCars);
    });
  }
  KatSec(katId: number) {
    this.katId = katId;
    this.KategoriGetir();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({
      categoryId: this.katId,
    });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Ders Ekle';
    this.modal.show();
  }
  Duzenle(ders: Ders, el: HTMLElement) {
    this.frm.patchValue(ders);
    this.modalBaslik = 'Ders Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(ders: Ders, el: HTMLElement) {
    this.secDers = ders;
    this.modalBaslik = 'Ders Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  DersListele() {
    this.servis.DersListeleByKatId(this.katId).subscribe((d) => {
      this.dersler = d;
    });
  }
  KategoriListele() {
    this.servis.KategoriListele().subscribe((d) => {
      this.kategoriler = d;
    });
  }
  KategoriGetir() {
    this.servis.KategoriById(this.katId).subscribe((d) => {
      this.secKat = d;
      this.DersListele();
    });
  }
  DersEkleDuzenle() {
    var ders: Ders = this.frm.value;
    var tarih = new Date();
    if (!ders.id) {
      var filtre = this.dersler.filter((s) => s.dersadi == ders.dersadi);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = 'Girilen Ders Adı Kayıtlıdır!';
        this.toast.ToastUygula(this.sonuc);
      } else {
        ders.kaytarih = tarih.getTime().toString();
        ders.duztarih = tarih.getTime().toString();
        this.servis.DersEkle(ders).subscribe((d) => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = 'Ders Eklendi';
          this.toast.ToastUygula(this.sonuc);
          this.DersListele();
          this.modal.toggle();
        });
      }
    } else {
      ders.duztarih = tarih.getTime().toString();
      this.servis.DersDuzenle(ders).subscribe((d) => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = 'Ders Düzenlendi';
        this.toast.ToastUygula(this.sonuc);
        this.DersListele();
        this.modal.toggle();
      });
    }
  }
  DersSil() {
    this.servis.DersSil(this.secDers.id).subscribe((d) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Ders Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.DersListele();
      this.modal.toggle();
    });
  }
}
