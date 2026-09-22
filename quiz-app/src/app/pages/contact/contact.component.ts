import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Log form data ra console theo yêu cầu tài liệu Task 2
    console.log('=== Contact Form Submitted ===');
    console.log(this.contactForm.value);

    this.isSubmitted = true;
    this.contactForm.reset();

    // Ẩn thông báo sau 5 giây
    setTimeout(() => this.isSubmitted = false, 5000);
  }

  /** Helper kiểm tra control có lỗi và đã touched */
  hasError(controlName: string, errorType: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.hasError(errorType) && control.touched;
  }
}
