'use strict';

let util = {
    complexClone: function(myObj) {
        /// <summary>
        /// 对象复制
        /// </summary>
        /// <param name="myObj"></param>
        /// <returns type=""></returns>
        if(myObj === null || myObj === undefined || typeof (myObj) != 'object') {
            return myObj;//五种简单类型复制
        }
        if(myObj.constructor === Array) {//数组复制
            if(myObj.length === 0) {
                return myObj;
            } else {
                var myNewArr = [];
            }
            for (var i = 0; i < myObj.length; i++) {
                myNewArr.push(util.complexClone(myObj[i]));
            }
            return myNewArr;
        }
        //其他对象复制
        var myNewObj = {};
        for(var k in myObj) {
            myNewObj[k] = util.complexClone(myObj[k]);
        }
        return myNewObj;
    }
};

module.exports = util;