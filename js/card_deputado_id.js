Vue.component('deputado', {
  template: 
    ` <div class="row">
        <div class="col s12 m12" v-if="deputado != undefined" v-cloak>
          <div class="card  blue-grey lighten-1">
            <div class="card-content white-text center-align">
              <img v-if="deputado.ultimoStatus != undefined" :src="deputado.ultimoStatus.urlFoto" :alt="deputado.nomeCivil" style="max-width: 110px">
              <span class="card-title">{{deputado.nomeCivil}}</span>
              <p><strong>Código: </strong>{{deputado.id}}</p>
              <p><strong>Nome civil: </strong>{{deputado.nomeCivil}}</p>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Partido: </strong>{{deputado.ultimoStatus.siglaPartido}}</p>
              <p><strong>CPF: </strong>{{deputado.cpf}}</p>
              <p><strong>Sexo: </strong>{{deputado.sexo}}</p>
              <p><strong>Data de nascimento: </strong>{{deputado.dataNascimento}}</p>
              <p><strong>UF nascimento: </strong>{{deputado.ufNascimento}}</p>
              <p><strong>Municipio de nascimento: </strong>{{deputado.municipioNascimento}}</p>
              <p><strong>Escolaridade: </strong>{{deputado.escolaridade}}</p>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Email: </strong>{{deputado.ultimoStatus.gabinete.email}}</p>
              <hr>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Nome eleitoral: </strong>{{deputado.ultimoStatus.nomeEleitoral}}</p>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Data de eleição: </strong>{{deputado.ultimoStatus.data}}</p>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Situação: </strong>{{deputado.ultimoStatus.situacao}}</p>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Condição eleitoral: </strong>{{deputado.ultimoStatus.condicaoEleitoral}}</p>
              <p v-if="deputado.ultimoStatus != undefined"><strong>Nome eleitoral: </strong>{{deputado.ultimoStatus.nomeEleitoral}}</p>
            </div>
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
      // deputado_id: deputadoId,
      deputado: {}
    }
  },
  mounted: function(){
    this.buscarInfoDeputado(this.deputadoId);
  },
  methods: {
    buscarInfoDeputado: function(deputado_id){
      this.processando = true;
      var url = "https://dadosabertos.camara.leg.br/api/v2/deputados/" + deputado_id 
      this.processando_proposicoes = true;

      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarInfo
      });
    },
    atualizarInfo: function(data){
      this.deputado = data.dados;
      // this.buscarProposicoesDeputado(this.dados_deputado.ultimoStatus.nomeEleitoral);
    }
  },
})