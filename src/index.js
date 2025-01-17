import React from "react"
import ReactDOMClient from "react-dom/client"
import App from './App'
import './css/style.css'

const app = ReactDOMClient.createRoot(document.getElementById("test"))

app.render(<App/>)