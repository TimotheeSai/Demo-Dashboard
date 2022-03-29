async function fetchData (url) {
    const data = await fetch(
        url ,{
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        }
        }).then(r => r.json())
    
    return data
}

export { fetchData } 
