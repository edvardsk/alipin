export default {
    node: 'div',
    class: 'normal-animating-message normal-message tweets',
    template: '<ul>\
        {{tweets}}\
            <li><img src="{{image}}" /><label>{{text}}</label></li>\
        {{/tweets}}\
    </ul>'
};