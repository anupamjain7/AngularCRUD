import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './content/auth/sign-in/sign-in.component';
import { PartyComponent } from './content/party-management/party/party.component';
import { AddPartyComponent } from './content/party-management/party/add-party/add-party.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SignInComponent,
        pathMatch: "full",
      },
      {
        path: "party",
        component: PartyComponent,
        pathMatch: "full",
      },
      {
        path: "add-party",
        component: AddPartyComponent,
        pathMatch: "full",
      }
      
    


]
  }]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
