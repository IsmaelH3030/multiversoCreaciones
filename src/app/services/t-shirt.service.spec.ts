import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { throwError } from 'rxjs';
import { TShirtService } from './t-shirt.service';

describe('TShirtService', () => {
  let service: TShirtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TShirtService,
        { provide: AngularFireStorage, useValue: {} },
        { provide: AngularFirestore, useValue: { collection: jasmine.createSpy() } }
      ]
    });

    service = TestBed.inject(TShirtService);
  });

  it('should return fallback products when Firestore access is denied', (done) => {
    const firestore = TestBed.inject(AngularFirestore) as any;
    firestore.collection.and.returnValue({
      valueChanges: () => throwError(() => new Error('Missing or insufficient permissions'))
    });

    service.getTShirts().subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].description).toContain('Camiseta');
      done();
    });
  });
});
