import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
import { CreateOrder } from '../../models/order.model';
import { AddressService } from '../../services/address.service';
import { Address, CreateAddress } from '../../models/address.model';
import { NotificationService } from '../../services/notification.service';

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

  addressTouched = {
    fullName: false,
    phone: false,
    addressLine1: false,
    city: false,
    state: false,
    postalCode: false,
    country: false
  };

  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardTouched = {
    cardNumber: false,
    cardExpiry: false,
    cardCvv: false
  };

  upiId = '';
  upiTouched = false;

  placing = false;
  error = '';

  selectedPayment: number = -1;
  selectedCardOption: 'credit' | 'debit' | 'netbanking' = 'credit';
  selectedBank: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private addressService: AddressService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.loadCart();
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: res => { this.addresses = res.data; },
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

  markAddressTouched(field: keyof typeof this.addressTouched) {
    this.addressTouched[field] = true;
  }

  markCardTouched(field: keyof typeof this.cardTouched) {
    this.cardTouched[field] = true;
  }

  // Address validators
  get fullNameInvalid() { return this.addressTouched.fullName && this.newAddress.fullName.trim() === ''; }
  get phoneInvalid() { return this.addressTouched.phone && !/^[0-9]{10}$/.test(this.newAddress.phone); }
  get addressLine1Invalid() { return this.addressTouched.addressLine1 && this.newAddress.addressLine1.trim() === ''; }
  get cityInvalid() { return this.addressTouched.city && this.newAddress.city.trim() === ''; }
  get stateInvalid() { return this.addressTouched.state && this.newAddress.state.trim() === ''; }
  get postalCodeInvalid() { return this.addressTouched.postalCode && !/^[0-9]{6}$/.test(this.newAddress.postalCode); }
  get countryInvalid() { return this.addressTouched.country && this.newAddress.country.trim() === ''; }

  // Card validators
  get cardNumberInvalid() { return this.cardTouched.cardNumber && !/^[0-9]{16}$/.test(this.cardNumber.replace(/\s/g, '')); }
  get cardExpiryInvalid() { return this.cardTouched.cardExpiry && !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(this.cardExpiry); }
  get cardCvvInvalid() { return this.cardTouched.cardCvv && !/^[0-9]{3,4}$/.test(this.cardCvv); }

  // UPI validator
  get upiInvalid() { return this.upiTouched && !/^[\w.\-]+@[\w]+$/.test(this.upiId.trim()); }

  placeOrder() {
    this.error = '';

    if (!this.selectedAddressId) {
      this.error = 'Please select a delivery address';
      return;
    }

    if (this.isNewAddress) {
      Object.keys(this.addressTouched).forEach(
        key => (this.addressTouched[key as keyof typeof this.addressTouched] = true)
      );

      const a = this.newAddress;
      if (
        !a.fullName || !/^[0-9]{10}$/.test(a.phone) ||
        !a.addressLine1 || !a.city || !a.state ||
        !/^[0-9]{6}$/.test(a.postalCode) || !a.country
      ) {
        this.error = 'Please fix the errors in the address form';
        return;
      }
    }

    if (this.selectedPayment === -1) {
      this.error = 'Please select a payment method';
      return;
    }

    // Card validation
    if (this.selectedPayment === 0 && (this.selectedCardOption === 'credit' || this.selectedCardOption === 'debit')) {
      Object.keys(this.cardTouched).forEach(
        key => (this.cardTouched[key as keyof typeof this.cardTouched] = true)
      );
      if (this.cardNumberInvalid || this.cardExpiryInvalid || this.cardCvvInvalid) {
        this.error = 'Please fix the errors in the card details';
        return;
      }
    }

    // Netbanking validation
    if (this.selectedPayment === 0 && this.selectedCardOption === 'netbanking' && !this.selectedBank) {
      this.error = 'Please select a bank to proceed';
      return;
    }

    // UPI validation
    if (this.selectedPayment === 1) {
      this.upiTouched = true;
      if (this.upiInvalid || !this.upiId.trim()) {
        this.error = 'Please enter a valid UPI ID (e.g. name@upi)';
        return;
      }
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
    const payload: CreateOrder = {
      shippingAddressId: Number(this.selectedAddressId),
      paymentMethod: this.mapPayment(),
      items: this.cart?.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.totalPrice
      })) || []
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        this.placing = false;
        if (res.success) {
          this.notification.showSuccess('Order placed successfully! 🎉');
          setTimeout(() => this.router.navigate(['/orders']), 1500);
        } else {
          this.notification.showError(res.message || 'Order failed');
          this.error = res.message || 'Order failed';
        }
      },
      error: (err) => {
        this.placing = false;
        const msg = err.error?.message || 'Order failed';
        this.notification.showError(msg);
        this.error = msg;
      }
    });
  }

  // COD returns 3 — distinct from card (1), UPI (2), and fallback (-1)
  mapPayment(): number {
    if (this.selectedPayment === 0) return 1; // Card / NetBanking
    if (this.selectedPayment === 1) return 2; // UPI
    if (this.selectedPayment === 2) return 3; // COD
    return -1;
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
          this.addressTouched.city = true;
          this.addressTouched.state = true;
          this.addressTouched.country = true;
        }
      },
      error: (err) => console.error(err)
    });
  }
}