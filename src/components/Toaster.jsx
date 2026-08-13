import { useEffect, useState } from "react";
import { subscribeToasts } from "../lib/toast";

export default function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToasts((t) => {
      setItems((p) => [...p, t]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== t.id)), 2600);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {items.map((t) => (
        <div key={t.id} className="ws-toast" role="status">
          {t.icon && (
            <span aria-hidden="true">
              <t.icon size={15} strokeWidth={1.8} />
            </span>
          )}
          {t.message}
        </div>
      ))}
    </>
  );
}
