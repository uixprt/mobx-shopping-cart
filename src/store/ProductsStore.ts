import { observable, action, computed, makeAutoObservable } from "mobx";
import { filtersStore } from "./FiltersStore";

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

export class ProductsStore {
  @observable products: Product[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setProducts(products: Product[]) {
    this.products = products;
  }

  @computed
  get filteredProducts() {
    let filtered = this.products;
    const { activeFilters } = filtersStore;

    if (activeFilters.search) {
      filtered = filtered.filter(
        (product) =>
          product.title
            .toLowerCase()
            .includes(filtersStore.searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(filtersStore.searchTerm.toLowerCase())
      );
    }
    if (activeFilters.priceRangeUnder50) {
      filtered = filtered.filter((product) => product.price < 50);
    }
    if (activeFilters.priceRange50to100) {
      filtered = filtered.filter(
        (product) => product.price >= 50 && product.price < 100
      );
    }
    if (activeFilters.priceRangeOver100) {
      filtered = filtered.filter((product) => product.price >= 100);
    }
    if (activeFilters.minRating) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= filtersStore.minRating
      );
    }
    if (activeFilters.maxRating) {
      filtered = filtered.filter(
        (product) => product.rating.rate <= filtersStore.maxRating
      );
    }
    return filtered;
  }
}

const productsStore = new ProductsStore();

export { productsStore };
