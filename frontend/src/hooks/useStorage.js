import { useCallback, useEffect, useState } from "react";

const useStorage = (key, defaultValue, storage) => {
  const [value, setValue] = useState(() => {
    const jsonValue = storage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    if (value === undefined) return storage.removeItem(key);
    storage.setItem(key, JSON.stringify(value));
  });

  const reset = useCallback(() => {
    setValue(defaultValue);
  }, []);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, reset, remove];
};

const useSessionStorage = (key, defaultValue) =>
  useStorage(key, defaultValue, sessionStorage);

const useLocalStorage = (key, defaultValue) =>
  useStorage(key, defaultValue, localStorage);

export { useLocalStorage, useSessionStorage };
