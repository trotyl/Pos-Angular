function Order () {

}

Order.all = function () {
    var boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
    var result = {};
    _(boughtItems).each(function (item, barcode) {
        result[barcode] = new Item(item.barcode, item.name, item.unit, item.price, item.type, item.count, item.promotion);
    });
    return result;
};

Order.getCount = function () {
    return _(Order.all()).reduce(function (sum, item) {
        return sum + item.count;
    }, 0);
};

Order.findByName = function (name) {
    return _(Order.all()).find(function (item) {
        return item.name == name;
    });
};

Order.addItem = function (barcode) {
    var item = Order.all()[barcode] || _(loadAllItems()).find({barcode: barcode});
    item.addCount();
};

Order.getPromotion = function (items, promotions) {
    var two_with_one_list = _(promotions).findWhere({type: 'BUY_TWO_GET_ONE_FREE'}).barcodes;
    _(two_with_one_list).each(function (barcode) {
        var item = items[barcode];
        if(item && !item.promotion) {
            item.getPromotion();
        }
    }, this);
};

Order.totalPrice = function (items) {
    return _(items).reduce(function (sum, item) {
        return sum + item.total();
    }, 0);
};

Order.savePrice = function (items) {
    return _(items).reduce(function (sum, item) {
        return sum + item.save();
    }, 0);
};