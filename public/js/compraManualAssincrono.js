

var ITENS = [];
var FATURA = [];
var TOTAL = 0;
var PRODUTOS = [];
var PRODUTO = null;

$(function () {


});

$('.fornecedor').change(() => {
	let fornecedor = $('.fornecedor').val()

	if (fornecedor != '--') {
		getFornecedor(fornecedor, (d) => {
			console.log(d)
			habilitaBtnSalarVenda();
			$('#fornecedor').css('display', 'block');
			$('#razao_social').html(d.razao_social)
			$('#nome_fantasia').html(d.nome_fantasia)
			$('#logradouro').html(d.rua)
			$('#numero').html(d.numero)

			$('#cnpj').html(d.cpf_cnpj)
			$('#ie').html(d.ie_rg)
			$('#fone').html(d.telefone)
			$('#cidade').html(d.nome_cidade)

		})
	}
})

$('#kt_select2_2').change((target) => {

	let prod = $('.produto').val().split('-');
	let codigo = prod[0];
	if(codigo != "null"){
		$('#quantidade').val('1')
		let p = PRODUTOS.filter((x) => { return x.id == codigo })
		p = p[0]
		$('#valor').val(parseFloat(p.valor_compra).toFixed(casas_decimais))
		$('#subtotal').val(parseFloat(p.valor_compra).toFixed(casas_decimais))
	}
})

function getLastPurchase(produto_id, call) {
	$('#preloader-last-purchase').css('display', 'block')
	$.get(path + 'compraManual/ultimaCompra/' + produto_id)
	.done((success) => {
		call(success)
		$('#preloader-last-purchase').css('display', 'none')
	})
	.fail((err) => {
		call(err)
		$('#preloader-last-purchase').css('display', 'none')
	})
}


function getFornecedores(data) {
	$.ajax
	({
		type: 'GET',
		url: path + 'fornecedores/all',
		dataType: 'json',
		success: function (e) {
			data(e)
		}, error: function (e) {
			console.log(e)
		}

	});
}

function getFornecedor(id, data) {
	$.ajax
	({
		type: 'GET',
		url: path + 'fornecedores/find/' + id,
		dataType: 'json',
		success: function (e) {
			data(e)

		}, error: function (e) {
			console.log(e)
		}

	});
}

function getProdutos(data) {
	$.ajax
	({
		type: 'GET',
		url: path + 'produtos/naoComposto',
		dataType: 'json',
		success: function (e) {
			data(e)

		}, error: function (e) {
			console.log(e)
		}

	});
}

function getProduto(id, data) {
	console.log(id)
	$.ajax
	({
		type: 'GET',
		url: path + 'produtos/getProduto/' + id,
		dataType: 'json',
		success: function (e) {
			data(e)

		}, error: function (e) {
			console.log(e)
		}

	});
}

function habilitaBtnSalarVenda() {
	var fornecedor = $('.fornecedor').val().split('-');
	if (ITENS.length > 0 && FATURA.length > 0 && TOTAL > 0 && parseInt(fornecedor[0]) > 0) {
		$('#salvar-venda').removeAttr('disabled', 'false')
	}else{
		$('#salvar-venda').attr('disabled', 'true')
	}
}

$('#valor').on('keyup', () => {
	calcSubtotal()
})

function calcSubtotal() {
	let quantidade = $('#quantidade').val();
	let valor = $('#valor').val();
	let subtotal = parseFloat(valor.replace(',', '.')) * (quantidade.replace(',', '.'));
	let sub = formatReal(subtotal)
	$('#subtotal').val(sub)
}

function maskMoney(v) {
	return v.toFixed(casas_decimais).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

$('#autocomplete-produto').on('keyup', () => {
	$('#last-purchase').css('display', 'none')
})

$('#addProd').click(() => {
	$('#last-purchase').css('display', 'none')
	try{

		let quantidade = $('#quantidade').val();
		let valor = $('#valor').val();

		if (PRODUTO != null && quantidade.length > 0 && parseFloat(quantidade.replace(',', '.')) && valor.length > 0 && parseFloat(valor.replace(',', '.')) > 0) {
			// if (valor.length > 6) valor = valor.replace(".", "");
			valor = valor.replace(",", ".");

			addItemTable(PRODUTO.id, PRODUTO.nome, quantidade, valor);
		} else {
			swal("Erro", "Informe corretamente os campos para continuar!", "error")
		}
	}catch{
		swal("Erro", "Informe corretamente os campos para continuar!!", "error")
	}
	calcTotal()
});

$('#desconto').keyup(() => {
	calcTotal()
	$('.fatura tbody').html("");
	FATURA = []
	limparDadosFatura()
	habilitaBtnSalarVenda()
})

function addItemTable(codigo, nome, quantidade, valor) {
	if (!verificaProdutoIncluso()) {
		limparDadosFatura();
		TOTAL += parseFloat(valor.replace(',', '.')) * parseFloat(quantidade.replace(',', '.'));
		console.log(TOTAL)
		ITENS.push({
			id: (ITENS.length + 1), codigo: codigo, nome: nome,
			quantidade: quantidade, valor: valor
		})
		// apagar linhas tabela
		$('.prod tbody').html("");


		atualizaTotal();
		limparCamposFormProd();
		let t = montaTabela();
		$('.prod tbody').html(t)
	}
}

function verificaProdutoIncluso() {
	if (ITENS.length == 0) return false;
	if ($('#prod tbody tr').length == 0) return false;
	let cod = $('#autocomplete-produto').val().split('-')[0];
	let duplicidade = false;

	ITENS.map((v) => {
		if (v.codigo == cod) {
			duplicidade = true;
		}
	})

	let c;
	if (duplicidade) c = !confirm('Produto já adicionado, deseja incluir novamente?');
	else c = false;
	console.log(c)
	return c;
}

function limparCamposFormProd() {
	$('#autocomplete-produto').val('');
	$('#quantidade').val('0');
	$('#valor').val('0');
}

function limparDadosFatura() {
	$('#fatura tbody').html('')
	$(".data-input").val("");
	$("#valor_parcela").val("");
	$('#add-pag').removeClass("disabled");
	FATURA = [];

}

function atualizaTotal() {
	if(TOTAL < 0){
		$('#total').html(0);
	}else{
		$('#total').html(formatReal(TOTAL));
	}
}

function formatReal(v) {
	return v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL', minimumFractionDigits: casas_decimais });;
}

function montaTabela() {
	let t = "";
	ITENS.map((v) => {
		t += "<tr class='datatable-row' style='left: 0px;'>";
		t += "<td class='datatable-cell'><span class='' style='width: 60px;'>" + v.id + "</span></td>";
		t += "<td class='datatable-cell cod'><span class='codigo' style='width: 60px;'>" + v.codigo + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 120px;'>" + v.nome + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 100px;'>" + v.valor + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 80px;'>" + v.quantidade + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 80px;'>" + formatReal(v.valor.replace(',', '.') * v.quantidade.replace(',', '.')) + "</span></td>";
		t += "<td class='datatable-cell'><span class='svg-icon svg-icon-danger' style='width: 80px;'><a class='btn btn-danger' href='#prod tbody' onclick='deleteItem(" + v.id + ")'>"
		t += "<i class='la la-trash'></i></a></span></td>";
		t += "</tr>";
	});
	return t
}

function deleteItem(id) {
	let temp = [];
	ITENS.map((v) => {
		if (v.id != id) {
			temp.push(v)
		} else {
			TOTAL -= parseFloat(v.valor.replace(',', '.')) * (v.quantidade.replace(',', '.'));
		}
	});
	ITENS = temp;
	let t = montaTabela(); // para remover
	$('.prod tbody').html(t)
	atualizaTotal();
}

function calcTotal(){
	TOTAL = 0;
	ITENS.map((v) => {
		
		TOTAL += parseFloat(v.valor.replace(',', '.')) * (v.quantidade.replace(',', '.'));

	});

	let desconto = $('#desconto').val().replace(',', '.')
	if(desconto){
		TOTAL -= parseFloat(desconto)
	}
	atualizaTotal()
}

$('#formaPagamento').change(() => {
	calcTotal()
	limparDadosFatura();
	let now = new Date();
	let data = (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()) +
	"/" + ((now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1)) +
	"/" + now.getFullYear();

	var date = new Date(new Date().setDate(new Date().getDate() + 30));
	let data30 = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
	"/" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
	"/" + date.getFullYear();

	$("#qtdParcelas").attr("disabled", true);
	$(".data-input").attr("disabled", true);
	$("#valor_parcela").attr("disabled", true);
	$("#qtdParcelas").val('1');

	if ($('#formaPagamento').val() == 'a_vista') {
		$("#qtdParcelas").val(1)
		$('#valor_parcela').val(formatReal(TOTAL));
		$('.data-input').val(data);
	} else if ($('#formaPagamento').val() == '30_dias') {
		$("#qtdParcelas").val(1)
		$('#valor_parcela').val(formatReal(TOTAL));
		$('.data-input').val(data30);
	} else if ($('#formaPagamento').val() == 'personalizado') {
		$("#qtdParcelas").removeAttr("disabled");
		$(".data-input").removeAttr("disabled");
		$("#valor_parcela").removeAttr("disabled");
		$(".data-input").val("");
		$("#valor_parcela").val(formatReal(TOTAL));
	}
})

$('#qtdParcelas').on('keyup', () => {
	limparDadosFatura();

	if ($("#qtdParcelas").val()) {
		let qtd = $("#qtdParcelas").val();
		console.log(TOTAL)
		$('#valor_parcela').val(formatReal(TOTAL / qtd));
	}
})

$('#add-pag').click(() => {

	if (!verificaValorMaiorQueTotal()) {
		let data = $('.data-input').val();
		let valor = $('#valor_parcela').val();
		let cifrao = valor.substring(0, 2);
		if (cifrao == 'R$') valor = valor.substring(3, valor.length)
			if (data.length > 0 && valor.length > 0 && parseFloat(valor.replace(',', '.')) > 0) {
				addpagamento(data, valor);
			} else {
				swal(
				{
					title: "Erro",
					text: "Informe corretamente os campos para continuar!",
					type: "warning",
				}
				)

			}
		}
	})

function verificaValorMaiorQueTotal(data) {
	let retorno;
	let valorParcela = $('#valor_parcela').val();
	let qtdParcelas = $('#qtdParcelas').val();
	let desconto = $('#desconto').val();

	if (valorParcela <= 0) {

		retorno = true;


		swal(
		{
			title: "Erro",
			text: "Valor deve ser maior que 0",
			type: "warning",
		}
		)
	}

	else if (valorParcela > TOTAL) {

		swal(
		{
			title: "Erro",
			text: "Valor da parcela maior que o total da venda!",
			type: "warning",
		}
		)
		retorno = true;
	}

	else if (qtdParcelas > 1) {
		somaParcelas((v) => {
			console.log(FATURA.length, parseInt(qtdParcelas))

			if (v + parseFloat(valorParcela) > TOTAL) {

				swal(
				{
					title: "Erro",
					text: "Valor ultrapassaou o total!",
					type: "warning",
				}
				)
				retorno = true;
			}
			else if (v + parseFloat(valorParcela) == TOTAL && (FATURA.length + 1) < parseInt(qtdParcelas)) {

				swal(
				{
					title: "Erro",
					text: "Respeite a quantidade de parcelas pré definido!",
					type: "warning",
				}
				)
				retorno = true;

			}
			else if (v + parseFloat(valorParcela) < TOTAL && (FATURA.length + 1) == parseInt(qtdParcelas)) {

				swal(
				{
					title: "Erro",
					text: "Somátoria incorreta!",
					type: "warning",
				}
				)
				let dif = TOTAL - v;
				$('#valor_parcela').val(formatReal(dif))
				retorno = true;

			}
			else {
				retorno = false;

			}
		})
	}
	else {
		retorno = false;
	}

	return retorno;
}

function somaParcelas(call) {
	let soma = 0;
	FATURA.map((v) => {
		console.log(v.valor)
		// if(v.valor.length > 6){
		// 	v = v.valor.replace('.','');
		// 	v = v.replace(',','.');
		// 	soma += parseFloat(v);

		// }else{
		// 	soma += parseFloat(v.valor.replace(',','.'));
		// }
		soma += parseFloat(v.valor.replace(',', '.'));

	})
	call(soma)
}

function addpagamento(data, valor) {
	let result = verificaProdutoIncluso();
	if (!result) {
		FATURA.push({ data: data, valor: valor, numero: (FATURA.length + 1) })

		$('.fatura tbody').html(""); // apagar linhas da tabela
		let t = "";
		FATURA.map((v) => {
			t += "<tr class='datatable-row' style='left: 0px;'>";
			t += "<td class='datatable-cell'><span class='numero' style='width: 160px;'>" + v.numero + "</span></td>";
			t += "<td class='datatable-cell'><span class='' style='width: 160px;'>" + v.data + "</span></td>";
			t += "<td class='datatable-cell'><span class='' style='width: 160px;'>" + v.valor.replace(',', '.') + "</span></td>";
			t += "<td class='datatable-cell'><span class='' style='width: 160px;'><button class='btn btn-danger' onclick='removeParcela("+v.numero+")'>"
			+"<i class='la la-trash'></i></button></span></td>";
			t += "</tr>";
		});

		$('.fatura tbody').html(t)
		verificaValor();
	}
	habilitaBtnSalarVenda();
}

function removeParcela(numero){
	let temp = [];
	FATURA.map((v) => {
		if (v.numero != numero) {
			temp.push(v)
		} 
	});
	FATURA = temp;
	$('.fatura tbody').html(""); // apagar linhas da tabela
	let t = "";
	FATURA.map((v) => {
		t += "<tr class='datatable-row' style='left: 0px;'>";
		t += "<td class='datatable-cell'><span class='numero' style='width: 160px;'>" + v.numero + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 160px;'>" + v.data + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 160px;'>" + v.valor.replace(',', '.') + "</span></td>";
		t += "<td class='datatable-cell'><span class='' style='width: 160px;'><a class='btn btn-danger' onclick='removeParcela("+v.numero+")'>"
		+"<i class='la la-trash'></i></a></span></td>";
		t += "</tr>";
	});

	$('.fatura tbody').html(t)
	verificaValor();
}

function verificaValor() {
	let soma = 0;
	FATURA.map((v) => {
		soma += parseFloat(v.valor.replace(',', '.'));
	})
	if (soma >= TOTAL) {
		$('#add-pag').addClass("disabled");
	}
}

var salvando = false
function salvarCompra() {

	if(salvando == false){
		salvando =  true
		$('#preloader2').css('display', 'block');

		var fornecedor = $('.fornecedor').val();
		if (fornecedor == '--') {
			swal(
			{
				title: "Erro",
				text: "Selecione um fornecedor para continuar!",
				type: "warning",
			}
			)
		} else {
			var transportadora = $('#kt_select2_3').val();
			transportadora = transportadora == 'null' ? null : transportadora;
			let js = {
				fornecedor: fornecedor,
				formaPagamento: $('#formaPagamento').val(),
				itens: ITENS,
				fatura: FATURA,
				total: TOTAL,
				desconto: $('#desconto').val(),
				observacao: $('#obs').val(),

				especie: $('#especie').val(),
				numeracaoVol: $('#numeracaoVol').val(),
				qtdVol: $('#qtdVol').val(),
				pesoL: $('#pesoL').val(),
				pesoB: $('#pesoB').val(),
				transportadora: transportadora,
				frete: $('#frete').val(),
				placaVeiculo: $('#placa').val(),
				ufPlaca: $('#uf_placa').val(),
				valorFrete: $('#valor_frete').val()
			}

			let token = $('#_token').val();
			console.log(js)
			$.ajax
			({
				type: 'POST',
				data: {
					compra: js,
					_token: token
				},
				url: path + 'compraManual/salvar',
				dataType: 'json',
				success: function (e) {
					$('#preloader2').css('display', 'none');
					sucesso(e)

				}, error: function (e) {
					console.log(e)
					$('#preloader2').css('display', 'none');
				}
			});
		}
	}
	salvando = false
}

function sucesso() {
	$('#content').css('display', 'none');
	$('#anime').css('display', 'block');
	setTimeout(() => {
		location.href = path + 'compras';
	}, 4000)
}

$('#produto-search').keyup(() => {
	console.clear()
	let pesquisa = $('#produto-search').val();

	if(pesquisa.length > 1){
		montaAutocomplete(pesquisa, (res) => {
			if(res){
				if(res.length > 0){
					montaHtmlAutoComplete(res, (html) => {
						$('.search-prod').html(html)
						$('.search-prod').css('display', 'block')
					})

				}else{
					$('.search-prod').css('display', 'none')
				}
			}else{
				$('.search-prod').css('display', 'none')
			}
		})
	}else{
		$('.search-prod').css('display', 'none')
	}
})

function montaAutocomplete(pesquisa, call){
	$.get(path + 'produtos/autocomplete', {pesquisa: pesquisa})
	.done((res) => {
		console.log(res)
		call(res)
	})
	.fail((err) => {
		console.log(err)
		call([])
	})
}

function montaHtmlAutoComplete(arr, call){
	let html = ''
	arr.map((rs) => {
		let p = rs.nome
		if(rs.grade){
			p += ' ' + rs.str_grade
		}
		if(rs.referencia != ""){
			p += ' | REF: ' + rs.referencia
		}
		if(parseFloat(rs.estoqueAtual) > 0){
			p += ' | Estoque: ' + rs.estoqueAtual
		}
		html += '<label onclick="selectProd('+rs.id+')">'+p+'</label>'
	})
	call(html)
}


function selectProd(id){
	$.get(path + 'produtos/autocompleteProduto', {id: id, lista_id: 0})
	.done((res) => {
		PRODUTO = res
		console.log(PRODUTO)

		let p = PRODUTO.nome
		if(PRODUTO.referencia != ""){
			p += ' | REF: ' + PRODUTO.referencia
		}
		if(parseFloat(PRODUTO.estoqueAtual) > 0){
			p += ' | Estoque: ' + PRODUTO.estoqueAtual
		}

		$('#valor').val(parseFloat(PRODUTO.valor_compra).toFixed(casas_decimais))
		$('#quantidade').val(1)
		$('#subtotal').val(parseFloat(PRODUTO.valor_compra).toFixed(casas_decimais))
		$('#produto-search').val(p)
	})
	.fail((err) => {
		console.log(err)
		swal("Erro", "Erro ao encontrar produto", "error")
	})
	$('.search-prod').css('display', 'none')
}

function novoFornecedor(){
	$('#modal-fornecedor').modal('show')
}

function salvarFornecedor(){
	let js = {
		razao_social: $('#razao_social2').val(),
		nome_fantasia: $('#nome_fantasia2').val() ? $('#nome_fantasia2').val() : '',
		rua: $('#rua').val() ? $('#rua').val() : '',
		cpf_cnpj: $('#cpf_cnpj').val() ? $('#cpf_cnpj').val() : '',
		ie_rg: $('#ie_rg').val() ? $('#ie_rg').val() : '',
		bairro: $('#bairro').val() ? $('#bairro').val() : '',
		cep: $('#cep').val() ? $('#cep').val() : '',
		contribuinte: $('#contribuinte').val() ? $('#contribuinte').val() : '',
		cidade_id: $('#kt_select2_4').val() ? $('#kt_select2_4').val() : NULL,
		telefone: $('#telefone').val() ? $('#telefone').val() : '',
		celular: $('#celular').val() ? $('#celular').val() : '',
	}

	if(js.razao_social == ''){
		swal("Erro", "Informe a razão social", "warning")
	}else if(js.rua == ''){
		swal("Erro", "Informe a rua", "warning")
	}
	else if(js.cpf_cnpj == ''){
		swal("Erro", "Informe o CPF/CNPJ", "warning")
	}else if(js.bairro == ''){
		swal("Erro", "Informe o bairro", "warning")
	}else if(js.cep == ''){
		swal("Erro", "Informe o CEP", "warning")
	}else if(js.cep == ''){
		swal("Erro", "Informe o CEP", "warning")
	}
	else{
		
		let token = $('#_token').val();
		$.post(path + 'fornecedores/quickSave',
		{
			_token: token,
			data: js
		})
		.done((res) =>{
			console.log(res)
			$('#kt_select2_1').append('<option value="'+res.id+'">'+ 
				res.razao_social+'</option>').change();
			$('#kt_select2_1').val(res.id).change();
			swal("Sucesso", "Fornecedor adicionado!!", 'success')
			.then(() => {
				$('#modal-fornecedor').modal('hide')
			})
		})
		.fail((err) => {
			console.log(err)
		})
	}

	console.log(js)
}
$('#pessoaFisica').click(function () {
	$('#lbl_cpf_cnpj').html('CPF');
	$('#lbl_ie_rg').html('RG');
	$('#cpf_cnpj').mask('000.000.000-00', { reverse: true });
	$('#btn-consulta-cadastro').css('display', 'none')

})

$('#pessoaJuridica').click(function () {
	$('#lbl_cpf_cnpj').html('CNPJ');
	$('#lbl_ie_rg').html('IE');
	$('#cpf_cnpj').mask('00.000.000/0000-00', { reverse: true });
	$('#btn-consulta-cadastro').css('display', 'block');
});

function consultaCadastro() {
	let cnpj = $('#cpf_cnpj').val();
	let uf = $('#sigla_uf').val();
	cnpj = cnpj.replace('.', '');
	cnpj = cnpj.replace('.', '');
	cnpj = cnpj.replace('-', '');
	cnpj = cnpj.replace('/', '');

	if (cnpj.length == 14 && uf.length != '--') {
		$('#btn-consulta-cadastro').addClass('spinner')

		$.ajax
		({
			type: 'GET',
			data: {
				cnpj: cnpj,
				uf: uf
			},
			url: path + 'nf/consultaCadastro',

			dataType: 'json',

			success: function (e) {
				$('#btn-consulta-cadastro').removeClass('spinner')

				console.log(e)
				if (e.infCons.infCad) {
					let info = e.infCons.infCad;
					console.log(info)

					$('#ie_rg').val(info.IE)
					$('#razao_social2').val(info.xNome)
					$('#nome_fantasia2').val(info.xFant ? info.xFant : info.xNome)

					$('#rua').val(info.ender.xLgr)
					$('#numero2').val(info.ender.nro)
					$('#bairro').val(info.ender.xBairro)
					let cep = info.ender.CEP;
					$('#cep').val(cep.substring(0, 5) + '-' + cep.substring(5, 9))

					findNomeCidade(info.ender.xMun, (res) => {
						console.log(res)
						let jsCidade = JSON.parse(res);
						console.log(jsCidade)
						if (jsCidade) {
							console.log(jsCidade.id + " - " + jsCidade.nome)
							$('#kt_select2_4').val(jsCidade.id).change();
						}
					})

				} else {
					swal("Erro", e.infCons.xMotivo, "error")

				}
			}, error: function (e) {
				consultaAlternativa(cnpj, (data) => {
					console.log(data)
					if(data == false){
						swal("Alerta", "Nenhum retorno encontrado para este CNPJ, informe manualmente por gentileza", "warning")
					}else{
						$('#razao_social2').val(data.nome)
						$('#nome_fantasia2').val(data.nome)

						$('#rua').val(data.logradouro)
						$('#numero2').val(data.numero)
						$('#bairro').val(data.bairro)
						let cep = data.cep;
						$('#cep').val(cep.replace(".", ""))

						findNomeCidade(data.municipio, (res) => {
							let jsCidade = JSON.parse(res);
							console.log(jsCidade)
							if (jsCidade) {
								console.log(jsCidade.id + " - " + jsCidade.nome)
								$('#kt_select2_4').val(jsCidade.id).change();
							}
						})
					}
				})
				$('#btn-consulta-cadastro').removeClass('spinner')
			}
		});
	}else{
		swal("Alerta", "Informe corretamente o CNPJ e UF", "warning")
	}
}

function consultaAlternativa(cnpj, call){
	cnpj = cnpj.replace('.', '');
	cnpj = cnpj.replace('.', '');
	cnpj = cnpj.replace('-', '');
	cnpj = cnpj.replace('/', '');
	let res = null;
	$.ajax({

		url: 'https://www.receitaws.com.br/v1/cnpj/'+cnpj, 
		type: 'GET', 
		crossDomain: true, 
		dataType: 'jsonp', 
		success: function(data) 
		{ 
			$('#consulta').removeClass('spinner');
			console.log(data);
			if(data.status == "ERROR"){
				swal(data.message, "", "error")
				call(false)
			}else{
				call(data)
			}

		}, 
		error: function(e) { 
			$('#consulta').removeClass('spinner');
			console.log(e)

			call(false)

		},
	});
}

function limparCampos(){
	$('#razao_social2').val('')
	$('#nome_fantasia2').val('')

	$('#rua').val('')
	$('#numero2').val('')
	$('#bairro').val('')
	$('#cep').val('')
	$('#kt_select2_4').val('1').change();
}

function findNomeCidade(nomeCidade, call) {

	$.get(path + 'cidades/findNome/' + nomeCidade)
	.done((success) => {
		call(success)
	})
	.fail((err) => {
		call(err)
	})
}

