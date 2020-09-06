require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/list";
import * as listView from "./view/listView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectRecipe,
} from "./view/recipeView";
/* 
web app tuluv
-hailtin query , ur dun
-tuhain uzuulj baigaa jor
-Like joruud 
-zahialj baigaa joriin nairlaga
*/

const state = {};

/*
hailtiin controller = MVC
*/
const controlSearch = async () => {
  // 1) web ees tulhuur ug avna
  const quere = searchView.getInput();

  if (quere) {
    // 2) shine hailtin object uusgene
    state.search = new Search(quere);
    // 3) Hailt hiihed zoruulj delgetsee beldene
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    // 4) Hailtig guitsetgene
    await state.search.doSearch();
    // 5) Haitin ur dung delgetsend gargana
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  //
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  //
  //
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

// jor controller
const controlRecipe = async () => {
  // url aas id avna
  const id = window.location.hash.replace("#", "");

  if (id) {
    // joriin model uusgene
    state.recipe = new Recipe(id);
    // ui delgets beldene

    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectRecipe(id);
    // joroo tataj abchirna
    await state.recipe.getRecipe();
    clearLoader();
    // jorig guitsetgeh hugatsaa
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();
    // joroo delgetsend gargana
    renderRecipe(state.recipe);
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

/*
 nairlaga controller
 */
const controlList = () => {
  // nairlaga model uusgene
  state.list = new List();
  // tsverleh
  listView.clearItems();

  // ug model ruu odoo haragdaj
  state.recipe.ingredients.forEach((n) => {
    state.list.addItem(n);
    // console.log(n);
    listView.renderItem(n);
  });
};

elements.recipeDiv.addEventListener("click", (e) => {
  //
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  }
});
