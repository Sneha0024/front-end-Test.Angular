/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserDetailsComponent } from './user-details.component';
import { CreditCardPaymentFacade } from '../store/facade';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector, DefaultProjectorFn, Store, Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import {
  initialState,
  PaymentState,
} from '../store/reducer';
import { State } from '../store';
import { CreditCardQuery } from '../store/selectors';
import { PaymentService } from '../services/payment.service';
import { Observable } from 'rxjs';

describe('UserDetailsComponent', () => {
  let actions$: Observable<Action>;

  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let store: MockStore<State>;
  let paymentStateSelector: MemoizedSelector<
    State,
    PaymentState,
    DefaultProjectorFn<PaymentState>
  >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserDetailsComponent],
      providers: [
        CreditCardPaymentFacade,
        PaymentService,
        FormBuilder,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    const cardState = initialState;
    paymentStateSelector = store.overrideSelector(
      CreditCardQuery.getPaymentState,
      cardState
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});