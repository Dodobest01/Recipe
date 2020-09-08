import uniqid from "uniqid";
export default class List {
  constructor() {
    //
    this.items = [];
  }
  deleteItem(id) {
    // id gedeg id-tei ortsiig index olj haina
    const index = this.items.findIndex((el) => el.id === id);
    // ug index olj ustagana'
    this.items.splice(index, 1);
    // this.items;
  }
  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };
    this.items.push(newItem);

    return newItem;
  }
}
