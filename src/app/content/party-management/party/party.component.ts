import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartyService } from './services/party.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent {
  config:any;
  data: any;
  noData: boolean = true;
  


  constructor(private cd: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private partyService: PartyService) {
    }
  ngOnInit(): void {
    
    const tokenData = localStorage.getItem('greatfuture');
    if(!tokenData){
     this.router.navigate(['/'])
    }
    this.getPartyList();
  }

  getPartyList(){
  
    this.partyService.getParty().subscribe(
      (response: any) => {
        this.data = response;
        if(this.data.length > 0)
          this.noData = false;
        else
        this.noData = true;
      },
      (error: any) => {
          this.toastrService.error("Failed to load details");
      }
    );
  }

  checkValue(value: any): string {
    return value;
  }
  formatAddress(address: any): string {
    if(address == '') {
      return 'NA';
    }
    const concatenatedAddress = `${address.address_line_1 || ''}, ${address.address_line_2 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, ${address.pincode || ''}`;
    return this.checkValue(concatenatedAddress);
  }
  checkArray(array: any[]): string {
    return !array || array.length === 0 ? 'NA' : '';
  }
  editItem(id: any): void {
    this.router.navigate(["/add-party"], {
      queryParams: { id: id, role: 2 },
    });
  }

  deleteItem(item:number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.partyService.deleteParty(item).subscribe(
        () => {
          this.toastrService.success('Item deleted successfully');
          this.cd.detectChanges();
        },
        (error: any) => {
          this.toastrService.error('Failed to delete item');
        }
      );

    }
    this.data = [];
    setTimeout(() => {
      this.getPartyList(); 
      
    }, 2000);
    
  }
}
