import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs';
import { CreditCardPaymentFacade } from '../store/facade';
import { currentDate } from '../store/reducer';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();

  paymentForm: FormGroup;
  errorMessage: string;
  currentDate = new Date();
  currentMonth = currentDate.getMonth() + 1;
  currentYear = currentDate.getFullYear();

  constructor(private formBuilder: FormBuilder, private facade: CreditCardPaymentFacade) { }

  ngOnInit() {
    this.errorMessage = "Please Fill all fields";
    this.buildForm();
  }


  buildForm() {
    this.paymentForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      lastname: ['', [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      email: ['', [Validators.required,Validators.minLength(5),Validators.pattern('^[A-Za-z][A-Za-z -]*@')]],
      budget: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(3),Validators.min(111),Validators.max(999)]],
      phoneNumber: ['', [Validators.required,Validators.minLength(6),Validators.min(1111111111111111),Validators.max(9999999999999999)]],
   });
  }

 // convenience getter for easy access to form fields
 get formControls() { return this.paymentForm.controls; }

 onSubmit() {
   this.submitForm();
  }

  submitForm() {
  if (this.paymentForm.status === 'VALID') {
    const expiryDate = new Date(this.paymentForm.get('expirationYear').value, this.paymentForm.get('expirationMonth').value, 1)
    const paymentFormData = {
      creditCardNumber: this.paymentForm.get('cardNumber').value.toString(),
      cardHolder: this.paymentForm.get('nameOnCard').value,
      expirationDate: expiryDate,
      securityCode: this.paymentForm.get('cardCVVNumber').value,
      amount: +this.paymentForm.get('amount').value,
    };

    this.facade.makePayment(paymentFormData);
    // this.paymentService.makePayment(paymentFormData).subscribe(
    //   response => {
    //     if(response.body.status === 'success') {
    //       this.toasterService.pop('success', 'SUCCESSFUL', 'Your payment was successful')
    //     } else {
    //       this.toasterService.pop('error', 'FAILURE', 'Your payment Failed please try again later')
    //     }
    //   }
    // )
  } else {
    this.errorMessage = "the Form is Invalid!";
  }
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}