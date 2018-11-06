'use strict';

let util = {
    complexClone(myObj) {
        /// <summary>
        /// 对象复制
        /// </summary>
        /// <param name="myObj"></param>
        /// <returns type=""></returns>
        if(myObj === null || myObj === undefined || typeof (myObj) != 'object') {
            return myObj;//五种简单类型复制
        }
        if(myObj.constructor === Array) {//数组复制
            if(!myObj.length) {
                return myObj;
            }
            const myNewArr = [];
            for (let i = 0; i < myObj.length; i++) {
                myNewArr.push(util.complexClone(myObj[i]));
            }
            return myNewArr;
        }
        //其他对象复制
        const myNewObj = {};
        Object.keys(myObj).forEach((k) => {
            myNewObj[k] = util.complexClone(myObj[k]);
        });
        return myNewObj;
    }
};

module.exports = util;