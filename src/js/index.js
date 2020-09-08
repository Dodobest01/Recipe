require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/list";
import * as listView from "./view/listView";
import Like from "./model/like";
import * as likesView from "./view/likeView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectRecipe,
} from "./view/recipeView";
import Likes from "./model/like";
/* 
web app tuluv
-hailtin query , ur dun
-tuhain uzuulj baigaa jor
-Like joruud 
-zahialj baigaa joriin nairlaga
*/

const state = {};
//like ses haah

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
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);
window.addEventListener("load", (e) => {
  // shineer like modul app ehlehed
  if (!state.likes) state.likes = new Likes();
  //like ses gargah isehiig shiideh
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  // liakyy baival ses ind nemj haruulna
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
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
    const item = state.list.addItem(n);
    // console.log(n);
    listView.renderItem(item);
  });
};
// like controller
//
//

const controlLike = () => {
  // 1. like model uusgene
  if (!state.likes) state.likes = new Like();
  // 2. Odoo haragdaj baigaa joriin id olj avah
  const currentRecipeId = state.recipe.id;
  // 3. ene joriig likesan isehiig shalgaj avah
  if (state.likes.isLiked(currentRecipeId)) {
    // 4. Like bol like dar
    state.likes.deleteLike(currentRecipeId);
    // like sesnees ustgana
    likesView.deleteLike(currentRecipeId);
    // like haragdah baidal
    likesView.toggleLikeBtn(false);

    // console.log(state.likes);
  } else {
    // daraagui bol like

    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    likesView.renderLike(newLike);
    likesView.toggleLikeBtn(true);
    // console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  //
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //
    controlLike();
  }
});

elements.shoppinglist.addEventListener("click", (e) => {
  // click hiisen li element  data-itemid
  const id = e.target.closest(".shopping__item").dataset.itemid;
  // oldson id modeloos ustgana
  state.list.deleteItem(id);
  // delgetsees ustgana
  listView.deleteItem(id);
});
