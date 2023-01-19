import React from "react";
import { observer } from "mobx-react";
import { productsStore } from "../store/ProductsStore";

export const ProductList: React.FC = observer(() => {
  const { products, addToCart } = productsStore;

  return (
    <div>
      {products.map((product) => (
        <ul key={product.id}>
          <li>
            {product.title}
            <br />
            <cite>{product.price}</cite>
            <button onClick={() => addToCart(product.id, 1)}>
              Add to Cart
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
});
