import React from 'react';
const useLocalStorageState = (localStorageKey, initialValue, { serializer = JSON.stringify, deserializer = JSON.parse}={}) => {
 if(!localStorageKey) {
    throw new Error('useLocalStorageState needs a key to save data, you did not provide any');
 }
    const localStorageKeyRef = React.useRef(localStorageKey);
    const [value, setValue] = React.useState(() => {
        const valueInLocalStorage = window.localStorage.getItem(localStorageKey);
        if(valueInLocalStorage) {
            return deserializer(valueInLocalStorage);
        }else {
            return typeof initialValue === 'function' ? initialValue() : initialValue;
        }
    })


  React.useEffect(()=> {
    if(localStorageKey !== localStorageKeyRef.current) {
        window.localStorage.removeItem(localStorageKeyRef.current);
    }
    localStorageKeyRef.current = localStorageKey;
    window.localStorage.setItem(localStorageKey, serializer(value));
  }, [localStorageKey, value, serializer]);

  return [
    value, 
    setValue
  ]
};


export default useLocalStorageState;