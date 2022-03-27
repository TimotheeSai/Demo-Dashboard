class cardObject {
  constructor({ firstName, lastName, department, contracts, ...data }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.department = department;
    [this.mainContract, ...this.otherContracts] = contracts;
    this.status = this.mainContract.contractStatus;
    this.incomes = this.mainContract.incomes || 0;
  }

  createCardHeaderElt() {
    const cardHeaderContainer = document.createElement("div");
    cardHeaderContainer.classList.add("card__header");
    const nameContainer = document.createElement("div");
    nameContainer.innerText = `${this.lastName.toUpperCase()} ${
      this.firstName
    } (${this.department})`;

    const incomeContainer = document.createElement("div");
    incomeContainer.innerTex = `${this.incomes} €`;

    cardHeaderContainer.appendChild(nameContainer);
    cardHeaderContainer.appendChild(incomeContainer);

    return cardHeaderContainer;
  }

  createCardBodyElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("card__body");
    const mainContractElt = document.createElement("div");
    mainContractElt.classList.add("card__body__main_contract");
    mainContractElt.innerText = this.mainContract.providerName;

    containerElt.appendChild(mainContractElt);
    this.otherContracts.forEach((c) => {
      const contractElt = document.createElement("div");
      contractElt.classList.add("card__body__other_contract");
      contractElt.innerText = `${c.providerName} (${c.contractStatusDisplay})`;
      containerElt.appendChild(contractElt);
    });
    return containerElt;
  }

  createCardFooterElt() {
    const footerElt = document.createElement("div");
    footerElt.classList.add("card__footer");
    footerElt.innerText = `${this.mainContract.lastUpdate} - ${this.mainContract.responder}`;
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
  constructor({ name, incomes, id, cards = [] }) {
    //    this.cards = cardsData.map((c) => cardObject(c));
    this.id = id;
    this.cards = cards;
    this.name = name;
    //    this.incomes = incomes;
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

    const subTitleElt = document.createElement("div");
    subTitleElt.classList.add("category__header__subtitle");
    subTitleElt.innerText = `${this.incomes} €`;
    containerElt.appendChild(subTitleElt);

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
      const { slug: catId } = { ...c };
      return new categoryObject({
        ...c,
        cards: this.cards.filter((crd) => crd.status === catId),
        name: c.display_name,
        id: c.slug,
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

export function test() {}
console.log('=========================')

