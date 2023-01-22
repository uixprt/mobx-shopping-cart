import React from "react";
import { observer } from "mobx-react";
import { productsStore, cartStore } from "../store";

export const ProductList: React.FC = observer(() => {
  const { filteredProducts } = productsStore;
  const { addToCart } = cartStore;

  return (
    <div>
      {filteredProducts.map((product) => (
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
