
var app = new Vue({
  el: '#app',
  data: {
    deputados: [],
    deputados_filtrados: [],
    partidos: [],
    filtro_deputados: '',
    filtro_partidos: '',
    filtro_estados: '',
    processando: false,
    quantidade_filtrados: 0,
    quantidade_partidos: 0
  },
  methods: {
    buscarDeputadosUrl: function(url){
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarDeputados
      });
    },
    buscarDeputados: function(){
      this.processando = true;

      $.ajax({
        method: "GET",
        url: "https://dadosabertos.camara.leg.br/api/v2/deputados/?pagina=1&itens=99",
        dataType: "json",
        success: this.atualizarDeputados
      });
    },
    atualizarDeputados: function(data){
      this.deputados = this.deputados.concat(data.dados);
      this.deputados_filtrados = this.deputados;

      var has_next = false;
      for (var i = 0; i < data.links.length; i++) {
        if(data.links[i].rel == 'next'){
          this.buscarDeputadosUrl(data.links[i].href);
          has_next = true;
          break;
        }
      }

      if (!has_next){
        this.quantidade_filtrados = this.deputados_filtrados.length;
        this.processando = false;
      }
    },
    buscarPartidos: function(){
      $.ajax({
        method: "GET",
        url: 'https://dadosabertos.camara.leg.br/api/v2/partidos?itens=99&ordenarPor=sigla',
        dataType: "json",
        success: this.atualizarPartidos
      });
    },
    atualizarPartidos: function(partidos){
      this.quantidade_partidos = partidos.dados.length;
      this.partidos = partidos.dados;
    },
    filtrarDeputados: function(){
      this.filtro_partidos = '';
      this.filtro_estados = '';
      this.deputados_filtrados = [];
      
      if (this.filtro_deputados == '')
        this.deputados_filtrados = this.deputados;
      else{
        for (var i = 0; i < this.deputados.length; i++) {
          if (this.deputados[i].nome.toUpperCase().indexOf(this.filtro_deputados.toUpperCase()) > -1){
            this.deputados_filtrados.push(this.deputados[i])
          }
        }
      }

      this.quantidade_filtrados = this.deputados_filtrados.length;
    },
    filtrarPartidos: function(){
      this.filtro_deputados = '';
      this.filtro_estados = '';
      this.deputados_filtrados = [];
      
      if (this.filtro_partidos == '')
        this.deputados_filtrados = this.deputados;
      else{
        for (var i = 0; i < this    .deputados.length; i++) {
          if (this.deputados[i].siglaPartido.toUpperCase() == (this.filtro_partidos.toUpperCase())){
            this.deputados_filtrados.push(this.deputados[i])
          }
        }
      }
      
      this.quantidade_filtrados = this.deputados_filtrados.length;
    },
    filtrarEstados: function(){
      this.filtro_deputados = '';
      this.filtro_partidos = '';
      this.deputados_filtrados = [];
      
      if (this.filtro_estados == '')
        this.deputados_filtrados = this.deputados;
      else{
        for (var i = 0; i < this.deputados.length; i++) {
          if (this.deputados[i].siglaUf.toUpperCase() == (this.filtro_estados.toUpperCase())){
            this.deputados_filtrados.push(this.deputados[i])
          }
        }
      }
      
      this.quantidade_filtrados = this.deputados_filtrados.length;
    }
  },
  created: function(){
    this.buscarDeputados();
    this.buscarPartidos();
  }
})