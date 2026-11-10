import { useEffect, useState } from "react";
import { getRates } from "../api/currencyApi";

let cache = null;
let pending = null;

function useRates() {
  const [data, setData] = useState(cache);

  useEffect(() => {
    if (cache) return;
    if (!pending) {
      pending = getRates()
        .then((result) => {
          cache = result;
          return result;
        })
        .catch(() => null)
        .finally(() => {
          pending = null;
        });
    }
    let active = true;
    pending.then((result) => {
      if (active && result) setData(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return data;
}

export default useRates;