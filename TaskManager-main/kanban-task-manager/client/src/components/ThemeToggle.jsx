import React from 'react'
import { Sun, Moon, Contrast } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

function ThemeToggle() {
  const { isDarkMode, isHighContrast, toggleTheme, toggleHighContrast } = useTheme()

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={toggleTheme}
        style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        color: isDarkMode ? '#f9fafb' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <button
        onClick={toggleHighContrast}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isHighContrast ? '#111827' : (isDarkMode ? '#374151' : '#f3f4f6'),
          color: isHighContrast ? '#f9fafb' : (isDarkMode ? '#f9fafb' : '#374151'),
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        title={isHighContrast ? 'Disable high-contrast' : 'Enable high-contrast'}
      >
        <Contrast size={18} />
      </button>
    </div>
  )
}

export default ThemeToggle
