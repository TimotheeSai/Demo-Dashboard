import './style.css'
import {test} from "./src/components/dashboard"

//document.querySelector('#app').innerHTML = `
//  <h1>Hello Vite!</h1>
//  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
//`

async function fetchData () {
    const categories = await fetch(
        "/api/category/backlog/",{
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        }
        }).then(r => r.json())
    
    console.log(categories)
    return categories
}
console.log(fetchData())
