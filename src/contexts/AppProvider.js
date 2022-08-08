import React, { useState, createContext, useContext } from 'react';

export const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
}

const AppProvider = ({ children }) => {
  const [ json, setJson ] = useState([]);
  const [ data, setData ] = useState([]);

  return (
    <AppContext.Provider value={{ json, data }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider;