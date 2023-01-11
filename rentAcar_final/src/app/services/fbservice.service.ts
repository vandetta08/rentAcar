import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  collectionSnapshots,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { FBUye } from '../models/FBUye';
import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root',
})
export class FbserviceService {
  aktifUye = authState(this.auth);
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) {}

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }

  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }

  OturumKapat() {
    return from(this.auth.signOut());
  }

  getUsers() {
    var ref = collection(this.fs, 'Uyeler');
    return collectionData(ref, { idField: 'uid' }) as Observable<FBUye[]>;
  }

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<FBUye>;
      })
    );
  }

  addNewCar(car: Car) {
    let ref = doc(this.fs, 'Cars', Math.ceil(Math.random() * 1000).toString());
    return from(setDoc(ref, car));
  }

  getTheCars() {
    var ref = collection(this.fs, 'Cars');
    return collectionData(ref, { idField: 'uid' }) as Observable<Car[]>;
    // as Observable<Car[]>
  }

  editTheCar(car: Car) {
    var ref = doc(this.fs, 'Cars', car.uid);
    return from(updateDoc(ref, { ...car }));
  }

  deleteTheCar(car: Car) {
    var ref = doc(this.fs, 'Cars', car.uid);
    return deleteDoc(ref);
  }

  getTheRentACar(car: Car) {
    console.log(car);
    var ref = doc(this.fs, 'Cars/', car.uid);
    return from(updateDoc(ref, { ...car }));
  }

  //   GorevListele() {
  //     var ref = collection(this.fs, 'Gorevler');
  //     return this.aktifUye.pipe(
  //       concatMap((user) => {
  //         const myQuery = query(ref, where('uid', '==', user?.uid));
  //         return collectionData(myQuery, { idField: 'gorevId' }) as Observable<
  //           Gorev[]
  //         >;
  //       })
  //     );
  //   }
  //   GorevEkle(gorev: Gorev) {
  //     var ref = collection(this.fs, 'Gorevler');
  //     return this.aktifUye.pipe(
  //       take(1),
  //       concatMap((user) =>
  //         addDoc(ref, {
  //           baslik: gorev.baslik,
  //           aciklama: gorev.aciklama,
  //           tamam: gorev.tamam,
  //           uid: user?.uid,
  //         })
  //       ),
  //       map((ref) => ref.id)
  //     );
  //   }
  //   GorevDuzenle(gorev: Gorev) {
  //     var ref = doc(this.fs, 'Gorevler/' + gorev.gorevId);
  //     return updateDoc(ref, { ...gorev });
  //   }
  //   GorevSil(gorev: Gorev) {
  //     var ref = doc(this.fs, 'Gorevler/' + gorev.gorevId);
  //     return deleteDoc(ref);
  //   }

  //   UyeListele() {
  //     var ref = collection(this.fs, 'Uyeler');
  //     return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  //   }
  UyeEkle(uye: FBUye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  //   UyeDuzenle(uye: Uye) {
  //     var ref = doc(this.fs, 'Uyeler', uye.uid);
  //     return from(updateDoc(ref, { ...uye }));
  //   }
  //   UyeSil(uye: Uye) {
  //     var ref = doc(this.fs, 'Uyeler', uye.uid);
  //     return deleteDoc(ref);
  //   }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
}
