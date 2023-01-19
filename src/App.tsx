import { Provider } from "mobx-react";
import { useQuery } from "react-query";
import { productsStore, Product } from "./store/ProductsStore";
import { ProductList, CartList } from "./components";

function App() {
  const { status, error } = useQuery<Product[], Error>("products", async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    productsStore.setProducts(products);
    return products;
  });

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;

  return (
    <Provider productsStore={productsStore}>
      <ProductList />
      <CartList />
    </Provider>
  );
}

export default App;
