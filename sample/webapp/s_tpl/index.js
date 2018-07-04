/**
 * ~headTitle~
 * @author ~author~
 * @date   ~date~
 */
NEJ.define([
    'base/util',
    'pro/extend/util',
    'pro/widget/BaseComponent',
    'text!./index.html'
], function(_ut, _, BaseComponent, tpl) {

    var App = BaseComponent.extend({
        template: tpl,
        config: function(data) {
            _.extend(data, {

            });

            this.supr(data);
        }
    });

    return App;
});