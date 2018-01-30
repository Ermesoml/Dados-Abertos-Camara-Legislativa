
Vue.component('deputado-proposicoes', {
  template: 
    ` 
      <div>
        <div class="section">
          <h4 class="center-align">Proposições</h4>
          <div class="col s12" v-if="processando_proposicoes">
            <div class="red-text">
              <div class="progress">
                  <div class="indeterminate"></div>
              </div>
            </div>
          </div>
          <table class="bordered striped centered responsive-table" v-if="!processando_proposicoes && proposicoes_deputado.length > 0"> 
            <thead>
              <tr>
                <th>Ano</th>
                <th>Ementa</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proposicao in proposicoes_deputado">
                <td>{{proposicao.ano}}</td>
                <td>{{proposicao.ementa}}</td>
                <th><button class="waves-effect waves-light btn" @click="detalharProposicao(proposicao.uri)">Detalhes</button></th>
              </tr>
            </tbody>
          </table>
          <div class="row" v-if="!processando_proposicoes && proposicoes_deputado.length == 0">
            Não há proposições cadastradas para este deputado.
          </div>
        </div>
        <!-- Modal Structure -->
        <div id="modalDetalhesProposicao" class="modal">
          <div class="modal-content">
            <h4>{{detalhes_proposicao.siglaTipo}} - {{detalhes_proposicao.numero}} - {{detalhes_proposicao.ano}}</h4>
            <p>{{detalhes_proposicao.ementa}}</p>
            <p><a class="waves-effect waves-light btn" target="_blank" v-if="detalhes_proposicao.statusProposicao!=undefined" :href="detalhes_proposicao.statusProposicao.url">Documento da proposição na íntegra</a></p>
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Ok</a>
          </div>
        </div>
      </div>
    `,
  props: {
    deputadoId: {
    },
  },
  data: function(){
    return {
      proposicoes_deputado: [],
      detalhes_proposicao: {},
      processando_proposicoes: false
    }
  },
  mounted: function(){
    this.buscarProposicoesDeputado(this.deputadoId);
  },
  methods: {
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
  },
});