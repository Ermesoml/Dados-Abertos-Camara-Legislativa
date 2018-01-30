$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  $('select').material_select();
});

/* 
  Modificação necessária para pegar o valor do select do materialize com o vue.
  Encontrada em https://stackoverflow.com/questions/33704122/vuejs-materializecss-select-field
*/
Vue.directive("select", {
    "twoWay": true,

    update: function(el, binding, vnode) {
      if(!vnode.elm.dataset.vueSelectReady) {
        $(el).on('change', function() {
            vnode.context.$set(vnode.context, binding.expression, el.value);
        });

        $(el).material_select();
        vnode.elm.dataset.vueSelectReady = true
      }
    },

    unbind: function(el, binding, vnode) {
        $(el).material_select('destroy');
    }
});

var app = new Vue({
  el: '#app',
  data: {
    deputado_id: 0,
  },
  created: function(){
    this.deputado_id = findGetParameter('deputado_id');
  }
})