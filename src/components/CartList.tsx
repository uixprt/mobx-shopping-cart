import { observer } from "mobx-react";
import { Product, productsStore, cartStore } from "../store";

export const CartList: React.FC = observer(() => {
  const { products } = productsStore;
  const { cart, removeFromCart, total } = cartStore;

  return (
    <div>
      {cart.map((item) => {
        const product = products.find(
          (product) => product.id === item.productId
        ) as Product;
        return (
          <div key={item.productId}>
            <h3>{product?.title}</h3>
            <p>Quantity: {item.amount}</p>
            <p>Price: {product.price * item.amount}</p>
            <button onClick={() => removeFromCart(item.productId)}>
              Remove from Cart
            </button>
          </div>
        );
      })}
      <h4>Total: {total}</h4>
    </div>
  );
});
