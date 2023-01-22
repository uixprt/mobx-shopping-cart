import {observable, action, makeAutoObservable} from "mobx";

interface ActiveFilters {
  search: boolean;
  priceRangeUnder50: boolean;
  priceRange50to100: boolean;
  priceRangeOver100: boolean;
  minRating: boolean;
  maxRating: boolean;
}

class FiltersStore {
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
    maxRating: false,
  };

  constructor() {
    makeAutoObservable(this);
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
      maxRating: false,
    };
  };
}

const filtersStore = new FiltersStore();

export { filtersStore };
