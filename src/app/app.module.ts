import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './content/auth/sign-in/sign-in.component';
import { PartyComponent } from './content/party-management/party/party.component';
import { AddPartyComponent } from './content/party-management/party/add-party/add-party.component';

@NgModule({
  declarations: [AppComponent, SignInComponent, PartyComponent, AddPartyComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({ 
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true, // Optional: prevent duplicates
      closeButton: true // Optional: show close button
     })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
