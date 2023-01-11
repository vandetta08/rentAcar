import { Ders } from './../models/Ders';
import { Uye } from './../models/Uye';
import { Injectable } from '@angular/core';
import { Kategori } from '../models/Kategori';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public apiUrl = "http://localhost:3000/";
  public aktifUye: Uye = new Uye();;
  constructor(
    public http: HttpClient
  ) { }
  /* kategori servis başla*/

  OturumAc(mail: string, parola: string) {
    return this.http.get<Uye[]>(this.apiUrl + "users?mail=" + mail + "&parola=" + parola);
  }
  OturumKontrol() {
    if (localStorage.getItem("adsoyad")) {
      this.AktifUyeBilgi()
      return true;
    } else {
      return false;
    }
  }
  AktifUyeBilgi() {
    if (localStorage.getItem("adsoyad")) {
      this.aktifUye.adsoyad = localStorage.getItem("adsoyad") || "";
      var admin = localStorage.getItem("admin") || "0";
      this.aktifUye.admin = parseInt(admin);
    }
  }
  KategoriListele() {
    return this.http.get<Kategori[]>(this.apiUrl + "categories");
  }
  KategoriById(id: number) {
    return this.http.get<Kategori>(this.apiUrl + "categories/" + id);
  }
  KategoriEkle(kat: Kategori) {
    return this.http.post(this.apiUrl + "categories/", kat);
  }
  KategoriDuzenle(kat: Kategori) {
    return this.http.put(this.apiUrl + "categories/" + kat.id, kat);
  }
  KategoriSil(id: number) {
    return this.http.delete(this.apiUrl + "categories/" + id);
  }
  /* kategori servis bitiş*/

  /* Uye servis başla*/

  UyeListele() {
    return this.http.get<Uye[]>(this.apiUrl + "users");
  }
  UyeById(id: number) {
    return this.http.get<Uye>(this.apiUrl + "users/" + id);
  }
  UyeEkle(uye: Uye) {
    return this.http.post(this.apiUrl + "users/", uye);
  }
  UyeDuzenle(uye: Uye) {
    return this.http.put(this.apiUrl + "users/" + uye.id, uye);
  }
  UyeSil(id: number) {
    return this.http.delete(this.apiUrl + "users/" + id);
  }
  /* Uye servis bitiş*/

  /* Ders servis başla*/

  DersListele() {
    return this.http.get<Ders[]>(this.apiUrl + "lessons");
  }
  DersListeleByKatId(katId: number) {
    return this.http.get<Ders[]>(this.apiUrl + "categories/" + katId + "/lessons");
  }
  DersById(id: number) {
    return this.http.get<Ders>(this.apiUrl + "lessons/" + id);
  }
  DersEkle(ders: Ders) {
    return this.http.post(this.apiUrl + "lessons/", ders);
  }
  DersDuzenle(ders: Ders) {
    return this.http.put(this.apiUrl + "lessons/" + ders.id, ders);
  }
  DersSil(id: number) {
    return this.http.delete(this.apiUrl + "lessons/" + id);
  }
  /* Ders servis bitiş*/
}

