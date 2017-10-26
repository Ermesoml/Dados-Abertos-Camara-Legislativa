var app = new Vue({
  el: '#app',
  data: {
    dados_deputado: {},
    despesas_deputado: [],
    despesas_filtradas: [],
    total_despesas: 0,
    total_despesas_filtradas: 0,
    ano_pesquisa: 0,
    filtro: ''
  },
  methods: {
    buscarInfoDeputado: function(deputado_id){
      var url = "https://dadosabertos.camara.leg.br/api/v2/deputados/" + deputado_id 

      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarInfo
      });
    },
    atualizarInfo: function(data){
      this.dados_deputado = data.dados;
    },
    buscarDespesasDeputado: function(deputado_id, ano_pesquisa){
      var url = "https://dadosabertos.camara.leg.br/api/v2/deputados/"+ deputado_id +"/despesas?ano=" + ano_pesquisa + "&itens=100&ordem=desc&ordenarPor=numMes"; 

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
    formatCurrency: function(total) {
      var neg = false;
      if(total < 0) {
          neg = true;
          total = Math.abs(total);
      }
      return (neg ? "-R$" : 'R$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.").toString();
    }
  },
  created: function(){
    var deputado_id = findGetParameter('deputado_id');
    this.ano_pesquisa = 2017;

    this.buscarInfoDeputado(deputado_id);
    this.buscarDespesasDeputado(deputado_id, this.ano_pesquisa);
  }
})