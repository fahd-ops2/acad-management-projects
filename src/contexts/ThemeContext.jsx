import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('pfa_theme_mode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('pfa_theme_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#1e40af', // Deep Academic Blue
          light: '#3b82f6',
          dark: '#1e3a8a',
          contrastText: '#ffffff'
        },
        secondary: {
          main: '#0d9488', // Emerald Teal
          light: '#14b8a6',
          dark: '#0f766e'
        },
        background: {
          default: mode === 'light' ? '#f8fafc' : '#0f172a',
          paper: mode === 'light' ? '#ffffff' : '#1e293b'
        },
        text: {
          primary: mode === 'light' ? '#0f172a' : '#f8fafc',
          secondary: mode === 'light' ? '#475569' : '#94a3b8'
        }
      },
      typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 600 }
      },
      shape: {
        borderRadius: 10
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '8px 18px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: mode === 'light' 
                ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' 
                : '0 1px 3px rgba(0,0,0,0.3)',
              border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none'
            }
          }
        }
      }
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
