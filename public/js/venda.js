
var ITENS = [];
var FATURA = [];
var TOTAL = 0;
var TOTALQTD = 0;
var CLIENTE = null;
var receberContas = [];
var LIMITEDESCONTO = 0;
var VALORDOPRODUTO = 0;
var PRODUTOS = []
var CLIENTES = []
var PRODUTOGRADE = null;
var DIGITOBALANCA = 5;
var REFERENCIASNFE = [];
var FORMASPAGAMENTO = [];
var TIPODIMENSAO = ''
function convertData(data){
	let d = data.split('-');
	return d[2] + '/' + d[1] + '/' + d[0];
}

var QTDVOLUMES = 0;
var PESOLIQUIDO = 0;
var PESOBRUTO = 0;
var SOMAVOLUMES = 0;

var SOMAALTURA = 0;
var SOMALARGURA = 0;
var SOMACOMPRIMENTO = 0;
var PERMITEDESCONTO = 0;

$(function () {
	PERMITEDESCONTO = $('#permite_desconto').val()
	
	PRODUTOS = JSON.parse($('#produtos').val())
	FORMASPAGAMENTO = JSON.parse($('#formasPagamento').val())
	if($('#venda_edit').val()){
		VENDA = JSON.parse($('#venda_edit').val())
		VENDA.itens.map((rs) => {
			console.log(rs)
			addItemTable(rs.produto.id, rs.produto.nome, rs.quantidade, rs.valor, rs.altura, rs.largura,
				rs.profundidade, rs.esquerda, rs.direita, rs.superior, rs.inferior, rs.acrescimo_perca);
		})

		VENDA.referencias.map((rs) => {
			REFERENCIASNFE.push(rs.chave)
		})
		let t = montaTabela();
		$('#prod tbody').html(t)

		t = montaTabelaChave();
		$('#chaves tbody').html(t)

		if(!VENDA.frete){
			$('#frete').val('9').change();
		}else{
			$('#frete').val(VENDA.frete.tipo).change();
		}
		
		CLIENTE = VENDA.cliente;
		if(VENDA.duplicatas.length > 0){
			VENDA.duplicatas.map((rs) => {
				addpagamento(convertData(rs.data_vencimento), parseFloat(rs.valor_integral))
			})
		}else{
			// addpagamento(convertData(VENDA.created_at.substring(0,10)), VENDA.valor_total)
			addpagamento(convertData(VENDA.created_at.substring(0,10)), parseFloat(VENDA.valor_total).toFixed(casas_decimais))
		}
		habilitaBtnSalarVenda();
	}else{
		CLIENTES = JSON.parse($('#clientes').val())
	}

	let itensDeCredito = $('#itens_credito').val();
	let cli = $('#cliente_crediario').val();
	if(itensDeCredito){
		let js = JSON.parse(itensDeCredito);
		let obs = "Correspondente as compras numero: ";
		let anterior = '';
		js.map((v) => {
			console.log(v)
			addItemDeCredito(v)
			receberContas.push(v.id);
			if(v.id != anterior)
				obs += v.id + ",";
			anterior = v.id;
		})
		obs = obs.substring(0, obs.length - 1)
		$('#obs').val(obs)
	}

	if(cli){
		CLIENTE = JSON.parse(cli);
		setCliente(CLIENTE)
		console.log(CLIENTE)
	}

	$("#formaPagamento option.teste").attr('disabled', 'false');


	if($('#formaPagamento').val() == 'personalizado'){
		$('#btn-modal-pagamentos').removeClass('disabled')
	}

});

function setCliente(cli){
	$('#kt_select2_3').val(cli.id).change()
	CLIENTES.map((d) => {
		if(d.id == cli.id){ 

			$('#div-cliente').css('display', 'block');
			$('#razao_social').html(d.razao_social)
			$('#nome_fantasia').html(d.nome_fantasia)
			$('#logradouro').html(d.rua)
			$('#numero').html(d.numero)

			$('#cnpj').html(d.cpf_cnpj)
			$('#ie').html(d.ie_rg)
			$('#fone').html(d.telefone)
			$('#cidade').html(d.cidade.nome + " (" + d.cidade.uf + ")")
			$('#limite').html(d.limite_venda)
			console.log("limite: " + d.limite_venda)
			CLIENTE = d;
			if(d.limite_venda <= 0){
				$('#col-credito').css('display', 'none');
				$('#sem_crediario').css('display','block');
			}else{
				$('#col-credito').css('display', 'block');
				$('#sem_crediario').css('display','none');
			}
			habilitaBtnSalarVenda();
		}

	})
}

$('#kt_select2_3').change(() => {
	let id = $('#kt_select2_3').val()
	CLIENTES.map((d) => {
		if(d.id == id){ 

			$('#div-cliente').css('display', 'block');
			$('#razao_social').html(d.razao_social)
			$('#nome_fantasia').html(d.nome_fantasia)
			$('#logradouro').html(d.rua)
			$('#numero').html(d.numero)

			$('#cnpj').html(d.cpf_cnpj)
			$('#ie').html(d.ie_rg)
			$('#fone').html(d.telefone)
			$('#cidade').html(d.cidade.nome + " (" + d.cidade.uf + ")")
			$('#limite').html(d.limite_venda)
			console.log("limite: " + d.limite_venda)
			CLIENTE = d;
			if(d.limite_venda <= 0){
				$('#col-credito').css('display', 'none');
				$('#sem_crediario').css('display','block');
			}else{
				$('#col-credito').css('display', 'block');
				$('#sem_crediario').css('display','none');
			}
			habilitaBtnSalarVenda();
		}

	})
})

function addItemDeCredito(item){

	let codigo = item.produto_id;
	let nome = item.nome;
	let quantidade = item.quantidade;
	let valor = item.valor;
	
	addItemTable(codigo, nome, quantidade, valor);
}

$('#kt_select2_1').change(() => {
	let produto_id = $('#kt_select2_1').val()
	let lista_id = $('#lista_id').val()

	PRODUTOS.map((p) => {

		if(produto_id == p.id){
			console.log(p)
			if(p.grade == 1){
				montaGrade(p.referencia_grade)
				$('#modal-grade').modal('show')
			}else if(p.tipo_dimensao != ''){
				$('#valor').val(maskMoney(parseFloat(p.valor_venda)))
				$('#acrescimo_perca-dim').val(p.acrescimo_perca)
				TIPODIMENSAO = p.tipo_dimensao
				montaTipoDimensao(p.tipo_dimensao)
				if(p.tipo_dimensao == 'area'){
					$('.dim-area').css('display', 'block')
					$('.dim-dimensao').css('display', 'none')
				}else{
					$('.dim-dimensao').css('display', 'block')
					$('.dim-area').css('display', 'none')
				}
				$('#modal-dimensao').modal('show')
			}else{
				LIMITEDESCONTO = parseFloat(p.limite_maximo_desconto);
				VALORDOPRODUTO = parseFloat(p.valor_venda);
				$('#quantidade').val('1')
				if(lista_id == 0){
					$('#valor').val(maskMoney(parseFloat(p.valor_venda)))
				}else{
					p.lista_preco.map((l) => {
						if(lista_id == l.lista_id){
							// $('#valor').val(l.valor)
							$('#valor').val(maskMoney(parseFloat(l.valor)))

						}
					})
				}
				calcSubtotal();
			}
		}
	})
})

function calcularDimensao(){
	$('#modal-dimensao').modal('hide')
	let acrescimoDim = $('#acrescimo_perca-dim').val() ? $('#acrescimo_perca-dim').val().replace(",", ".") : 0
	if(TIPODIMENSAO == 'area'){
		let altura = $('#altura-dim').val() ? $('#altura-dim').val().replace(",", ".") : 0
		let largura = $('#largura-dim').val() ? $('#largura-dim').val().replace(",", ".") : 0
		let profundidade = $('#profundidade-dim').val() ? $('#profundidade-dim').val().replace(",", ".") : 0
		if(altura == 0 || largura == 0){
			swal("Atenção", "Informe lagura, altura", "warning")
		}else{
			let calc = altura*largura
			if(profundidade > 0){
				calc = calc * profundidade
			}
			if(acrescimoDim > 0){
				calc = calc + parseFloat(acrescimoDim)
			}
			$('#quantidade').val(calc)
			calcSubtotal();
		}
	}else{
		let esquerda = $('#esquerda-dim').val() ? $('#esquerda-dim').val().replace(",", ".") : 0
		let direita = $('#direita-dim').val() ? $('#direita-dim').val().replace(",", ".") : 0
		let superior = $('#superior-dim').val() ? $('#superior-dim').val().replace(",", ".") : 0
		let inferior = $('#inferior-dim').val() ? $('#inferior-dim').val().replace(",", ".") : 0
		if(esquerda == 0 || direita == 0 || superior == 0 || inferior == 0){
			swal("Atenção", "Informe todos os lados", "warning")
		}else{
			let calc = parseFloat(esquerda)+parseFloat(direita)+parseFloat(superior)+parseFloat(inferior)
			
			if(acrescimoDim > 0){
				calc = calc + parseFloat(acrescimoDim)
			}
			$('#quantidade').val(calc)
			calcSubtotal();
		}
	}
}

function limpaCamposDimensao(){
	$('#altura-dim').val('')
	$('#largura-dim').val('')
	$('#profundidade-dim').val('')
	$('#esquerda-dim').val('')
	$('#direita-dim').val('')
	$('#superior-dim').val('')
	$('#inferior-dim').val('')
	$('#acrescimo_perca-dim').val('')
}

function montaGrade(referencia){
	let prods = PRODUTOS.filter((x) => {
		if(referencia == x.referencia_grade) return x
	})
	console.log(prods)
	let html = ''
	prods.map((p) => {
		html += '<div class="row" style="height: 40px">'
		html += '<div class="col-sm-8 col-lg-8 col-10">'
		html += '<h4>'+ p.str_grade +'</h4>'
		html += '</div>'
		html += '<div class="col-sm-2 col-lg-2 col-2">'
		html += '<button onclick="selectGrade('+p.id+')" class="btn btn-success btn-sm btn-block">'
		html += '<i class="la la-check"></i></button>'
		html += '</div></div>'
	})
	$('.grade-prod').html(html)
}

function montaTipoDimensao(tipo){

}

function selectGrade(id){
	let p = PRODUTOS.filter((x) => { return x.id == id })
	p = p[0]
	PRODUTOGRADE = p
	LIMITEDESCONTO = parseFloat(p.limite_maximo_desconto);
	VALORDOPRODUTO = parseFloat(p.valor_venda);
	console.log(VALORDOPRODUTO)
	let lista_id = $('#lista_id').val()

	$('#quantidade').val('1')
	if(lista_id == 0){
		$('#valor').val(p.valor_venda)
	}else{
		p.lista_preco.map((l) => {
			if(lista_id == l.lista_id){
				$('#valor').val(l.valor)
			}
		})
	}
	$('#modal-grade').modal('hide')
	calcSubtotal();
}

function somaQuantidadeProdutoAdicionado(produto, quantidadeAdicionar, call){
	console.clear()
	
	console.log(produto)
	let quantidade = 0;
	ITENS.map((p) => {
		if(p.codigo == produto.id){
			quantidade += parseFloat(p.quantidade)
		}
	})

	quantidade += parseFloat(quantidadeAdicionar);

	console.log("qtd", quantidade)

	if(produto.gerenciar_estoque == 1 && (!produto.estoque || produto.estoque.quantidade < quantidade)){
		call(false)
	}else{
		call(true)
	}
}

$('#addProd').click(() => {
	$('#formaPagamento').val('--').change();
	let quantidade = $('#quantidade').val();
	let valor = parseFloat($('#valor').val())
	let menorValorPossivel = VALORDOPRODUTO - (VALORDOPRODUTO * (LIMITEDESCONTO/100))

	if(LIMITEDESCONTO == 0) menorValorPossivel = 0

		if(valor >= menorValorPossivel){

			let p_id = $('#kt_select2_1').val();
			if(PRODUTOGRADE != null){
				console.log(PRODUTOGRADE.id)
				p_id = PRODUTOGRADE.id
			}
			PRODUTOS.map((p) => {
				if(p_id == p.id){

					somaQuantidadeProdutoAdicionado(p, quantidade, (adicionar) => {
						console.log(adicionar)

						if(!adicionar){
							swal("Cuidado", "Estoque insuficiente!", "warning")
						}else{
							let codigo = p.id;
							let nome = p.nome;
							if(PRODUTOGRADE != null){
								nome += " (" + PRODUTOGRADE.str_grade + ")"
							}
							let valor = $('#valor').val();
							console.log("produto", p)

							let pLiquido = parseFloat(p.peso_liquido)
							let pBruto = parseFloat(p.peso_bruto)
							PESOLIQUIDO += pLiquido * quantidade;
							PESOBRUTO += pLiquido * quantidade;
							SOMAVOLUMES += parseInt(quantidade);

							SOMAALTURA += parseFloat(p.altura)
							SOMACOMPRIMENTO += parseFloat(p.comprimento)
							SOMALARGURA += parseFloat(p.largura)

							if(codigo != null && nome.length > 0 && quantidade > 0 && parseFloat(valor.replace(',','.')) > 0) {
								valor = valor.replace(",", ".");
								addItemTable(codigo, nome, quantidade, valor);
							}else{
								swal("Erro", "Informe corretamente os campos para continuar!", "error")
							}

							$('#pesoL').val(PESOLIQUIDO)
							$('#pesoB').val(PESOBRUTO)
							$('#qtdVol').val(SOMAVOLUMES)

							$('#peso-modal').val(PESOLIQUIDO)
							$('#comprimento-modal').val(SOMACOMPRIMENTO)
							$('#largura-modal').val(SOMALARGURA)
							$('#altura-modal').val(SOMAALTURA)

							PRODUTOGRADE = null
						}
					})
					
				}
			})
		}else{
			swal("Erro", "Minimo permitido para este item R$ " + menorValorPossivel.toFixed(2), "error")
		}
		
	})


function formatReal(v)
{
	return v.toLocaleString('pt-br',{style: 'currency', currency: 'BRL', minimumFractionDigits: casas_decimais});
}

function atualizaTotal(){
	let desconto = 0;
	let acrescimo = 0;
	if($('#desconto').val()){
		desconto = parseFloat($('#desconto').val().replace(',', '.'))
	}

	if($('#acrescimo').val()){
		acrescimo = parseFloat($('#acrescimo').val().replace(',', '.'))
	}
	$('#totalNF').html(formatReal(TOTAL+acrescimo-desconto));
	$('#soma-quantidade').html(TOTALQTD);
}

function verificaProdutoIncluso(cod){
	if(ITENS.length == 0) return false;
	if($('#prod tbody tr').length == 0) return false;
	let duplicidade = false;

	ITENS.map((v) => {
		if(v.codigo == cod){
			duplicidade = true;
		}
	})

	let c;
	if(duplicidade) c = !confirm('Produto já adicionado, deseja incluir novamente?');
	else c = false;
	console.log(c)
	return c;
}

function montaTabela(){
	let t = ""; 
	ITENS.map((v) => {

		t += '<tr class="datatable-row">'
		t += '<td class="datatable-cell">'
		t += '<span class="codigo" style="width: 70px;">'
		t += v.id + '</span>'
		t += '</td>'

		t += '<td class="datatable-cell">'
		t += '<span class="codigo" style="width: 70px;">'
		t += v.codigo + '</span>'
		t += '</td>'

		t += '<td class="datatable-cell">'
		t += '<span class="codigo" style="width: 300px;">'
		t += v.nome + '</span>'
		t += '</td>'


		t += '<td class="datatable-cell">'
		t += '<span class="codigo" style="width: 100px;">'
		t += v.quantidade + '</span>'
		t += '</td>'

		t += '<td class="datatable-cell">'
		t += '<span class="codigo" style="width: 100px;"> R$ '
		t += parseFloat(v.valor).toFixed(casas_decimais)

		if(PERMITEDESCONTO > 0){
			t += '<button onclick="descontoItem('+v.id+')" class="btn btn-sm" type="button">'	
			t += '<i class="la la-dollar-sign text-danger"></i></button>'
		}
		t += '</span></td>'

		t += '<td class="datatable-cell">'
		t += '<span class="codigo" style="width: 100px;">'
		t += formatReal(v.valor.replace(',','.')*v.quantidade.replace(',','.')) + '</span>'
		t += '</td>'


		t += "<td class='datatable-cell'><span class='codigo' style='width: 100px;'><a href='#prod tbody' class='btn btn-danger' onclick='deleteItem("+v.id+")'>"
		t += "<i class='la la-trash'></i></a></span></td>";
		t+= "</tr>";
	});
	return t
}

function descontoItem(id){
	console.clear()
	let item = ITENS.filter((x) => {
		return x.id == id
	})
	item = item[0]
	console.log(item)
	let p = PRODUTOS.filter((x) => {
		return x.id == item.codigo
	})
	PRODUTO = p[0]
	if(item){
		LIMITEDESCONTO = parseFloat(PRODUTO.limite_maximo_desconto);
		VALORDOPRODUTO = parseFloat(PRODUTO.valor_venda);
		let menorValorPossivel = VALORDOPRODUTO - (VALORDOPRODUTO * (LIMITEDESCONTO/100))

		swal({
			title: 'Desconto do item',
			text: 'Ultilize % no inicio para desconto percentual!',
			content: "input",
			button: {
				text: "Ok",
				closeModal: false,
				type: 'error'
			}
		}).then(v => {
			let vDesc = 0;
			if(v) {
				v = v.replace(",", ".")
				let desconto = v;
				if(desconto.substring(0, 1) == "%"){
					let perc = desconto.substring(1, desconto.length);
					vDesc = item.valor * (perc/100);
				}else{
					desconto = desconto.replace(",", ".")
					vDesc = parseFloat(desconto)
				}
				let valor = item.valor - vDesc
				swal.close()
				$('#codBarras').focus()
				if(valor >= menorValorPossivel){
					ajustaValorItem(valor, id)
				}else{
					swal("Erro", "Minimo permitido para este item R$ " + menorValorPossivel.toFixed(2), "error")
				}
				
			}
		});
	}
}

function ajustaValorItem(novoValor, id){
	for(let i=0; i<ITENS.length; i++){
		ITENS[i].valor = novoValor+""
		TOTAL = parseFloat((ITENS[i].valor * ITENS[i].quantidade));
	}
	setTimeout(() => {
		let t = montaTabela();
		atualizaTotal();
		$('#prod tbody').html(t)
		$('#kt_select2_1').val('null').change();
	},300)
}

function refatoreItens(){
	let cont = 1;
	let temp = [];
	ITENS.map((v) => {
		v.id = cont;
		temp.push(v)
		cont++;
	})
	console.log(temp)
	ITENS = temp;
}

function maskMoney(v){
	return v.toFixed(casas_decimais);
}

$('#valor').on('keyup', () => {
	calcSubtotal()
})

function calcSubtotal(){
	let quantidade = $('#quantidade').val();
	let valor = $('#valor').val();
	let subtotal = parseFloat(valor.replace(',','.'))*(quantidade.replace(',','.'));
	console.log(subtotal)
	let sub = maskMoney(subtotal)
	$('#subtotal').val(sub)
}

function addItemTable(codigo, nome, quantidade, valor, altura = 0, largura = 0, profundidade = 0, 
	esquerda = 0, direita = 0, superior = 0, inferior = 0, acrescimo_perca = 0){
	if(!verificaProdutoIncluso(codigo)) {
		limparDadosFatura();
		if(quantidade == 1){
			quantidade = '1.00'
		}
		TOTAL += parseFloat(valor.replace(',','.'))*(quantidade.replace(',','.'));
		TOTAL = parseFloat(TOTAL.toFixed(casas_decimais));
		TOTALQTD += parseFloat(quantidade.replace(',','.'));
		if(altura == '0' && esquerda == '0'){
			altura = $('#altura-dim').val() ? $('#altura-dim').val().replace(",", ".") : 0
			largura = $('#largura-dim').val() ? $('#largura-dim').val().replace(",", ".") : 0
			profundidade = $('#profundidade-dim').val() ? $('#profundidade-dim').val().replace(",", ".") : 0
			esquerda = $('#esquerda-dim').val() ? $('#esquerda-dim').val().replace(",", ".") : 0
			direita = $('#direita-dim').val() ? $('#direita-dim').val().replace(",", ".") : 0
			superior = $('#superior-dim').val() ? $('#superior-dim').val().replace(",", ".") : 0
			inferior = $('#inferior-dim').val() ? $('#inferior-dim').val().replace(",", ".") : 0
			acrescimo_perca = $('#acrescimo_perca-dim').val() ? $('#acrescimo_perca-dim').val().replace(",", ".") : 0
		}

		ITENS.push({
			id: (ITENS.length+1), 
			codigo: codigo, nome: nome, 
			quantidade: quantidade, 
			valor: valor,
			altura : altura,
			largura: largura,
			profundidade: profundidade,
			esquerda: esquerda,
			direita: direita,
			superior: superior,
			inferior: inferior,
			acrescimo_perca: acrescimo_perca
		})

	// apagar linhas tabela
	$('#prod tbody').html("");
	refatoreItens();
	limpaCamposDimensao()

	atualizaTotal();
	limparCamposFormProd();
	let t = montaTabela();
	$('#prod tbody').html(t)
	$('#kt_select2_1').val('null').change();
}
}

$('#delete-parcelas').click(() => {
	limparDadosFatura();
})

function deleteItem(id){
	let temp = [];
	ITENS.map((v) => {
		if(v.id != id){
			temp.push(v)
		}else{
			abatePeso(v)
			TOTAL -= parseFloat(v.valor.replace(',','.'))*(v.quantidade.replace(',','.'));
			TOTALQTD -= parseFloat(v.quantidade.replace(',','.'));
		}
	});
	ITENS = temp;
	refatoreItens()
	let t = montaTabela(); // para remover
	$('#prod tbody').html(t)

	atualizaTotal();
}

function abatePeso(value){
	PRODUTOS.map((p) => {
		if(value.id == p.id){
			console.log(p)
			console.log(value)
			let quantidade = parseFloat(value.quantidade)
			let pLiquido = parseFloat(p.peso_liquido)
			let pBruto = parseFloat(p.peso_bruto)
			let largura = parseFloat(p.largura)
			let comprimento = parseFloat(p.comprimento)
			let altura = parseFloat(p.altura)

			PESOLIQUIDO -= pLiquido * quantidade;
			PESOBRUTO -= pLiquido * quantidade;
			SOMAVOLUMES -= quantidade;

			SOMAALTURA -= altura;
			SOMACOMPRIMENTO -= comprimento;
			SOMALARGURA -= largura;

			$('#pesoL').val(PESOLIQUIDO)
			$('#pesoB').val(PESOBRUTO)
			$('#qtdVol').val(SOMAVOLUMES)
		}
	});
}

function limparCamposFormProd(){
	$('#autocomplete-produto').val('');
	$('#quantidade').val('0');
	$('#valor').val('0');
}

function getClientes(data){
	$.ajax
	({
		type: 'GET',
		url: path + 'clientes/all',
		dataType: 'json',
		success: function(e){
			data(e)
		}, error: function(e){
			console.log(e)
		}

	});
}

function getCliente(id, data){
	$.ajax
	({
		type: 'GET',
		url: path + 'clientes/find/'+id,
		dataType: 'json',
		success: function(e){
			data(e)

		}, error: function(e){
			console.log(e)
		}

	});
}


function getTransportadoras(data){
	$.ajax
	({
		type: 'GET',
		url: path + 'transportadoras/all',
		dataType: 'json',
		success: function(e){
			data(e)
		}, error: function(e){
			console.log(e)
		}

	});
}

function getTransportadora(id, data){
	$.ajax
	({
		type: 'GET',
		url: path + 'transportadoras/find/'+id,
		dataType: 'json',
		success: function(e){
			data(e)
		}, error: function(e){
			console.log(e)
		}

	});
}

$('#edit-cliente').click(() => {
	$('autocomplete-cliente').removeClass('disabled');
})

function getProdutos(data){
	$.ajax
	({
		type: 'GET',
		url: path + 'produtos/all',
		dataType: 'json',
		success: function(e){
			data(e)

		}, error: function(e){
			console.log(e)
		}

	});
}

function getProduto(id, data){
	console.log(id)
	$.ajax
	({
		type: 'GET',
		url: path + 'produtos/getProduto/'+id,
		dataType: 'json',
		success: function(e){
			data(e)

		}, error: function(e){
			console.log(e)
		}

	});
}



// Pagamentos

$('#add-pag').click(() => {
	let qtdParcelas = $('#qtdParcelas').val();
	let desconto = $('#desconto').val();
	let acrescimo = $('#acrescimo').val();

	if(desconto.length == 0) desconto = 0;
	else desconto = desconto.replace(",", ".");

	if(acrescimo.length == 0) acrescimo = 0;
	else acrescimo = acrescimo.replace(",", ".");

	if(!verificaValorMaiorQueTotal()){
		let data = $('#kt_datepicker_3').val();
		let valor = $('#valor_parcela').val();
		let cifrao = valor.substring(0, 2);
		if(cifrao == 'R$') valor = valor.substring(3, valor.length)
			if(data.length > 0 && valor.length > 0 && parseFloat(valor.replace(',','.')) > 0) {

				addpagamento(data, valor);

				if(qtdParcelas == FATURA.length+1){
					somaParcelas((v) => {
						let dif = (TOTAL - parseFloat(desconto) + parseFloat(acrescimo)) - v;
						$('#valor_parcela').val(formatReal(dif))
					})
				}
			}else{
				swal("Erro", "Informe corretamente os campos para continuar!", "error")

			}
		}
	})

function verificaValorMaiorQueTotal(data){
	let retorno;
	let valorParcela = $('#valor_parcela').val();
	let qtdParcelas = $('#qtdParcelas').val();
	let desconto = $('#desconto').val();
	let acrescimo = $('#acrescimo').val();
	
	if(desconto.length == 0) desconto = 0;
	else desconto = desconto.replace(',', '.');

	if(acrescimo.length == 0) acrescimo = 0;
	else acrescimo = acrescimo.replace(',', '.');

	let cifrao = valorParcela.substring(0, 2);
	if(cifrao == 'R$') valorParcela = valorParcela.substring(3, valorParcela.length)

		if(valorParcela.length > 6){
			valorParcela = valorParcela.replace(".", "");
		}
		valorParcela = valorParcela.replace(",", ".");

		let totalComDesconto = (TOTAL - parseFloat(desconto) + parseFloat(acrescimo)).toFixed(casas_decimais)

		console.log(totalComDesconto)
		console.log(valorParcela)

		if(valorParcela <= 0){
			swal("Erro", "Valor da parcela deve ser maior que 0!", "error")
			retorno = true;

		}
		else if(parseFloat(valorParcela) > parseFloat(totalComDesconto)){
			swal("Erro", "Valor da parcela maior que o total da venda!", "error")
			retorno = true;
		}

		else if(qtdParcelas > 1){
			somaParcelas((v) => {
			// if(valorParcela.length > 6){
			// 	// valorParcela = valorParcela.replace('.', '')
			// 	valorParcela = valorParcela.replace(',', '.')
			// }else{
			// 	valorParcela = valorParcela.replace(',', '.')
			// }
			valorParcela = valorParcela.replace(',', '.')

			console.log(parseFloat(valorParcela))
			console.log(TOTAL)
			console.log(v)
			console.log(parseFloat(valorParcela))


			let parcelaMaisSoma = parseFloat((v+parseFloat(valorParcela)).toFixed(2));
			console.log(parcelaMaisSoma)
			

			//Valida Parcela maior que 1000

			if(parcelaMaisSoma > (TOTAL - parseFloat(desconto) + parseFloat(acrescimo))){
				swal("Erro", "Valor ultrapassaou o total!", "error")
				retorno = true;
			}
			else if(parcelaMaisSoma == (TOTAL  - parseFloat(desconto) + parseFloat(acrescimo)) && (FATURA.length+1) < parseInt(qtdParcelas)){
				swal("Erro", "Respeite a quantidade de parcelas pré definido!", "error")
				retorno = true;
				
			}
			else if(parcelaMaisSoma < (TOTAL  - parseFloat(desconto) + parseFloat(acrescimo)) && 
				(FATURA.length+1) == parseInt(qtdParcelas)){

				swal("Erro", "Somátoria incorreta!", "error")
			let dif = (TOTAL - parseFloat(desconto) + parseFloat(acrescimo)) - v;
			$('#valor_parcela').val(formatReal(dif))
			retorno = true;

		}
		else{
			retorno = false;	
		}

	})
		}
		else{
			retorno = false;
		}

		return retorno;
	}

	function somaParcelas(call){
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
		soma += parseFloat(v.valor.replace(',','.'));

	})
		call(soma)
	}

	function verificaValor(){
		console.log('verificando valor...')
		let soma = 0;
		FATURA.map((v) => {

			// if(v.valor.length > 6){
			// 	v = v.valor.replace('.','');
			// 	v = v.replace(',','.');
			// 	soma += parseFloat(v);

			// }else{
			// 	soma += parseFloat(v.valor.replace(',','.'));
			// }
			soma += parseFloat(v.valor.replace(',','.'));

		})

		let desconto = $('#desconto').val();
		if(desconto.length == 0) desconto = 0;
		else desconto = desconto.replace(",", ".");

		let acrescimo = $('#acrescimo').val();
		if(acrescimo.length == 0) acrescimo = 0;
		else acrescimo = acrescimo.replace(",", ".");

		console.log(TOTAL)
		console.log("soma: "+ soma)
		if(soma >= (TOTAL - parseFloat(desconto) + parseFloat(acrescimo))){
			$('#add-pag').addClass("disabled");
			// alert("Parcela de Pagamento OK...")
		}
	}

	function addpagamento(data, valor){
		console.log("data", data)
		if(ITENS.length > 0){
			if(valor.length > 6){
				valor = valor.replace(".", "");
			}
			try{
				valor = valor.replace(",", ".");
			}catch{
				valor = valor.toFixed(2)
				valor = String(valor);

			}

			FATURA.push({data: data, valor: valor, numero: (FATURA.length + 1)})

			$('#fatura tbody').html(""); // apagar linhas da tabela
			let t = ""; 
			FATURA.map((v) => {

				t += '<tr class="datatable-row" style="left: 0px;">'
				t += '<td class="datatable-cell">'
				t += '<span class="codigo" style="width: 120px;">'
				t += v.numero + '</span>'
				t += '</td>'

				t += '<td class="datatable-cell">'
				t += '<span class="codigo" style="width: 120px;">'
				t += v.data + '</span>'
				t += '</td>'

				t += '<td class="datatable-cell">'
				t += '<span class="codigo" style="width: 120px;">'
				t += v.valor.replace('.', ',') + '</span>'
				t += '</td>'

				t+= "</tr>";
			});

			$('#fatura tbody').html(t)
			verificaValor();
		}
		habilitaBtnSalarVenda();
	}


	function limparDadosFatura(){
		$('#fatura tbody').html('')
		$("#kt_datepicker_3").val("");
		$("#valor_parcela").val("");
		$('#add-pag').removeClass("disabled");
		FATURA = [];
		habilitaBtnSalarVenda()
	}

	$('#qtdParcelas').on('keyup', () => {
		limparDadosFatura();
		if($("#qtdParcelas").val()){
			let desconto = $('#desconto').val();
			if(desconto.length == 0) desconto = 0;
			else desconto = desconto.replace(',', '.');

			let acrescimo = $('#acrescimo').val();
			if(acrescimo.length == 0) acrescimo = 0;
			else acrescimo = acrescimo.replace(',', '.');

			let qtd = $("#qtdParcelas").val();
			// alert((TOTAL - parseFloat(desconto))/qtd)

			$('#valor_parcela').val(formatReal((TOTAL - parseFloat(desconto) + parseFloat(acrescimo))/qtd));
		}
	})


	function habilitaBtnSalarVenda(){

		let cep = CLIENTE != null ? CLIENTE.cep : '';
		cep = cep.replace("-", "")
		$('#cep-destino-modal').val(cep)
		let desconto = $('#desconto').val();
		if(desconto.length == 0) desconto = 0;
		else desconto = desconto.replace(',', '.');

		let acrescimo = $('#acrescimo').val();
		if(acrescimo.length == 0) acrescimo = 0;
		else acrescimo = acrescimo.replace(',', '.');

		if(ITENS.length > 0 && FATURA.length > 0 && (TOTAL - parseFloat(desconto) + parseFloat(acrescimo)) > 0 && CLIENTE != null){
			$('#salvar-venda').removeClass('disabled')
			$('#salvar-orcamento').removeClass('disabled')
		}else{
			let tipoPag = $('#tipoPagamento').val();
			if(tipoPag == '90' && ITENS.length > 0 && CLIENTE != null){
				$('#salvar-venda').removeClass('disabled')
				$('#salvar-orcamento').removeClass('disabled')
			}else{
				$('#salvar-venda').addClass('disabled')
				$('#salvar-orcamento').addClass('disabled')
			}
		}


	}

	function verificaLimite(call){
		$.ajax
		({
			type: 'GET',
			data: {
				id: parseInt(CLIENTE.id),
			},
			url: path + 'clientes/verificaLimite',
			dataType: 'json',
			success: function(e){
				if(e.soma == null){ 
					call(0) 
				}else{
					call(e.soma)
				}
			}, error: function(e){
				call(false)
				$('#preloader2').css('display', 'none');
			}
		});
	}

	function validaFrete(call){
		call(true);
		// let tipoFrete = $('#frete').val();
		// if(tipoFrete != '9'){
		// 	let placa = $('#placa').val();
		// 	let valor = $('#valor_frete').val();
		// 	if(placa.length == 8 && valor.length > 0 && parseFloat(valor.replace(",", ".")) >= 0 && $('#uf_placa').val() != '--'){
		// 		call(true);
		// 	}else{
		// 		call(false);
		// 	}
		// }else{
		// 	call(true);
		// }
	}

	$('#frete').change(() => {
		if($('#frete').val() == '9'){

			$('#placa').attr('disabled', true)
			$('#valor_frete').attr('disabled', true)

		}else{
			$('#placa').removeAttr('disabled')
			$('#valor_frete').removeAttr('disabled')

		}
	})

	$('#desconto').on('keyup', () => {
		limparDadosFatura()
		let desconto = $('#desconto').val();
		if(TOTAL > 0){
			desconto = desconto.replace(",", ".");
			let t = parseFloat(TOTAL) - parseFloat(desconto)
			console.log(t)
		}else{
			alert("Adicione itens para despois informar o desconto")
			$('#desconto').val('')
		}

	});

	$('#acrescimo').on('keyup', () => {
		limparDadosFatura()
		let acrescimo = $('#acrescimo').val();
		if(TOTAL > 0){
			acrescimo = acrescimo.replace(",", ".");
			let t = parseFloat(TOTAL) + parseFloat(acrescimo)
			console.log(t)
		}else{
			alert("Adicione itens para despois informar o acréscimo")
			$('#acrescimo').val('')
		}

	});

	$('#tipoPagamento').change(() => {

		let tipo = $('#tipoPagamento').val()
		if(tipo == '03' || tipo == '04'){
			$('#modal-cartao').modal('show')
		}

		if(tipo == '99'){
			$('#modal-pag-outros').modal('show')
		}

		if(tipo == '90'){
			habilitaBtnSalarVenda()
		}

	})

	$('#formaPagamento').change(() => {
		$('#btn-modal-pagamentos').addClass('disabled')

		limparDadosFatura();
		let now = new Date();
		let data = (now.getDate() < 10 ? "0"+now.getDate() : now.getDate()) + 
		"/"+ ((now.getMonth()+1) < 10 ? "0" + (now.getMonth()+1) : (now.getMonth()+1)) + 
		"/" + now.getFullYear();

		var date = new Date(new Date().setDate(new Date().getDate() + 30));
		let data30 = (date.getDate() < 10 ? "0"+date.getDate() : date.getDate()) + 
		"/"+ ((date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1)) + 
		"/" + date.getFullYear();

		let desconto = $('#desconto').val();
		desconto = desconto.replace(",", ".");
		if(desconto.length == 0) desconto = 0;

		let acrescimo = $('#acrescimo').val();
		acrescimo = acrescimo.replace(",", ".");
		if(acrescimo.length == 0) acrescimo = 0;

		$("#qtdParcelas").attr("disabled", true);
		$("#kt_datepicker_3").attr("disabled", true);
		$("#valor_parcela").attr("disabled", true);
		$("#qtdParcelas").val('1');
		if($('#formaPagamento').val() == 'a_vista'){
			$("#qtdParcelas").val(1)
			$('#valor_parcela').val(formatReal((TOTAL - parseFloat(desconto) + parseFloat(acrescimo))));
			$('#kt_datepicker_3').val(data);
		}else if($('#formaPagamento').val() == '30_dias'){

			$("#qtdParcelas").val(1)
			$('#valor_parcela').val(formatReal((TOTAL - parseFloat(desconto) + parseFloat(acrescimo))));
			$('#kt_datepicker_3').val(data30);
		}else if($('#formaPagamento').val() == 'personalizado'){
			$('#btn-modal-pagamentos').removeClass('disabled')
			$("#qtdParcelas").removeAttr("disabled");
			$("#kt_datepicker_3").removeAttr("disabled");
			$("#valor_parcela").removeAttr("disabled");
			$("#kt_datepicker_3").val("");
			$("#qtdParcelas").val(1)
			$("#valor_parcela").val(formatReal(TOTAL - parseFloat(desconto) + parseFloat(acrescimo)));
		}
		else if($('#formaPagamento').val() == 'conta_crediario'){

			if(CLIENTE == null || CLIENTE.limite_venda <= 0){
				swal("Erro", "Limite do cliente deve ser maior que Zero!", "error")
				$('#formaPagamento').val('--').change()

			}else{

				$("#qtdParcelas").val(1);
				$("#kt_datepicker_3").val(data);
				$("#valor_parcela").val(formatReal(TOTAL - parseFloat(desconto) + parseFloat(acrescimo)));
			}
		}else{
			let chave = $('#formaPagamento').val()
			let fp = FORMASPAGAMENTO.filter((x) => { return x.chave == chave })
			console.log(fp)
			if(fp.length > 0){
				fp = fp[0]
			}
			var date = new Date(new Date().setDate(new Date().getDate() + fp.prazo_dias));
			let datep = (date.getDate() < 10 ? "0"+date.getDate() : date.getDate()) + 
			"/"+ ((date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1)) + 
			"/" + date.getFullYear();

			$('#btn-modal-pagamentos').removeClass('disabled')
			$("#qtdParcelas").removeAttr("disabled");
			$("#kt_datepicker_3").removeAttr("disabled");
			$("#valor_parcela").removeAttr("disabled");
			$("#kt_datepicker_3").val(datep);
			$("#qtdParcelas").val(1)
			$("#valor_parcela").val(formatReal(TOTAL - parseFloat(desconto) + parseFloat(acrescimo)));
		}
	})

	function atualizarVenda(btnClick){
		console.log(ITENS)

		verificaLimite((limite) => {

			validaFrete((validaFrete) => {
				if(validaFrete){
					$('#preloader2').css('display', 'block');

					let vol = {
						'especie': $('#especie').val(),
						'numeracaoVol': $('#numeracaoVol').val(),
						'qtdVol': $('#qtdVol').val(),
						'pesoL': $('#pesoL').val(),
						'pesoB': $('#pesoB').val(),
					}

					var transportadora = $('#kt_select2_2').val();
					transportadora = transportadora == 'null' ? null : transportadora;

					let js = {
						venda_id: VENDA.id,
						cliente: parseInt(CLIENTE.id),
						transportadora: transportadora,
						formaPagamento: $('#formaPagamento').val(),
						tipoPagamento: $('#tipoPagamento').val(),
						naturezaOp: parseInt($('#natureza').val()),
						frete: $('#frete').val(),
						placaVeiculo: $('#placa').val(),
						ufPlaca: $('#uf_placa').val(),
						valorFrete: $('#valor_frete').val(),
						itens: ITENS,
						fatura: FATURA,
						volume: vol,
						referencias: REFERENCIASNFE,
						receberContas: receberContas,
						total: TOTAL,
						data_entrega: $('#data_entrega').val(),
						observacao: $('#obs').val(),
						desconto: $('#desconto').val() ? $('#desconto').val() : 0,
						acrescimo: $('#acrescimo').val() ? $('#acrescimo').val() : 0,
						btn: btnClick
					}
					let token = $('#_token').val();
					console.log(js)
					$.ajax
					({
						type: 'POST',
						data: {
							venda: js,
							_token: token
						},
						url: path + 'vendas/atualizar',
						dataType: 'json',
						success: function(e){
							console.log(e)
							$('#preloader2').css('display', 'none');
							sucesso(e)

						}, error: function(e){
							console.log(e)
							$('#preloader2').css('display', 'none');
						}
					});

					if(btnClick == 'cp_fiscal'){

					}
				}else{

					swal('Erro', 'Informe placa e valor de frete!', 'error')
				}
			})
			
		})
	}


	var salvando = false;
	function salvarVenda(btnClick) {

		if(salvando == false){
			salvando = true;
			verificaLimite((soma) => {
				soma = parseFloat(soma)
				console.log("soma " + soma)

				if($('#formaPagamento').val() != 'conta_crediario' || ((soma + TOTAL) <= CLIENTE.limite_venda)){

					validaFrete((validaFrete) => {
						if(validaFrete){

							let vol = {
								'especie': $('#especie').val(),
								'numeracaoVol': $('#numeracaoVol').val(),
								'qtdVol': $('#qtdVol').val(),
								'pesoL': $('#pesoL').val(),
								'pesoB': $('#pesoB').val(),
							}

							var transportadora = $('#kt_select2_2').val();
							transportadora = transportadora == 'null' ? null : transportadora;

							let js = {
								cliente: parseInt(CLIENTE.id),
								transportadora: transportadora,
								formaPagamento: $('#formaPagamento').val(),
								tipoPagamento: $('#tipoPagamento').val(),
								naturezaOp: parseInt($('#natureza').val()),
								frete: $('#frete').val(),
								placaVeiculo: $('#placa').val(),
								ufPlaca: $('#uf_placa').val(),
								valorFrete: $('#valor_frete').val(),
								itens: ITENS,
								fatura: FATURA,
								volume: vol,
								receberContas: receberContas,
								total: TOTAL,
								referencias: REFERENCIASNFE,
								observacao: $('#obs').val(),
								data_entrega: $('#data_entrega').val(),
								desconto: $('#desconto').val() ? $('#desconto').val() : 0,
								acrescimo: $('#acrescimo').val() ? $('#acrescimo').val() : 0,
								btn: btnClick,
								bandeira_cartao: $('#bandeira_cartao').val() ? $('#bandeira_cartao').val() : '99',
								cAut_cartao: $('#cAut_cartao').val() ? $('#cAut_cartao').val() : '',
								cnpj_cartao: $('#cnpj_cartao').val() ? $('#cnpj_cartao').val() : '',
								descricao_pag_outros: $('#descricao_pag_outros').val() ? $('#descricao_pag_outros').val() : ''
							}
							let token = $('#_token').val();
							console.log(js)

							if($('#formaPagamento').val() != 'a_vista' && 
								$('#tipoPagamento').val() == 15 && $('#contaPadrao').val() != "0"){

								swal({
									title: "Boletos",
									text: "Emitir boletos para venda",
									icon: "warning",
									buttons: [
									'Não',
									'Sim'
									],
								}).then((acao) => {
									if(acao){
										console.log("gerando boleto(s)")
										js.gerar_boleto = true;
										store(js, token)
									}else{	
										store(js, token)
									}
								})

							}else{
								store(js, token)
							}


						}else{
							swal("Erro", "Informe placa e valor de frete!", "error")
						}
					})
				}else{
					salvando = false;
					swal("Erro", "Limite ultrapassado!", "error")
				}
			})
		}

	}

	function store(js, token){
		console.log(js)
		$.ajax
		({
			type: 'POST',
			data: {
				venda: js,
				_token: token
			},
			url: path + 'vendas/salvar',
			dataType: 'json',
			success: function(e){
				console.log(e)
				swal({
					title: "Alerta",
					text: "Deseja imprimir o pedido de venda?",
					icon: "warning",
					buttons: ["Não", 'Sim'],
					dangerMode: true,
				}).then((v) => {
					if (v) {
						window.open(path+'vendas/imprimirPedido/'+e.id)
						sucesso(e)

					} else {
						sucesso(e)
					}
				});
				console.log(e)

			}, error: function(e){
				console.log(e)
			}
		});
	}

	function salvarOrcamento() {
		
		if(salvando == false){
			salvando = true;
			validaFrete((validaFrete) => {
				if(validaFrete){
					$('#preloader2').css('display', 'block');

					let vol = {
						'especie': $('#especie').val(),
						'numeracaoVol': $('#numeracaoVol').val(),
						'qtdVol': $('#qtdVol').val(),
						'pesoL': $('#pesoL').val(),
						'pesoB': $('#pesoB').val(),
					}

					var transportadora = $('#kt_select2_2').val();
					transportadora = transportadora == 'null' ? null : transportadora;
					let js = {
						cliente: parseInt(CLIENTE.id),
						transportadora: transportadora,
						formaPagamento: $('#formaPagamento').val(),
						tipoPagamento: $('#tipoPagamento').val(),
						naturezaOp: parseInt($('#natureza').val()),
						frete: $('#frete').val(),
						placaVeiculo: $('#placa').val(),
						ufPlaca: $('#uf_placa').val(),
						valorFrete: $('#valor_frete').val(),
						data_entrega: $('#data_entrega').val(),
						itens: ITENS,
						fatura: FATURA,
						volume: vol,
						receberContas: receberContas,
						total: TOTAL,
						observacao: $('#obs').val(),
						desconto: $('#desconto').val() ? $('#desconto').val() : 0,
						acrescimo: $('#acrescimo').val() ? $('#acrescimo').val() : 0,
					}
					let token = $('#_token').val();
					console.log(js)
					$.ajax
					({
						type: 'POST',
						data: {
							venda: js,
							_token: token
						},
						url: path + 'orcamentoVenda/salvar',
						dataType: 'json',
						success: function(e){
							$('#preloader2').css('display', 'none');
							sucesso2(e)

						}, error: function(e){
							console.log(e)
							$('#preloader2').css('display', 'none');
						}
					});

					if(btnClick == 'cp_fiscal'){

					}
				}else{
					swal("Erro", "Informe placa e valor de frete!", "error")
				}
			})
		}
	}


	function sucesso(){
		$('#content').css('display', 'none');
		$('#anime').css('display', 'block');
		setTimeout(() => {
			location.href = path+'vendas';
		}, 4000)
	}

	function sucesso2(){
		$('#content').css('display', 'none');
		$('#anime').css('display', 'block');
		setTimeout(() => {
			location.href = path+'orcamentoVenda';
		}, 4000)
	}

	function calcularFrete(){
		$('#btn-frete').addClass('disabled')
		$('#btn-frete').addClass('spinner')
		let sCepOrigem = $('#cep-origem-modal').val();
		let sCepDestino = $('#cep-destino-modal').val();
		let nVlPeso = $('#peso-modal').val();
		let nVlComprimento = $('#comprimento-modal').val();
		let nVlAltura = $('#altura-modal').val();
		let nVlLargura = $('#largura-modal').val();

		let js = {
			sCepOrigem: sCepOrigem,
			sCepDestino: sCepDestino,
			nVlPeso: nVlPeso,
			nVlComprimento: nVlComprimento,
			nVlAltura: nVlAltura,
			nVlLargura: nVlLargura,
		}

		$.get(path + 'vendas/calculaFrete', js)
		.done((success) => {
			$('#btn-frete').removeClass('disabled')
			$('#btn-frete').removeClass('spinner')
			console.log(success)

			swal("Sucesso", "Calculo realizado", "success")
			let html = '<div class="form-group validated col-12">';
			html += '<button onclick="setaValorFrete(\''+success.preco_sedex+'\')" class="btn btn-info">Sedex R$' + success.preco_sedex;
			html += ' - Prazo de entrega: ' + success.prazo_sedex + ' dias';

			html += '<button onclick="setaValorFrete(\''+success.preco+'\')" style="margin-left: 5px;" class="btn btn-warning">Pac R$' + success.preco;
			html += ' - Prazo de entrega: ' + success.prazo + ' dias';
			html += '</div>'

			$('#result-correio').css('display', 'block')
			$('#result-correio').html(html)

		})
		.fail((err) => {
			$('#btn-frete').removeClass('disabled')
			$('#btn-frete').removeClass('spinner')
			console.log(err)
			swal("Erro", "algo deu errado!", "error");

		})
	}

	function setaValorFrete(valor){
		$('#modal-correios').modal('hide')
		$('#valor_frete').val(valor)
	}

	$('#gerarPagamentos').click(() => {
		limparDadosFatura()
		let desconto = $('#desconto').val();
		if(desconto.length == 0) desconto = 0;
		else desconto = desconto.replace(",", ".");

		let acrescimo = $('#acrescimo').val();
		if(acrescimo.length == 0) acrescimo = 0;
		else acrescimo = acrescimo.replace(",", ".");

		let total = TOTAL - parseFloat(desconto) + parseFloat(acrescimo);
		let quantidade = $('#qtd_parcelas').val();
		let intervalo = parseInt($('#intervalo').val());

		console.log(quantidade)
		console.log(intervalo)

		let now = new Date
		let mes = now.getMonth()+1
		if(mes < 10) mes = "0"+mes;

		let dia = now.getDate();
		if(dia < 10) dia = "0"+dia;
		
		let hoje = now.getFullYear() + '-' + mes + '-' + dia
		let data = new Date(hoje+'T01:00:00');

		console.log(hoje)
		let soma = 0;
		let vp = parseFloat(parseFloat(total/quantidade).toFixed(2));
		let valor = 0;

		for(let i = 1; i <= quantidade; i++){
			console.log("vp", vp)

			console.log("soma", soma)
			data.setDate(data.getDate() + intervalo);
			// console.log(data)
			if(i == quantidade){
				valor = total - soma
			}else{
				valor = vp;
			}

			// let js = {
			// 	valor: valor,
			// 	data: (data.getDate() < 10 ? '0'+data.getDate() : data.getDate()) + '/' + (data.getMonth() < 10 ? '0' + 
			// 		data.getMonth() : data.getMonth()) + '/' + data.getFullYear()
			// }
			// console.log(js)
			soma += vp;

			console.log(data)
			let d = (data.getDate() < 10 ? '0'+data.getDate() : data.getDate()) + '/' + (data.getMonth() < 9 ? '0' + 
				(data.getMonth()+1) : (data.getMonth()+1)) + '/' + data.getFullYear();
			// addpagamento(d, String(valor.toFixed(2)))
			addpagamento(d, valor)

		}

		$('#modal-pagamentos').modal('hide');

	})

	function renderizarPagamento(){
		simula10((res) => {
			let html = '';
			res.map((rs) => {
				html += '<option value="'+rs.indice+'">';
				html += rs.indice + 'x R$' +  rs.valor;
				html += '</option>';
			})

			console.log(html)
			$('#qtd_parcelas').html(html)
		});
	}

	function simula10(call){
		let desconto = $('#desconto').val();
		if(desconto.length == 0) desconto = 0;
		else desconto = desconto.replace(",", ".");

		let acrescimo = $('#acrescimo').val();
		if(acrescimo.length == 0) acrescimo = 0;
		else acrescimo = acrescimo.replace(",", ".");

		let total = TOTAL - parseFloat(desconto) + parseFloat(acrescimo);
		let temp = [];
		for(let i = 1; i <= 10; i++){
			let vp = total/i;
			js = {
				'indice': i,
				'valor': vp.toFixed(2)
			}
			temp.push(js)
		}
		call(temp)
	}

	function novoProduto(){
		// $('.form-prod').trigger('reset')

		$('#modal-produto').modal('show')
	}

	function salvarProduto(){
		let data = {
			nome: $('#nome').val(),
			referencia: $('#referencia').val(),
			valor_compra: $('#valor_compra').val(),
			valor_venda: $('#valor_venda').val(),
			percentual_lucro: $('#percentual_lucro').val(),
			estoque: $('#estoque').val(),
			codBarras: $('#codBarras').val(),
			estoque_minimo: $('#estoque_minimo').val(),
			gerenciar_estoque: $('#gerenciar_estoque').is(':checked'),
			inativo: $('#inativo').is(':checked'),
			categoria_id: $('#categoria_id').val(),
			limite_maximo_desconto: $('#limite_maximo_desconto').val(),
			alerta_vencimento: $('#alerta_vencimento').val(),
			unidade_compra: $('#unidade_compra').val(),
			unidade_venda: $('#unidade_venda').val(),
			NCM: $('#NCM').val(),
			CEST: $('#CEST').val(),
			anp: $('#anp').val(),
			perc_glp: $('#perc_glp').val(),
			perc_gnn: $('#perc_gnn').val(),
			perc_gni: $('#perc_gni').val(),
			valor_partida: $('#valor_partida').val(),
			unidade_tributavel: $('#unidade_tributavel').val(),
			quantidade_tributavel: $('#quantidade_tributavel').val(),
			largura: $('#largura').val(),
			altura: $('#altura').val(),
			comprimento: $('#comprimento').val(),
			peso_liquido: $('#peso_liquido').val(),
			peso_bruto: $('#peso_bruto').val(),
			CST_CSOSN: $('#CST_CSOSN').val(),
			CST_PIS: $('#CST_PIS').val(),
			CST_COFINS: $('#CST_COFINS').val(),
			CST_IPI: $('#CST_IPI').val(),
			CST_CSOSN_EXP: $('#CST_CSOSN_EXP').val(),
			CFOP_saida_estadual: $('#CFOP_saida_estadual').val(),
			CFOP_saida_inter_estadual: $('#CFOP_saida_inter_estadual').val(),
			perc_icms: $('#perc_icms').val(),
			perc_pis: $('#perc_pis').val(),
			perc_cofins: $('#perc_cofins').val(),
			perc_ipi: $('#perc_ipi').val(),
			perc_iss: $('#perc_iss').val(),
			pRedBC: $('#pRedBC').val(),
			cBenef: $('#cBenef').val(),
			perc_icms_interestadual: $('#perc_icms_interestadual').val(),
			perc_icms_interno: $('#perc_icms_interno').val(),
			perc_fcp_interestadual: $('#perc_fcp_interestadual').val()
		}

		validaCampos(data, (msg) => {
			if(msg != ""){
				swal("Erro", msg, "error")
			}else{
				$.post(path + 'produtos/quickSave',
				{
					data: data,
					_token: $('#_token').val()
				})
				.done((success) => {
					limpaCamposFormProduto()
					console.log(success)
					swal("Sucesso", "Produto salvo", "success")
					.then(() => {
						$('#kt_select2_1').append('<option value="'+success.id+'">'
							+success.nome+'</option>');
						$('#kt_select2_1').val(success.id).change()
						PRODUTOS.push(success)
						$('#quantidade').val('1')
						$('#valor').val(maskMoney(parseFloat(success.valor_venda)))
						$('#modal-produto').modal('hide')
					})

				})
				.fail((err) => {
					console.log(err)
					swal("Erro", "Erro ao salvar produto", "error")
				})
			}
		})
	}

	function limpaCamposFormProduto(){
		$('#nome').val('')
		$('#referencia').val('')
		$('#valor_compra').val('')
		$('#valor_venda').val('')
		$('#percentual_lucro').val('')
		$('#estoque').val('')
		$('#codBarras').val('')
		$('#estoque_minimo').val('')

		$('#limite_maximo_desconto').val('')
		$('#alerta_vencimento').val('')

		$('#NCM').val('')
		$('#CEST').val('')
		$('#perc_glp').val('')
		$('#perc_gnn').val('')
		$('#perc_gni').val('')
		$('#valor_partida').val('')
		$('#unidade_tributavel').val('')
		$('#quantidade_tributavel').val('')
		$('#largura').val('')
		$('#altura').val('')
		$('#comprimento').val('')
		$('#peso_liquido').val('')
		$('#peso_bruto').val('')
	}

	function validaCampos(data, call){
		let msg = ""
		if(data.nome == ""){
			msg += "Nome obrigatório\n"
		}
		if(data.percentual_lucro == ""){
			msg += "% lucro obrigatório\n"
		}
		if(data.valor_venda == ""){
			msg += "valor de venda obrigatório\n"
		}
		if(data.valor_compra == ""){
			msg += "valor de compra obrigatório\n"
		}
		if(data.NCM == ""){
			msg += "NCM obrigatório\n"
		}
		if(data.CFOP_saida_estadual == ""){
			msg += "CFOP saída interno obrigatório\n"
		}
		if(data.CFOP_saida_inter_estadual == ""){
			msg += "CFOP saída externo obrigatório\n"
		}
		if(data.CFOP_saida_estadual.length < 4){
			msg += "Informe um CFOP saída interno válido\n"
		}
		if(data.CFOP_saida_inter_estadual.length < 4){
			msg += "Informe um CFOP saída externo válido\n"
		}
		if(data.NCM.length < 10){
			msg += "Informe um NCM válido\n"
		}
		call(msg)
	}

	$('#focus-codigo').click(() => {
		$('#codBarras').focus()
	})

	$('#focus-codigo').dblclick(() => {
		$('#modal-cod-barras').modal('show')
		$('#cod-barras2').focus()
	})

	function apontarCodigoDeBarras(){
		let codBarras = $('#cod-barras2').val()
		getProdutoCodBarras(codBarras, (data) => {
			if(data){
				console.log(data)
				setTimeout(() => {
					addItemTable(data.id, data.nome, 1, data.valor_venda);
				}, 400)

			}else{
			}
			$('#cod-barras2').val('')
			$('#modal-cod-barras').modal('hide')
		})
	}

	function getProdutoCodBarras(cod, data){
		let tamanho = ITENS.length;
		console.log(tamanho)
		$.ajax
		({
			type: 'GET',
			url: path + 'produtos/getProdutoCodBarras/'+cod,
			dataType: 'json',
			success: function(e){
				data(e)
				if(e){
					PRODUTO = e;
				}else{
					if(cod.length > 10){
						let id = parseInt(cod.substring(1, DIGITOBALANCA));

						$.get(path+'produtos/getProdutoCodigoReferencia/'+id)
						.done((res) => {

							let valor = cod.substring(7,12);

							let temp = valor.substring(0,3) + '.' +valor.substring(3,5);
							valor = parseFloat(temp)
							console.log(valor)

							PRODUTO = res;

							let quantidade = QUANTIDADE;
							if(PRODUTO.unidade_venda == 'KG'){
								if(TIPOUNIDADEBALANCA == 1){
									let valor_venda = PRODUTO.valor_venda;
									quantidade = valor/valor_venda;
									quantidade = quantidade.toFixed(3);
									valor = valor_venda;
								}else{

									quantidade = valor
									valor = PRODUTO.valor_venda;
								}
							}
							$('#valor_item').val(valor);
							$('#quantidade').val(quantidade);
							let tamanho2 = ITENS.length;
							if(tamanho2 == tamanho){
								console.log("inserindo");
								$('#addProd').trigger('click');
							}
						}).fail((err) => {
							swal("Erro", 'Produto nao encontrado!!', "warning")

							$('#autocomplete-produto').val('')

						})
					}
				}
			}, error: function(e){
				console.log(e)
			}
		});
	}

	$('#codBarras').keyup((v) => {
		setTimeout(() => {
			let cod = v.target.value
			if(cod.length > 10){
				$('#codBarras').val('')
				getProdutoCodBarras(cod, (data) => {
					if(data){
						console.log("prod codigo", data)
						setTimeout(() => {
							addItemTable(data.id, data.nome, 1, data.valor_venda);
						}, 400)
					}else{

					}
				})

			}
		}, 500)
	})

	$('#lista_id').change(() => {
		let lista = $('#lista_id').val();
		$('#produto-search').val('')
		$('#valor').val('0,00')
		$('#quantidade').val('1')
	})

	function addChave(){
		let chave = $('#chave').val()
		if(chave.length != 44){
			swal("Erro", "Informe uma chave com 44 números", "error")
		}else{
			REFERENCIASNFE.push(chave)
			let t = montaTabelaChave(); // para remover
			$('#chaves tbody').html(t)
		}
	}

	function montaTabelaChave(){
		let t = ""; 
		REFERENCIASNFE.map((v) => {

			t += '<tr class="datatable-row">'
			t += '<td class="datatable-cell">'
			t += v
			t += '</td>'
			t += "<td class='datatable-cell'><span class='codigo' style='width: 100px;'><a class='btn btn-danger' onclick='deleteChave(\""+v+"\")'>"
			t += "<i class='la la-trash'></i></a></span></td>";
			t+= "</tr>";
		});
		return t
	}

	function deleteChave(chave){
		let n = []

		REFERENCIASNFE.map((c) => {
			if(c != chave) n.push(c)
		})
		REFERENCIASNFE = n
		let t = montaTabelaChave(); // para remover
		$('#chaves tbody').html(t)
	}

	$('#percentual_lucro').keyup(() => {
		let valorCompra = parseFloat($('#valor_compra').val().replace(',', '.'));
		let percentualLucro = parseFloat($('#percentual_lucro').val().replace(',', '.'));

		if(valorCompra > 0 && percentualLucro > 0){
			let valorVenda = valorCompra + (valorCompra * (percentualLucro/100));
			valorVenda = formatReal(valorVenda);
			valorVenda = valorVenda.replace('.', '')
			valorVenda = valorVenda.substring(3, valorVenda.length)

			$('#valor_venda').val(valorVenda)
		}else{
			$('#valor_venda').val('0')
		}
	})

	$('#valor_venda').keyup(() => {
		let valorCompra = parseFloat($('#valor_compra').val().replace(',', '.'));
		let valorVenda = parseFloat($('#valor_venda').val().replace(',', '.'));

		if(valorCompra > 0 && valorVenda > 0){
			let dif = (valorVenda - valorCompra)/valorCompra*100;

			$('#percentual_lucro').val(dif)
		}else{
			$('#percentual_lucro').val('0')
		}
	})

	function percDesconto(){
		if(TOTAL > 0){
			swal({
				title: 'Valor desconto?',
				text: 'Ultiliza ponto(.) ao invés de virgula, valor %!',
				content: "input",
				button: {
					text: "Ok",
					closeModal: false,
					type: 'error'
				}
			}).then(v => {
				if(v) {

					let desconto = v;

					let perc = desconto;
					DESCONTO = TOTAL * (perc/100);
					
					if(desconto.length == 0) DESCONTO = 0;

					$('#desconto').val(DESCONTO.toFixed(2).replace('.', ','))
					atualizaTotal()

				}
				swal.close()
				$('#codBarras').focus()

			});
		}else{
			swal("Alerta", "Adicione produtos a venda", "warning")
		}
	}

	function setaAcresicmo(){
		if(TOTAL == 0){
			swal("Erro", "Total da venda é igual a zero", "warning")
		}else{
			swal({
				title: 'Valor acrescimo?',
				text: 'Ultiliza ponto(.) ao invés de virgula, valor %',
				content: "input",
				button: {
					text: "Ok",
					closeModal: false,
					type: 'error'
				}
			}).then(v => {
				if(v) {

					let acrescimo = v;
					if(acrescimo > 0){
						DESCONTO = 0;
						$('#desconto').html(DESCONTO.toFixed(2).replace('.', ','))
					}

					let total = TOTAL;
					let VALORACRESCIMO = 0;
					let perc = acrescimo;
					VALORACRESCIMO = total * (perc/100);

					if(acrescimo.length == 0) VALORACRESCIMO = 0;
					ACR = parseFloat(VALORACRESCIMO)
					$('#acrescimo').val((VALORACRESCIMO).toFixed(2))

					atualizaTotal();

				}
				swal.close()

			});
		}
	}

	function novoCliente(){
		$('#modal-cliente').modal('show')
	}

	function novaTransportadora(){
		$('#modal-transportadora').modal('show')
	}

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

	function limparCamposCliente(){
		$('#razao_social2').val('')
		$('#nome_fantasia2').val('')

		$('#rua').val('')
		$('#numero2').val('')
		$('#bairro').val('')
		$('#cep').val('')
		$('#kt_select2_4').val('1').change();
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

	function findNomeCidade(nomeCidade, call) {

		$.get(path + 'cidades/findNome/' + nomeCidade)
		.done((success) => {
			call(success)
		})
		.fail((err) => {
			call(err)
		})
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

	function salvarCliente(){
		let js = {
			razao_social: $('#razao_social2').val(),
			nome_fantasia: $('#nome_fantasia2').val() ? $('#nome_fantasia2').val() : '',
			rua: $('#rua').val() ? $('#rua').val() : '',
			cpf_cnpj: $('#cpf_cnpj').val() ? $('#cpf_cnpj').val() : '',
			ie_rg: $('#ie_rg').val() ? $('#ie_rg').val() : '',
			bairro: $('#bairro').val() ? $('#bairro').val() : '',
			cep: $('#cep').val() ? $('#cep').val() : '',
			consumidor_final: $('#consumidor_final').val() ? $('#consumidor_final').val() : '',
			contribuinte: $('#contribuinte').val() ? $('#contribuinte').val() : '',
			limite_venda: $('#limite_venda').val() ? $('#limite_venda').val() : '',
			cidade_id: $('#kt_select2_4').val() ? $('#kt_select2_4').val() : NULL,
			telefone: $('#telefone').val() ? $('#telefone').val() : '',
			celular: $('#celular').val() ? $('#celular').val() : '',
		}

		if(js.razao_social == ''){
			swal("Erro", "Informe a razão social", "warning")
		}else{
			swal({
				title: "Cuidado",
				text: "Ao salvar o cliente com os dados incompletos não será possível emitir NFe até que edite o seu cadstro?",
				icon: "warning",
				buttons: ["Cancelar", 'Salvar'],
				dangerMode: true,
			})
			.then((v) => {
				if (v) {
					let token = $('#_token').val();
					$.post(path + 'clientes/quickSave',
					{
						_token: token,
						data: js
					})
					.done((res) =>{
						CLIENTE = res;
						console.log(res)
						$('#kt_select2_3').append('<option value="'+res.id+'">'+ 
							res.razao_social+'</option>').change();
						$('#kt_select2_3').val(res.id).change();
						swal("Sucesso", "Cliente adicionado!!", 'success')
						.then(() => {
							$('#modal-cliente').modal('hide')
						})
					})
					.fail((err) => {
						console.log(err)
					})
				}
			})
		}

		console.log(js)
	}

	$('#pessoaFisica3').click(function () {
		$('#lbl_cpf_cnpj3').html('CPF');
		$('#lbl_ie_rg3').html('RG');
		$('#cpf_cnpj3').mask('000.000.000-00', { reverse: true });
		$('#btn-consulta-cadastro3').css('display', 'none')

	})

	$('#pessoaJuridica3').click(function () {
		$('#lbl_cpf_cnpj3').html('CNPJ');
		$('#lbl_ie_rg3').html('IE');
		$('#cpf_cnpj3').mask('00.000.000/0000-00', { reverse: true });
		$('#btn-consulta-cadastro3').css('display', 'block');
	});

	function consultaCadastro3() {
		let cnpj = $('#cpf_cnpj3').val();
		let uf = $('#sigla_uf3').val();
		cnpj = cnpj.replace('.', '');
		cnpj = cnpj.replace('.', '');
		cnpj = cnpj.replace('-', '');
		cnpj = cnpj.replace('/', '');

		if (cnpj.length == 14 && uf.length != '--') {
			$('#btn-consulta-cadastro3').addClass('spinner')

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
					$('#btn-consulta-cadastro3').removeClass('spinner')

					console.log(e)
					if (e.infCons.infCad) {
						let info = e.infCons.infCad;
						console.log(info)

						$('#razao_social3').val(info.xNome)

						$('#logradouro3').val(info.ender.xLgr + ", " + info.ender.nro + " - " + info.ender.xBairro)

						findNomeCidade(info.ender.xMun, (res) => {
							console.log(res)
							let jsCidade = JSON.parse(res);
							console.log(jsCidade)
							if (jsCidade) {
								console.log(jsCidade.id + " - " + jsCidade.nome)
								$('#kt_select2_10').val(jsCidade.id).change();
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
							$('#razao_social3').val(data.nome)

							$('#logradouro3').val(data.logradouro + ", " + data.numero + " - " + data.bairro)

							findNomeCidade(data.municipio, (res) => {
								let jsCidade = JSON.parse(res);
								console.log(jsCidade)
								if (jsCidade) {
									console.log(jsCidade.id + " - " + jsCidade.nome)
									$('#kt_select2_10').val(jsCidade.id).change();
								}
							})
						}
					})
					$('#btn-consulta-cadastro3').removeClass('spinner')
				}
			});
		}else{
			swal("Alerta", "Informe corretamente o CNPJ e UF", "warning")
		}
	}

	function salvarTransportadora(){
		let js = {
			razao_social: $('#razao_social3').val(),
			logradouro: $('#logradouro3').val(),
			cpf_cnpj: $('#cpf_cnpj3').val(),
			cidade_id: $('#kt_select2_10').val(),
			telefone: $('#telefone3').val() ? $('#telefone3').val() : '',
			email: $('#email3').val() ? $('#email3').val() : '',
		}

		if(js.razao_social == ''){
			swal("Erro", "Informe a razão social", "warning")
		}else if(js.logradouro == ''){
			swal("Erro", "Informe o logradouro", "warning")
		}else if(js.cpf_cnpj == ''){
			swal("Erro", "Informe o CPF/CNPJ", "warning")
		}

		else{
			let token = $('#_token').val();
			$.post(path + 'transportadoras/quickSave',
			{
				_token: token,
				data: js
			})
			.done((res) =>{
				CLIENTE = res;
				console.log(res)
				$('#kt_select2_2').append('<option value="'+res.id+'">'+ 
					res.razao_social+'</option>').change();
				$('#kt_select2_2').val(res.id).change();
				swal("Sucesso", "Transportadora adicionada!!", 'success')
				.then(() => {
					$('#modal-transportadora').modal('hide')
				})
			})
			.fail((err) => {
				console.log(err)
			})

		}

		console.log(js)
	}


