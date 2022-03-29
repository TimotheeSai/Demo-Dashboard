import './style.css'
import { cardObject, categoryObject, dashboardObject } from "./src/components/dashboard"
import { fetchData } from "./src/utils"

async function fetchDashboardData() {
    const categories = await fetchData("/api/categories/")
    const cards = await fetchData("/api/cards/")
    return {
        ...cards,
        ...categories
    }
}

fetchDashboardData().then(res => {
    console.debug("res", res)
    const dashboard = document.querySelector(".board-container");
    const dashObj = new dashboardObject({
        cardsData: res.cards,
        categoriesData: res.categories
    })
    dashObj.categories.forEach(c => {
        dashboard.appendChild(c.createCategoryElt())
    })
})
