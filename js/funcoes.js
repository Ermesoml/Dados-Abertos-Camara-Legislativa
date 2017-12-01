function findGetParameter(parameterName) {
  var result = null,
      tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}

function getMes(mes_analitico){
  switch (mes_analitico) {
    case '1':
      return 'Janeiro';
      break;
    case '2':
      return 'Fevereiro';
      break;
    case '3':
      return 'Março';
      break;
    case '4':
      return 'Abril';
      break;
    case '5':
      return 'Maio';
      break;
    case '6':
      return 'Junho';
      break;
    case '7':
      return 'Julho';
      break;
    case '8':
      return 'Agosto';
      break;
    case '9':
      return 'Setembro';
      break;
    case '10':
      return 'Outubro';
      break;
    case '11':
      return 'Novembro';
      break;
    case '12':
      return 'Dezembro';
      break;
    default:
      return 'Não identificado';
      break;
  }
}