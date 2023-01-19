import { observable, action, computed, makeAutoObservable } from "mobx";

export interface Product {
  id: number;
  title: string;
  price: number;
}

export interface CartItem {
  productId: number;
  amount: number;
}

export class ProductsStore {
  @observable products: Product[] = [];
  @observable cart: CartItem[] =
    JSON.parse(localStorage.getItem("cart") as any) || [];

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setProducts(products: Product[]) {
    this.products = products;
  }

  @action
  addToCart = (productId: number, amount: number) => {
    const existingItem = this.cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.amount += amount;
    } else {
      this.cart.push({ productId, amount });
    }
    localStorage.setItem("cart", JSON.stringify(this.cart));
  };

  @action
  removeFromCart = (productId: number) => {
    this.cart = this.cart.filter((item) => item.productId !== productId);
    console.log(productId, this.cart);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  };

  @computed
  get total() {
    return this.cart.reduce((total, item) => {
      const product = this.products.find(
        (product) => product.id === item.productId
      ) as Product;
      total += product.price * item.amount;
      return total;
    }, 0);
  }
}

const productsStore = new ProductsStore();

export { productsStore };
