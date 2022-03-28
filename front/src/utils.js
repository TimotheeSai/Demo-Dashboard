
async function fetchData (url) {
    const data = await fetch(
        url ,{
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        }
        }).then(r => r.json())
    
    console.log(data)
    return data
}

export { fetchData } 
