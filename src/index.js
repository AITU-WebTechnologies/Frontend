import React from "react"
import ReactDOMClient from "react-dom/client"
import Registration from './Registration'
import './css/style.css'

const app = ReactDOMClient.createRoot(document.getElementById("test"))

app.render(<Registration/>)