import { elements } from "./base";

// private function
const renderRecipe = (recipe) => {
  const markup = `
  <li>
  <a class="results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="Test">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${recipe.title}</h4>
          <p class="results__author">${recipe.publisher}</p>
      </div>
  </a>
  </li>`;
  // ul ruu nemne
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};
export const clearSearchResult = () => {
  elements.pageButtons.innerHTML = "";
  elements.searchResultList.innerHTML = "";
};
export const getInput = () => {
  return elements.searchInput.value;
};
export const renderRecipes = (recipes, currenttPage = 1, resPerPage = 10) => {
  // hailtiin ur dun
  const start = (currenttPage - 1) * resPerPage;
  const end = currenttPage * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  // huudaslalt tobch
  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(currenttPage, totalPages);
};
const createButton = (page, type, direction) => {
  return `<button class="btn-inline results__btn--${type}" data-goto=${page}>
  <span>Хуудас ${page}</span>
  <svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${direction}"></use>
  </svg>
  
</button>`;
};
const renderButtons = (currenttPage, totalPages) => {
  let buttonHtml;

  if (currenttPage === 1 && totalPages > 1) {
    //
    buttonHtml = createButton(2, "next", "right");
  } else if (currenttPage < totalPages) {
    // umnuh bolon daraachinn huudas
    buttonHtml = createButton(currenttPage - 1, "prev", "left");
    buttonHtml += createButton(currenttPage + 1, "next", "right");
  } else if (currenttPage === totalPages) {
    // hamgiin suuliin huudas
    buttonHtml = createButton(currenttPage - 1, "prev", "left");
  }
  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHtml);
};
