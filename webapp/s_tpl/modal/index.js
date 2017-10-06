/**
 * ~headTitle~
 * @author ~author~
 * @date   ~date~
 */
NEJ.define([
    'base/util',
    'pro/extend/util',
    'pro/widget/BaseModalComponent',
    'text!./index.html'
], function(_ut, _, BaseModalComponent, _tpl) {

    var App = BaseModalComponent.extend({
        config: function(data) {
            _.extend(data, {

            });

            this.supr(data);
        },

        ok: function() {
            //todo
        }
    });

    return App;
});