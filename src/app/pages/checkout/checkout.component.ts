import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
import { AddressService } from '../../services/address.service';
import { Address, CreateAddress } from '../../models/address.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  cart: Cart | null = null;

  addresses: Address[] = [];
  selectedAddressId: number | 'new' | null = null;
  isNewAddress = false;

  newAddress: CreateAddress = {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: true
  };

 
  placing = false;
  error = '';
// Payment type
selectedPayment: number = -1; // initially kuch bhi select nahi

// Card dropdown
selectedCardOption: 'credit' | 'debit' | 'netbanking' = 'credit';

// Netbanking bank
selectedBank: string = '';



  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.loadCart();
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: res => {
        this.addresses = res.data;
      },
      error: () => this.error = 'Failed to load addresses'
    });
  }

 onAddressChange(value: any) {

  if (value === 'new') {
    this.isNewAddress = true;
    this.selectedAddressId = 'new';
  } else {
    this.isNewAddress = false;
    this.selectedAddressId = value;
  }
}



placeOrder() {
  this.error = '';

  if (!this.selectedAddressId) {
    this.error = 'Please select a delivery address';
    return;
  }

  if (this.isNewAddress) {
    const a = this.newAddress;
    if (!a.fullName || !a.phone || !a.addressLine1 || !a.city || !a.state || !a.postalCode || !a.country) {
      this.error = 'Please fill all required address fields';
      return;
    }
  }

  if (this.selectedPayment === -1) {
    this.error = 'Please select a payment method';
    return;
  }

  this.placing = true;

  if (this.isNewAddress) {

    this.addressService.addAddress(this.newAddress).subscribe({
      next: (res: any) => {
        this.selectedAddressId = res.data.id;
        this.createOrder();
      },
      error: () => {
        this.placing = false;
        this.error = 'Failed to save address';
      }
    });

  } else {
    this.createOrder();
  }
}
createOrder() {

  const payload = {
    shippingAddressId: Number(this.selectedAddressId),
    paymentMethod: this.mapPayment(),

    // 🔥 ADD THIS (VERY IMPORTANT)
    productIds: this.cart?.items.map(i => i.productId) || [],
    totalAmount: this.cart?.totalAmount || 0
  };

  this.orderService.createOrder(payload).subscribe({
    next: (res) => {
      this.placing = false;

      if (res.success) {
        this.router.navigate(['/orders']);
      } else {
        this.error = res.message || 'Order failed';
      }
    },
    error: (err) => {
      this.placing = false;
      this.error = err.error?.message || 'Order failed';
    }
  });
}

mapPayment(): number {

  // CARD (credit/debit/netbanking sab ek hi hai)
  if (this.selectedPayment === 0) return 1;

  // UPI
  if (this.selectedPayment === 1) return 2;

  // COD
  if (this.selectedPayment === 2) return 0;

  return 0;
}


  onPincodeChange() {
  const pincode = this.newAddress.postalCode;
  if (!pincode || pincode.length !== 6) return;

  this.addressService.getAddressByPincode(pincode).subscribe({
    next: (res) => {
      const data = JSON.parse(res);

      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];

        this.newAddress.city = postOffice.District;
        this.newAddress.state = postOffice.State;
        this.newAddress.country = postOffice.Country;
      }
    },
    error: (err) => console.error(err)
  });

}
  }
  
