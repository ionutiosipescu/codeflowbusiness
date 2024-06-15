import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  return (
    <div>
      <h1>Items</h1>
      <button onClick={fetchItems}>Fetch Items</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
