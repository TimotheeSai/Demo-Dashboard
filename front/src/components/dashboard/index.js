import "./index.css"
import { fetchData } from "../../utils"

class cardObject {
  constructor({ id, title, category, text, dueAt, tags = [], ...data }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.text = text;
    this.tags = tags;
    this.dueAt = dueAt ? new Date(dueAt) : new Date();
    this.dueAt = this.dueAt.toLocaleString()
  }

  createCardHeaderElt() {
    const cardHeaderContainer = document.createElement("div");
    cardHeaderContainer.classList.add("card__header");
    const nameContainer = document.createElement("div");
    nameContainer.innerText = this.title;

    cardHeaderContainer.appendChild(nameContainer);

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

  dragHandler(ev) {
    ev.dataTransfer.setData("text/plain", `card-${this.id}`);
    ev.dataTransfer.dropEffect = "move";
  }

  createCardElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("board__card__container");
    containerElt.setAttribute("id", `card-${this.id}`);
    containerElt.setAttribute("draggable", true);
    containerElt.ondragstart = (ev) => this.dragHandler(ev);
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

  get nodeElt() {
    return document.getElementById(`category-${this.id}`)
  }

  createCategoryHeaderElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("category__header");

    const titleElt = document.createElement("div");
    titleElt.classList.add("category__header__title");
    titleElt.innerText = `${this.name} (${this.cards.length})`;
    containerElt.appendChild(titleElt);

    return containerElt;
  }

  dragOverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }

  dropHandler(ev) {
//    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain")
    console.log(ev, data)
    const dropArea = this.nodeElt.querySelector(".category__body")
    dropArea.appendChild(document.getElementById(data));
  }

  createCategoryBodyElt() {
    const containerElt = document.createElement("div");
    containerElt.classList.add("category__body");
    containerElt.ondragover = ev => this.dragOverHandler(ev);
    containerElt.ondrop = ev => this.dropHandler(ev);
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

export { cardObject, categoryObject, dashboardObject }
