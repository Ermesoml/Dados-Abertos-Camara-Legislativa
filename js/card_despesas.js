Vue.component('despesas-deputado', {
  template: 
    ` 
      <div class="section">
        <h4 class="center-align">
          Despesas em 
          <div class="row">
            <div class="input-field col m10 s12">
              <select v-select="ano_pesquisa">
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
              </select>
            </div>
            <div class="input-field col m2 s12">
              <button class="waves-effect waves-light btn" @click="buscarDespesasDeputado(deputadoId)">Processar</button>
            </div>
          </div>
          <!-- {{ano_pesquisa}} -->
        </h4>
        <div class="row">
          <div class="input-field col s12">
            <input id="tipo-despesa" type="text" v-model="filtro" v-on:keyup="filtrarDespesas()">
            <label for="tipo-despesa">Filtro (Tipo de despesa ou Fornecedor)</label>
          </div>
        </div>
        <div class="row">
          <h3 class="red-text">Total filtrado: {{formatCurrency(total_despesas_filtradas)}}</h3>
        </div>
        <table class="bordered striped centered responsive-table">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Mês</th>
              <th>Tipo desp.</th>
              <th>Data do docum.</th>
              <th>Fornecedor</th>
              <th>CNPJ Forn.</th>
              <th class="red-text">Valor documento</th>
              <th>Tipo docum.</th>
              <th>Num docum.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="despesa in despesas_filtradas">
              <td>{{despesa.ano}}</td>
              <td>{{getMesFormatado(despesa.mes)}}</td>
              <td>{{despesa.tipoDespesa}}</td>
              <td>{{despesa.dataDocumento}}</td>
              <td>{{despesa.nomeFornecedor}}</td>
              <td>{{despesa.cnpjFornecedor}}</td>
              <td class="red-text"><b>R$ {{despesa.valorDocumento}}</b></td>
              <td>{{despesa.tipoDocumento}}</td>
              <td>{{despesa.numDocumento}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  props: {
    deputadoId: {
    },
  },
  data: function(){
    return {
      ano_pesquisa: 0,
      filtro: '',
      total_despesas: 0,
      despesas_deputado: [],
      despesas_filtradas: [],
      total_despesas_filtradas: 0,
    }
  },
  mounted: function(){
    this.ano_pesquisa = 2018;
    this.buscarDespesasDeputado(this.deputadoId);
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
})