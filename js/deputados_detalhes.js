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
    dados_deputado: {},
    despesas_deputado: [],
    despesas_filtradas: [],
    proposicoes_deputado: [],
    detalhes_proposicao: {},
    total_despesas: 0,
    total_despesas_filtradas: 0,
    ano_pesquisa: 0,
    filtro: '',
    processando_proposicoes: false
  },
  methods: {
    buscarDespesasDeputado: function(deputado_id){
      var url = "https://dadosabertos.camara.leg.br/api/v2/deputados/"+ deputado_id +"/despesas?ano=" + this.ano_pesquisa + "&itens=100&ordem=desc&ordenarPor=numMes"; 
      this.despesas_deputado = [];
      this.despesas_filtradas = [];
      this.total_despesas = 0;
      this.total_despesas_filtradas = 0;

      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarDespesas
      });
    },
    buscarDespesasDeputadoUrl: function(url){
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarDespesas
      });
    },
    atualizarDespesas: function(data){
      this.despesas_deputado = this.despesas_deputado.concat(data.dados);
      this.despesas_filtradas = this.despesas_filtradas.concat(data.dados);
      
      for (var i = 0; i < data.dados.length; i++) {
        this.total_despesas = this.total_despesas + parseFloat(data.dados[i].valorDocumento);
        this.total_despesas_filtradas = this.total_despesas_filtradas + parseFloat(data.dados[i].valorDocumento);
      }

      for (var i = 0; i < data.links.length; i++) {
        if (data.links[i].rel == 'next'){
          this.buscarDespesasDeputadoUrl(data.links[i].href);
        }
      }
    },
    filtrarDespesas: function(){
      this.despesas_filtradas = [];
      this.total_despesas_filtradas = 0;

      for (var i = 0; i < this.despesas_deputado.length; i++) {
        if (this.despesas_deputado[i].tipoDespesa.toUpperCase().indexOf(this.filtro.toUpperCase()) != -1){
          this.despesas_filtradas.push(this.despesas_deputado[i]);
          this.total_despesas_filtradas = this.total_despesas_filtradas + parseFloat(this.despesas_deputado[i].valorDocumento);
        }
      }

      for (var i = 0; i < this.despesas_deputado.length; i++) {
        if (this.despesas_deputado[i].nomeFornecedor.toUpperCase().indexOf(this.filtro.toUpperCase()) != -1){
          this.despesas_filtradas.push(this.despesas_deputado[i]);
          this.total_despesas_filtradas = this.total_despesas_filtradas + parseFloat(this.despesas_deputado[i].valorDocumento);
        }
      }
    },
    buscarProposicoesDeputado: function(deputado_id){
      var url = "https://dadosabertos.camara.leg.br/api/v2/proposicoes?idAutor="+ deputado_id; 
      this.processando_proposicoes = true;

      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarProposicoes
      });
    },
    atualizarProposicoes: function(data){
      this.processando_proposicoes = false;
      this.proposicoes_deputado = data.dados;
    },
    detalharProposicao: function(uri){
      $('#modalDetalhesProposicao').modal('open');

      $.ajax({
        method: "GET",
        url: uri,
        dataType: "json",
        success: this.mostrarModalDetalhesProposicao
      });
    },
    mostrarModalDetalhesProposicao: function(proposicao){
      this.detalhes_proposicao = proposicao.dados;
      $('#modalDetalhesProposicao').modal('open');  
    },
    formatCurrency: function(total) {
      var neg = false;
      if(total < 0) {
          neg = true;
          total = Math.abs(total);
      }
      return (neg ? "-R$" : 'R$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.").toString();
    },
    getMesFormatado: function(mes){
      return getMes(mes);
    }
  },
  created: function(){
    this.deputado_id = findGetParameter('deputado_id');
    this.ano_pesquisa = 2018;

    // this.buscarInfoDeputado(this.deputado_id);
    this.buscarDespesasDeputado(this.deputado_id);
    this.buscarProposicoesDeputado(this.deputado_id);
  }
})