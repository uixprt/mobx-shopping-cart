import { observable, action, computed, makeAutoObservable } from "mobx";

export interface ActiveFilters {
  search: boolean;
  priceRangeUnder50: boolean;
  priceRange50to100: boolean;
  priceRangeOver100: boolean;
  minRating: boolean;
  maxRating: boolean;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  productId: number;
  amount: number;
}

export class ProductsStore {
  @observable products: Product[] = [];
  @observable cart: CartItem[] =
    JSON.parse(localStorage.getItem("cart") as any) || [];
  @observable searchTerm = "";
  @observable priceRangeUnder50 = false;
  @observable priceRange50to100 = false;
  @observable priceRangeOver100 = false;
  @observable minRating = 0;
  @observable maxRating = 5;
  @observable activeFilters: ActiveFilters = {
    search: false,
    priceRangeUnder50: false,
    priceRange50to100: false,
    priceRangeOver100: false,
    minRating: false,
    maxRating: false
  };

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setProducts(products: Product[]) {
    this.products = products;
  }

  @action
  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.activeFilters.search = !!term;
  }

  @action
  setPriceRangeUnder50(value: boolean) {
    this.priceRangeUnder50 = value;
    this.activeFilters.priceRangeUnder50 = value;
  }

  @action
  setPriceRange50to100(value: boolean) {
    this.priceRange50to100 = value;
    this.activeFilters.priceRange50to100 = value;
  }

  @action
  setPriceRangeOver100(value: boolean) {
    this.priceRangeOver100 = value;
    this.activeFilters.priceRangeOver100 = value;
  }

  @action
  setMinRating(value: number) {
    this.minRating = value;
    this.activeFilters.minRating = value > 0;
  }

  @action
  setMaxRating(value: number) {
    this.maxRating = value;
    this.activeFilters.maxRating = value < 5;
  }

  @computed
  get filteredProducts() {
    let filtered = this.products;
    if (this.activeFilters.search) {
      filtered = filtered.filter(
          (product) =>
              product.title.includes(this.searchTerm) ||
              product.description.includes(this.searchTerm)
      );
    }
    if (this.activeFilters.priceRangeUnder50) {
      filtered = filtered.filter((product) => product.price < 50);
    }
    if (this.activeFilters.priceRange50to100) {
      filtered = filtered.filter((product) => product.price >= 50 && product.price < 100);
    }
    if (this.activeFilters.priceRangeOver100) {
      filtered = filtered.filter((product) => product.price >= 100);
    }
    if (this.activeFilters.minRating) {
      filtered = filtered.filter((product) => product.rating.rate >= this.minRating);
    }
    if (this.activeFilters.maxRating) {
      filtered = filtered.filter((product) => product.rating.rate <= this.maxRating);
    }
    return filtered;
  }

  @action
  clearAllFilters = () => {
    this.searchTerm = "";
    this.priceRangeUnder50 = false;
    this.priceRange50to100 = false;
    this.priceRangeOver100 = false;
    this.minRating = 0;
    this.maxRating = 5;
    this.activeFilters = {
      search: false,
      priceRangeUnder50: false,
      priceRange50to100: false,
      priceRangeOver100: false,
      minRating: false,
      maxRating: false
    }
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
