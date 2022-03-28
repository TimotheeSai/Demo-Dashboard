import "./index.css"

class cardObject {
  constructor({ id, title, category, text, dueAt, tags = [], ...data }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.text = text;
    this.tags = tags;
    this.dueAt = new Date(dueAt).toLocaleString();
  }

  createCardHeaderElt() {
    const cardHeaderContainer = document.createElement("div");
    cardHeaderContainer.classList.add("card__header");
    const nameContainer = document.createElement("div");
    nameContainer.innerText = this.title;

//    const incomeContainer = document.createElement("div");
//    incomeContainer.innerTex = `${this.incomes} €`;

    cardHeaderContainer.appendChild(nameContainer);
//    cardHeaderContainer.appendChild(incomeContainer);

    return cardHeaderContainer;
  }

  createCardBodyElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("card__body");
    const tagContainerElt = document.createElement("div");
    tagContainerElt.classList.add("card__body__tags__container");

    this.tags.forEach((c) => {
      const contractElt = document.createElement("div");
      contractElt.classList.add("card__body__tag");
      contractElt.innerText = c.name;
      tagContainerElt.appendChild(contractElt);
    });

    containerElt.appendChild(tagContainerElt);
    const mainContractElt = document.createElement("div");
    mainContractElt.classList.add("card__body__text");
    mainContractElt.innerText = this.text;

    containerElt.appendChild(mainContractElt);
    return containerElt;
  }

  createCardFooterElt() {
    const footerElt = document.createElement("div");
    footerElt.classList.add("card__footer");
    footerElt.innerText = this.dueAt;
    return footerElt;
  }

  createCardElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("board__card__container");
    containerElt.setAttribute("id", `card-${this.id}`);
    containerElt.appendChild(this.createCardHeaderElt());
    containerElt.appendChild(this.createCardBodyElt());
    containerElt.appendChild(this.createCardFooterElt());
    return containerElt;
  }
}

class categoryObject {
  constructor({ name, slug, id, cards = [] }) {
    this.id = id;
    this.cards = cards;
    this.name = name;
    this.slug = slug;
  }

  get incomes() {
    return this.cards.reduce((a, c) => {
      return a + c.incomes;
    }, 0);
  }

  createCategoryHeaderElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("category__header");

    const titleElt = document.createElement("div");
    titleElt.classList.add("category__header__title");
    titleElt.innerText = `${this.name} (${this.cards.length})`;
    containerElt.appendChild(titleElt);

//    const subTitleElt = document.createElement("div");
//    subTitleElt.classList.add("category__header__subtitle");
//    subTitleElt.innerText = `${this.incomes} €`;
//    containerElt.appendChild(subTitleElt);

    return containerElt;
  }

  createCategoryBodyElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("category__body");
    this.cards.forEach((c) => {
      containerElt.appendChild(c.createCardElt());
    });
    return containerElt;
  }

  createCategoryFooterElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("category__footer");
    return containerElt;
  }

  createCategoryElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("board__category__container");
    containerElt.setAttribute("id", `category-${this.id}`);
    containerElt.appendChild(this.createCategoryHeaderElt());
    containerElt.appendChild(this.createCategoryBodyElt());
    containerElt.appendChild(this.createCategoryFooterElt());
    return containerElt;
  }
}

class dashboardObject {
  constructor({ categoriesData = [], cardsData = [] }) {
    this.cards = cardsData.map((c) => new cardObject(c));
    this.categories = categoriesData.map((c) => {
      const { slug } = { ...c };
      return new categoryObject({
        ...c,
        cards: this.cards.filter((card) => card.category === slug),
      });
    });
  }
}

const dashboard = document.querySelector(".board-container");
//cardData.forEach((c) => {
//  const card = new cardObject(c);
//  dashboard.appendChild(card.createCardElt());
//});
//dash = new dashboardObject({
//  cardsData: cardData,
//  categoriesData: contractStatus,
//});
//console.log(dash);
//dash.categories.forEach((c) => dashboard.appendChild(c.createCategoryElt()));
//card = new cardObject(cardData[0])
//console.log(card)
//console.log(card.createCardElt().innerHTML)t


export { cardObject, categoryObject, dashboardObject }
