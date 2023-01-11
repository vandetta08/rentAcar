import { Sonuc } from '../../models/Sonuc';
import { HotToastService } from '@ngneat/hot-toast';
import { Kategori } from '../../models/Kategori';
import { DataService } from '../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { FbserviceService } from 'src/app/services/fbservice.service';
import { Car } from 'src/app/models/Car';
import { MytoastService } from '../../services/mytoast.service';

@Component({
  selector: 'app-arabalar',
  templateUrl: './araba.component.html',
  styleUrls: ['./araba.component.scss'],
})
export class KategoriComponent implements OnInit {
  allCars!: Array<any>;
  currentUserMail!: any;
  kategoriler!: Kategori[];
  modal!: Modal;
  modalBaslik: string = '';
  secKat!: Kategori;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    carname: new FormControl(),
    model: new FormControl(),
    year: new FormControl(),
    priceForToday: new FormControl(),
    uid: new FormControl(),
  });
  carInfos!: any;
  constructor(
    public servis: DataService,
    public toast: HotToastService,
    public mytoast: MytoastService,
    public fbservice: FbserviceService
  ) {}

  ngOnInit() {
    this.fbservice.AktifUyeBilgi.subscribe((d) => {
      this.currentUserMail = d?.email;
    });
    this.KategoriListele();
    this.getTheCars();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Araba Ekle';
    this.modal.show();
  }

  Duzenle(kat: Kategori, el: HTMLElement) {
    this.frm.patchValue(kat);
    this.modalBaslik = 'Araba Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  Sil(car: Car, el: HTMLElement) {
    this.carInfos = car;
    // this.secKat = kat;
    this.modalBaslik = `${this.carInfos.carname} Adlı araba silinecektir onaylıyor musunuz?`;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  deleteTheCar(car: Car) {
    this.sonuc.islem = true;
    this.sonuc.mesaj = 'Araba Başarıyla Silindi...';
    this.fbservice
      .deleteTheCar(car)
      .then(() => {
        this.mytoast.ToastUygula(this.sonuc);
      })
      .catch((err) => console.error(new Error(err)));
    this.modal.toggle();
  }

  KategoriListele() {
    // this.servis.KategoriListele().subscribe((d) => {
    //   this.kategoriler = d;
    // });
  }

  getTheCars() {
    this.fbservice.getTheCars().subscribe((d) => {
      this.allCars = d.filter((car) => car.kiralayanKisi == 'null');
    });
  }

  getTheRent(car: Car) {
    this.fbservice.AktifUyeBilgi.subscribe((d) => {
      car.kiralayanKisi = d?.uid;

      this.fbservice
        .getTheRentACar(car)
        .pipe(
          this.toast.observe({
            success:
              'Araç Başarıyla Kiralandı, Bilgiler SMS Olarak Size İletilecek',
            loading: 'Araç Kiralanıyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe();
    });
  }

  addNewCar() {
    let car: Car = this.frm.value;
    if (car.uid == null) {
      car.kiralayanKisi = 'null';
      this.fbservice
        .addNewCar(car)
        .pipe(
          this.toast.observe({
            success: 'Yeni Araba Eklendi',
            loading: 'Araba Ekleniyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe();
    } else {
      this.fbservice
        .editTheCar(car)
        .pipe(
          this.toast.observe({
            success: 'Araba Düzenlendi',
            loading: 'Ayarlar Kaydediliyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe();
    }

    //******************orijinal */
    // this.fbservice.addNewCar(car).pipe(
    // );
    //***********************ORİJİNAL */
    this.modal.toggle();
    // var kat: Kategori = this.frm.value;
    // var tarih = new Date();
    // if (!kat.id) {
    //   var filtre = this.kategoriler.filter((s) => s.adi == kat.adi);
    //   if (filtre.length > 0) {
    //     this.sonuc.islem = false;
    //     this.sonuc.mesaj = 'Girilen Araba Kayıtlıdır!';
    //     this.toast.ToastUygula(this.sonuc);
    //   } else {
    //     kat.kaytarih = tarih.getTime().toString();
    //     kat.duztarih = tarih.getTime().toString();
    //     this.servis.Kategori(kat).subscribe((d) => {
    //       this.sonuc.islem = true;
    //       this.sonuc.mesaj = 'Araba Eklendi';
    //       this.toast.ToastUygula(this.sonuc);
    //       this.KategoriListele();
    //       this.modal.toggle();
    //     });
    //   }
    // } else {
    //   kat.duztarih = tarih.getTime().toString();
    //   this.servis.KategoriDuzenle(kat).subscribe((d) => {
    //     this.sonuc.islem = true;
    //     this.sonuc.mesaj = 'Araba Düzenlendi';
    //     this.toast.ToastUygula(this.sonuc);
    //     this.KategoriListele();
    //     this.modal.toggle();
    //   });
    // }
  }
  KategoriSil() {
    //   this.servis.KategoriSil(this.secKat.id).subscribe((d) => {
    //     this.sonuc.islem = true;
    //     this.sonuc.mesaj = 'Araba Silindi';
    //     this.toast.ToastUygula(this.sonuc);
    //     this.KategoriListele();
    //     this.modal.toggle();
    //   });
  }
}
