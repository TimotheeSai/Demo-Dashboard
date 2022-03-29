function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function fetchData(url) {
  const data = await fetch(
    url, {
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(r => r.json())

  return data
}

async function updateCard(cardId, cardData) {
  await fetch(`/api/card/update/${cardId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: "same-origin",
    body: JSON.stringify(cardData)
  }).then(console.log)
}

export { fetchData, updateCard } 
