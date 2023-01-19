import { observer } from "mobx-react";
import { Product, productsStore } from "../store/ProductsStore";

export const CartList: React.FC = observer(() => {
  const { cart, products, removeFromCart, total } = productsStore;

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
