
let initialState = {
items: [],
parentCategory: 1
};
  
export const saveCategory = function(cat) {
    //check category exist
    cat.key = guid();
    if (cat.parentCategory) {
        console.log("cat with parent detected", cat);
        //add it to parent, but check if parent has existing items
        let parentCat = loadCategory(cat.parentCategory);
        if (parentCat.items) {
            parentCat.items.push(cat)
        }
        //appended cat to parent
        localStorage.setItem(`cat-key-${cat.parentCategory}`, JSON.stringify(parentCat))
        return parentCat;
    } else {
        //has no parent, just save it
        console.log("cat with no parent", cat);
        cat.items = []
        // cat.parentCategory = cat;
        localStorage.setItem(`cat-key-${cat.key}`, JSON.stringify(cat))
    }
    return (cat);
}
export const loadCategory = function(key) {
    let catLoaded = localStorage.getItem(`cat-key-${key}`)
    if (catLoaded) {
        let catParsed = JSON.parse(catLoaded);
        if (catParsed.items) {
            return catParsed;
        }
        return {...catParsed, items: []}
    }
    return initialState;
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  