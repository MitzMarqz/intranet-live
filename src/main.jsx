import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// *Global CSS Import Block – This brings in all your styles (background, blobs, colors, fonts)*
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)