import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then default to light mode
    const saved = localStorage.getItem('theme')
    if (saved) {
      return saved === 'dark'
    }
    return false // Default to light mode
  })
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('high-contrast') === 'true'
  })

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('high-contrast', String(isHighContrast))
    
    // Update document class for CSS variables
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrast])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }
  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev)
  }

  const value = {
    isDarkMode,
    isHighContrast,
    toggleTheme,
    toggleHighContrast
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
