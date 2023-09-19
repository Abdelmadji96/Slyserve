import React, {createContext, useState, useContext} from 'react';
import {HEIGHT} from '../constants/dimensions';

const ThemeContext = createContext({});

const ThemeProvider = props => {
  const [drawer, setDrawer] = useState({
    scale: 1,
    radius: 0,
    // height: HEIGHT,
    // top: 0,
    // left: 0
  });

  return <ThemeContext.Provider value={{drawer, setDrawer}} {...props} />;
};

function useTheme() {
  const context = useContext(ThemeContext);
  if (Object.keys(context).length === 0) {
    throw new Error(`useTheme must be used within a ThemeProvider`);
  }
  return context;
}

export {ThemeProvider, useTheme};
