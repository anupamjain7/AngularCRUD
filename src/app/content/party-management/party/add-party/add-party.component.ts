import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartyService } from '../services/party.service';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss']
})
export class AddPartyComponent implements OnInit {
  createForm!: FormGroup;
  selectedFile: File | null = null;
  partyId: string | null = null;
  role: number = 0;
  imageUrl: string | ArrayBuffer | null = null;
  profImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    const tokenData = localStorage.getItem('greatfuture');
    if(!tokenData){
     this.router.navigate(['/'])
    }
    this.route.queryParams.subscribe(params => {
      this.partyId = params['id'];
      this.role = params['role'];
    });

    this.createForm = this.fb.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      telephone_no: [''],
      whatsapp_no: [''],
      email: ['', [Validators.required, Validators.email]],
      remark: [''],
      login_access: [false],
      date_of_birth: [''],
      anniversary_date: [''],
      gstin: ['', [Validators.required]],
      pan_no: [''],
      apply_tds: [false],
      credit_limit: [],
      address: this.fb.array([]),
      bank: this.fb.array([])
    });

    if (this.role == 2 && this.partyId) {
      this.getPartyDetails(this.partyId);
    } else {
      this.addAddress();
      this.addBank();
    }
  }
  replaceNullWithNA(formValue: any): any {
    for (const key in formValue) {
      if (formValue[key] === null) {
        formValue[key] = 'NA';
      } else if (typeof formValue[key] === 'object' && !Array.isArray(formValue[key])) {
        this.replaceNullWithNA(formValue[key]);
      } else if (Array.isArray(formValue[key])) {
        formValue[key] = formValue[key].map((item: any) => this.replaceNullWithNA(item));
      }
    }
    return formValue;
  }
  getPartyDetails(id: string): void {
    this.partyService.getPartyById(id).subscribe(
      (response: any) => {
        this.createForm.patchValue(response);

        // Clear existing addresses and banks
        while (this.address.length) {
          this.address.removeAt(0);
        }
        while (this.bank.length) {
          this.bank.removeAt(0);
        }

        // Add addresses and banks from data
        response.address.forEach((address: any) =>
          this.address.push(this.fb.group(address))
        );
        response.bank_id.forEach((bank: any) =>
          this.bank.push(this.fb.group(bank))
        );
        
      },
      (error: any) => {
        this.toastrService.error('Failed to load party details.');
      }
    );
  }

  get f() {
    return this.createForm.controls;
  }

  get address(): FormArray {
    return this.createForm.get('address') as FormArray;
  }

  get bank(): FormArray {
    return this.createForm.get('bank') as FormArray;
  }

  newAddress(): FormGroup {
    return this.fb.group({
      address_line_1: [''],
      address_line_2: [''],
      country: [''],
      state: [''],
      city: [''],
      pincode: ['']
    });
  }

  newBank(): FormGroup {
    return this.fb.group({
      bank_ifsc_code: [''],
      bank_name: [''],
      branch_name: [''],
      account_no: [''],
      account_holder_name: ['']
    });
  }

  addAddress(): void {
    this.address.push(this.newAddress());
  }

  removeAddress(index: number): void {
    this.address.removeAt(index);
  }

  addBank(): void {
    this.bank.push(this.newBank());
  }

  removeBank(index: number): void {
    this.bank.removeAt(index);
  }

 
  replaceNulls(value: any): any {
    if (value === null) {
      return '';
    } else if (Array.isArray(value)) {
      return value.map(item => this.replaceNulls(item));
    } else if (typeof value === 'object' && value !== null) {
      const newObj: any = {};
      Object.keys(value).forEach(key => {
        newObj[key] = this.replaceNulls(value[key]);
      });
      return newObj;
    } else {
      return value;
    }
  }
  onSubmit(): void {
    if (this.createForm.invalid) {
      this.toastrService.error('Please fill in all required fields correctly.');
      return;
    }

    const formValue = this.replaceNulls(this.createForm.value);

    const formData = new FormData();
    Object.keys(formValue).forEach(key => {
      if (key === 'address' || key === 'bank') {
        formData.append(key, JSON.stringify(formValue[key]));
      } else if (key === 'image' && this.selectedFile) {
        formData.append(key, this.selectedFile, this.selectedFile.name);
      } else {
        formData.append(key, formValue[key]);
      }
    });

    if (this.partyId) {
      // Update existing party
      this.partyService.updateParty(this.partyId, formData).subscribe(
        (response: any) => {
          this.toastrService.success('Details updated successfully');
          this.createForm.reset();
          this.address.clear();
          this.bank.clear();
          this.addAddress();
          this.addBank();
          this.router.navigate(['/party']);

        },
        (error: any) => {
          this.handleErrorResponse(error);
        }
      );
    } else {
      // Create new party
      this.partyService.postParty(formData).subscribe(
        (response: any) => {
          this.toastrService.success('Details submitted successfully');
          this.createForm.reset();
          this.address.clear();
          this.bank.clear();
          this.addAddress();
          this.addBank();
          this.router.navigate(['/party']);

        },
        (error: any) => {
          this.handleErrorResponse(error);
        }
      );
    }

  }

  private handleErrorResponse(error: any): void {
    if (error.error.success === false) {
      if (error.error.error.email) 
        this.toastrService.error(error.error.error.email);
      if (error.error.error.credit_limit) 
        this.toastrService.error(error.error.error.credit_limit);
      if (error.error.error.gstin) 
        this.toastrService.error(error.error.error.gstin);
      if (error.error.error.pan_no) 
        this.toastrService.error(error.error.error.pan_no);
      if (error.error.error.apply_tds) 
        this.toastrService.error(error.error.error.apply_tds);
      if (error.error.error.mobile_no) 
        this.toastrService.error(error.error.error.mobile_no);
      if(error.error.error.image)
      this.toastrService.error(error.error.error.image);
      if(error.error.error.date_of_birth)
        this.toastrService.error(error.error.error.date_of_birth);
      if(error.error.error.login_access)
        this.toastrService.error(error.error.error.login_access);
      if(error.error.error.anniversary_date)
        this.toastrService.error(error.error.error.anniversary_date);
      if (error.error.error.address) 
        this.toastrService.error(error.error.error.address);
      if (error.error.error.bank) 
        this.toastrService.error(error.error.error.bank);
    } else {
      this.toastrService.error('Failed to submit details. Please try again.');
    }
  }
}
