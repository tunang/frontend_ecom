import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

const TestStore = ({store}) => {
  const { items, message } = useCartStore();
  const { user } = useAuthStore();

  switch (store) {
    case "cart":
      return <div>
        <h1>Cart</h1>
        <pre>{JSON.stringify(items, null, 2)}</pre>
        <pre>{JSON.stringify(message, null, 2)}</pre>
      </div>;
    case "user":
      return <div>
        <h1>User</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>;
  }
};

export default TestStore;
