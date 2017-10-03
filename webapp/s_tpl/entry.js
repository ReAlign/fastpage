NEJ.define([
    'base/klass',
    'pro/widget/module',
    './components/index.js'
], function(k, Module, List, p) {
    var pro;
    p._$$indexModule = k._$klass();
    pro = p._$$indexModule._$extend(Module._$$Module);

    pro.__init = function(_options) {
        this.__supInit(_options);
    };

    pro.__init = function(options){
        this.__super(options);
        this.module = new List();
        this.module.$inject('#app');
    };

    p._$$indexModule._$allocate();
});
