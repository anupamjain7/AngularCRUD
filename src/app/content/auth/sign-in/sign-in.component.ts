import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignInService } from './services/sign-in.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
  logInForm!: FormGroup;
  role: number = 1;
  signRole: number=1;
  getData: any;
  fieldTextType: boolean = false;
  fieldTextType2: boolean = true;
  passwordShow: boolean = false;
 

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router, 
    private LoginService: SignInService,
    ) {
   
  }

  ngOnInit(): void{
    this.route.queryParams.subscribe((params) => {
      this.signRole = params["role"];
    });
    
    this.initform();
  }

  initform() {
    
    this.logInForm = this.fb.group({
      username: [
        "",
        Validators.compose([Validators.required]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
        ]),
      ],
    });
  }

 

  login() {
    let data = {
      username: this.logInForm.value.username,
      password: this.logInForm.value.password,
    };
  
    this.LoginService.login(data).subscribe((res: any) => {
      if(res.user === true) {
        this.toastrService.success("Logged in Successfully")
        this.getData = res;
        localStorage.setItem('greatfuture', res.token);
        this.cd.detectChanges();
        this.router.navigate(['/party']);
      }
      
    },
    (error: any) => {
      this.toastrService.error('Please enter valid login credentials');
    }
  )}

  toggleFieldTextType(val: any): void {
      if(val == 2){
        this.fieldTextType2 = false;
        this.fieldTextType = true;
        this.passwordShow = true;
      } else{
        this.fieldTextType = false;
        this.fieldTextType2 = true;
        this.passwordShow = false;
      }
    }
}
