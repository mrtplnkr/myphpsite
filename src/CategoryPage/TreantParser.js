export function findParent(_currentCat, _parent) {
    return _currentCat.parentCategory && _currentCat.parentCategory.name.length > 0 ? {
        text: [_currentCat.parentCategory].map(cp => {
        return {
                title: cp.name,
                contact: "parent->" + _currentCat.parentCategory.name
        }})[0], image: "./images.jpg"} : _parent;
}

export function convertCat(_parent, _currentCat, _childrenCats) {
    console.log('_parent', _parent);
    console.log('_currentCat', _currentCat);
    console.log('_childrenCats', _childrenCats);
    
    var objectToReturn = {
        parent: _parent,
        text: convertInsideCat(_currentCat),
        children: _childrenCats.map(c => {
            return {
                text: convertInsideCat(c)
            }
        })
    }

    console.log('objectToReturn', objectToReturn);
    
    return objectToReturn;
}

function convertInsideCat(c) {
    return {
        title: c.name,
        contact: "c.parentCategory?.name"
    }
}