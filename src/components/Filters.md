<b>My question:</b>

In my shopping cart react and mobx application I need to adding a filter above of the products list JSX component, the products list itself is fetched by react-query library from json server in https://fakestoreapi.com/products.

the typescript product model looks like this:

```ts
interface Product {
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
```

the current mobx store:

```ts
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
```

I need adding:

1. a search box that can filter the products by title and/or description
2. filter by price range (eg. contain a checkboxes of a. under 50, b. above 50 but under 100, c. above 100)
3. filter by ratings
4. each filter can be apliied sepertely or with another filter
5. each filter has a seperate jsx component

<b>The ChatGPT answer:</b>

1. To add a search box that can filter the products by title and/or description, you can create a new store variable, such as "searchTerm", and update it with an action when the search input value changes. Then, in your products list component, you can filter the products using the searchTerm, by checking if the title or description of each product includes the searchTerm.
2. To filter by price range, you can create new store variables, such as "priceRangeUnder50", "priceRange50to100", and "priceRangeOver100", and update them with actions when the corresponding checkboxes are clicked. Then, in your products list component, you can filter the products based on their price and the selected price range filters.
3. To filter by ratings, you can create new store variables, such as "minRating" and "maxRating", and update them with actions when the rating filters are selected. Then, in your products list component, you can filter the products based on their rating and the selected rating range filters.
4. To allow each filter to be applied separately or with another filter, you can create a new store variable, such as "activeFilters", which is an object that keeps track of which filters are currently active. You can update this object with actions when filters are selected or deselected. Then, in your products list component, you can filter the products based on the active filters.
5. To create separate JSX components for each filter, you can create new functional components for the search box, price range filters, and rating filters. Each component can handle its own state and actions, and update the store when necessary.
6. To update the filtered list of products, you can create a computed property on your store that filters the products based on the active filters, and use this property to render the list of products in your component.

<b>My question:</b>
Do you can to add a code example for that?

<b>The ChatGPT answer:</b>
Sure, here's an example of how you can implement the filters in your MobX store and use them in your products list component:

```ts
import { action, computed, observable } from "mobx";

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
  }

  @action
  setPriceRangeUnder50(value: boolean) {
    this.priceRangeUnder50 = value;
  }

  @action
  setPriceRange50to100(value: boolean) {
    this.priceRange50to100 = value;
  }

  @action
  setPriceRangeOver100(value: boolean) {
    this.priceRangeOver100 = value;
  }

  @action
  setMinRating(value: number) {
    this.minRating = value;
  }

  @action
  setMaxRating(value: number) {
    this.maxRating = value;
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
  get filteredProducts() {
    let filtered = this.products;
    if (this.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.includes(this.searchTerm) ||
          product.description.includes(this.searchTerm)
      );
    }
    if (this.priceRangeUnder50) {
      filtered = filtered.filter((product) => product.price < 50);
    }
    if (this.priceRange50to100) {
      filtered = filtered.filter(
        (product) => product.price >= 50 && product.price < 100
      );
    }
    if (this.priceRangeOver100) {
      filtered = filtered.filter((product) => product.price >= 100);
    }
    if (this.minRating) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= this.minRating
      );
    }
    if (this.maxRating) {
      filtered = filtered.filter(
        (product) => product.rating.rate <= this.maxRating
      );
    }
    return filtered;
  }

  @computed
  get total() {
    return this.cart.reduce((total, item) => {
      const product = this.filteredProducts.find(
        (product) => product.id === item.productId
      ) as Product;
      total += product.price * item.amount;
      return total;
    }, 0);
  }
}
```

In your product list component, you can use the `filteredProducts` computed property to render the filtered list of products:

```tsx
import { observer } from "mobx-react";
import { ProductsStore } from "./store";

const ProductsList: React.FC = observer(() => {
  const store = useContext(ProductsStore);

  return (
    <div>
      {store.filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});
```

And in your filter component, you can use the store's actions and variables to update the filters and render the filter UI.

It's important to note that this is just one way to implement the filters, and you can adjust it to fit your specific use case.

<b>My question:</b>
Can you add the implementation in the code example for 4 and 6?

<b>The ChatGPT answer:</b>
Sure, here's an example of how you can implement the active filters in your MobX store and use them in your products list component:

```ts
import { action, computed, observable } from "mobx";

interface ActiveFilters {
  search: boolean;
  priceRangeUnder50: boolean;
  priceRange50to100: boolean;
  priceRangeOver100: boolean;
  minRating: boolean;
  maxRating: boolean;
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
    maxRating: false,
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
      filtered = filtered.filter(
        (product) => product.price >= 50 && product.price < 100
      );
    }
    if (this.activeFilters.priceRangeOver100) {
      filtered = filtered.filter((product) => product.price >= 100);
    }
    if (this.activeFilters.minRating) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= this.minRating
      );
    }
    if (this.activeFilters.maxRating) {
      filtered = filtered.filter(
        (product) => product.rating.rate <= this.maxRating
      );
    }
    return filtered;
  }

  @computed
  get total() {
    return this.cart.reduce((total, item) => {
      const product = this.filteredProducts.find(
        (product) => product.id === item.productId
      ) as Product;
      total += product.price * item.amount;
      return total;
    }, 0);
  }
}
```

In your filter component, you can use the store's variables and actions to update the active filters, and use the activeFilters object to render the filter UI.

```tsx
import { observer } from "mobx-react";
import { ProductsStore } from "./store";

const FilterComponent: React.FC = observer(() => {
  const store = useContext(ProductsStore);

  return (
    <div>
      <label>
        Search:
        <input
          type="text"
          value={store.searchTerm}
          onChange={(e) => store.setSearchTerm(e.target.value)}
        />
      </label>
      <label>
        Price range under 50:
        <input
          type="checkbox"
          checked={store.priceRangeUnder50}
          onChange={(e) => store.setPriceRangeUnder50(e.target.checked)}
        />
      </label>
      <label>
        Price range 50 to 100:
        <input
          type="checkbox"
          checked={store.priceRange50to100}
          onChange={(e) => store.setPriceRange50to100(e.target.checked)}
        />
      </label>
      <label>
        Price range over 100:
        <input
          type="checkbox"
          checked={store.priceRangeOver100}
          onChange={(e) => store.setPriceRangeOver100(e.target.checked)}
        />
      </label>
      <label>
        Min rating:
        <select
          value={store.minRating}
          onChange={(e) => store.setMinRating(parseInt(e.target.value))}
        >
          <option value={0}>No minimum</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
      <label>
        Max rating:
        <select
          value={store.maxRating}
          onChange={(e) => store.setMaxRating(parseInt(e.target.value))}
        >
          <option value={5}>No maximum</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
    </div>
  );
});
```

You can also add a button or a link that clears all the filters, by setting all the filter variables to their default values (false for checkboxes, empty string for search, and 0 or 5 for min and max rating) and activeFilters object to default.
It's important to note that this is just one way to implement the active filters, and you can adjust it to fit your specific use case.
You can also add a clearAllFilters function in the store that sets all the filter variables to their default values and activeFilters object to default.

```ts
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
```

Then in the filter component, you can add a button or a link that triggers this function to clear all the filters.

```tsx
<button onClick={store.clearAllFilters}>Clear All Filters</button>
```

Please let me know if you have any other question.
