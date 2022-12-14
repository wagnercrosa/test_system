const initModeloGrafico = 'line';
const colors = ['#ff8a65', '#b9f6ca', '#26c6da', '#03a9f4', '#40c4ff', '#64ffda', '#84ffff', '#4caf50', 
'#69f0ae', '#76ff03', '#cddc39', '#c6ff00', '#ffb74d', '#e65100', '#ff8a65', '#b9f6ca', '#26c6da', '#03a9f4', 
'#40c4ff', '#64ffda', '#84ffff', '#4caf50', '#69f0ae', '#76ff03', '#cddc39', '#c6ff00', '#ffb74d', '#e65100',
'#ff8a65', '#b9f6ca'];

var DADOSFATURAMENTO = [];
var MODELO = initModeloGrafico;

$(function () {
	faturamentoDosUltimosSeteDias();
});

function montaGraficoFaturamento(modelo, dados){
	$('#novo-faturamento').html('<canvas id="grafico-faturamento" style="width: 100%; margin-left: 10px; margin-top: 20px;"></canvas>')
	var ctx = $('#grafico-faturamento');

	var myChart = new Chart(ctx, {
		type: modelo,
		data: {

			labels: constroiLabel(dados),
			datasets: [{
				label: 'Valor',
				backgroundColor: constroiColor(dados),
				borderColor: '#565',
				data: constroiData(dados),
			}]
		},
		options: {
			
			legend: {
				display: false
			},
			
		}
	});
}

function constroiLabel(dados){
	let temp = [];
	dados.map((v) => {
		temp.push(v.data);
	})
	return temp;
}

function constroiData(dados){
	let temp = [];
	dados.map((v) => {
		temp.push(v.total);
	})
	return temp;
}

function constroiColor(dados){
	let temp = [];
	let cont = 0;
	dados.map((v) => {
		temp.push(colors[cont]);
		cont++;
	})
	return temp;
}

function alteraModeloGrafico(modelo){

	montaGraficoFaturamento(modelo, DADOSFATURAMENTO);
	MODELO = modelo;
}

function faturamentoDosUltimosSeteDias(){
	$.get(path + 'graficos/faturamentoDosUltimosSeteDias')
	.done((success) => {
		DADOSFATURAMENTO = success;
		montaGraficoFaturamento(initModeloGrafico, success);
	})
	.fail((err) => {
		alert('Erro ao buscar dados de faturamento')
	})
}

function filtrar(){
	let data_inicial = $('.data_inicial').val();
	let data_final = $('.data_final').val();
	let js = {
		data_inicial: data_inicial,
		data_final: data_final
	}
	$.get(path + 'graficos/faturamentoFiltrado', js)
	.done((success) => {
		DADOSFATURAMENTO = success;
		montaGraficoFaturamento(MODELO, success);
	})
	.fail((err) => {
		alert('Erro ao buscar dados de faturamento')
	})
}

//fitro box

$('#hoje').click(() => {
	filtroBox(1)
	activeButton('#hoje')

})

$('#seteDias').click(() => {
	filtroBox(7)
	activeButton('#seteDias')
})

$('#trintaDias').click(() => {
	filtroBox(30)
	activeButton('#trintaDias')
})

$('#sessentaDias').click(() => {
	filtroBox(60)
	activeButton('#sessentaDias')
})

function activeButton(b){
	$('#hoje').removeClass('active')
	$('#seteDias').removeClass('active')
	$('#trintaDias').removeClass('active')
	$('#sessentaDias').removeClass('active')
	$(b).addClass('active')
}

function filtroBox(dias){
	$.get(path + 'graficos/boxConsulta/'+dias)
	.done((success) => {

		$('#tot-vendas').html(success.totalDeVendas)
		$('#tot-pedidos').html(success.totalDePedidos)
		$('#tot-contas-receber').html(success.totalDeContaReceber)
		$('#tot-contas-pagar').html(success.totalDeContaPagar)
	})
	.fail((err) => {
	})
}

function convertMoney(v){
	return v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}



