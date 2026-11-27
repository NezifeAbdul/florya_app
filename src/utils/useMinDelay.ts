import { useEffect, useState } from "react";

//Yükləmə tez bitsə də skelet ən azı ms görünür
export const useMinDelay = (loading: boolean, ms = 300) => {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setWaiting(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);

  return loading || waiting;
};