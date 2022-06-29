@extends('default.layout')
@section('content')
<div class="row" id="anime" style="display: none">
	<div class="col s8 offset-s2">
		<lottie-player src="/anime/success.json" background="transparent" speed="0.8" style="width: 100%; height: 300px;" autoplay>
		</lottie-player>
	</div>
</div>
<div class="row @if(getenv('ANIMACAO')) animate__animated @endif animate__bounce" id="content" style="display: block">
	<div class="d-flex flex-column flex-column-fluid" id="kt_content">
		<input type="hidden" id="produtos" value="{{json_encode($produtos)}}" name="">
		<div class="card card-custom gutter-b example example-compact">
			<div class="container">
				<div class="col-lg-12">
					<br>

					<input type="hidden" name="id" value="{{{ isset($cliente) ? $cliente->id : 0 }}}">
					<div class="card card-custom gutter-b example example-compact">
						<div class="card-header">

							<h3 class="card-title">DADOS INICIAIS</h3>
						</div>

						<div class="wizard wizard-3" id="kt_wizard_v3" data-wizard-state="between" data-wizard-clickable="true">
							<!--begin: Wizard Nav-->
							<div class="wizard-nav">
								<div class="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
									<!--begin::Wizard Step 1 Nav-->
									<div class="wizard-step" data-wizard-type="step" data-wizard-state="done">
										<div class="wizard-label">
											<h3 class="wizard-title">
												<span>1.</span>ITENS
											</h3>
											<div class="wizard-bar"></div>
										</div>
									</div>
									<!--end::Wizard Step 1 Nav-->
									<div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
										<div class="wizard-label">
											<h3 class="wizard-title">
												<span>2.</span>FRETE
											</h3>
											<div class="wizard-bar"></div>
										</div>
									</div>
									<!--end::Wizard Step 2 Nav-->
									<!--begin::Wizard Step 2 Nav-->
									<div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
										<div class="wizard-label">
											<h3 class="wizard-title">
												<span>3.</span>PAGAMENTO
											</h3>
											<div class="wizard-bar"></div>
										</div>
									</div>
									<!--end::Wizard Step 2 Nav-->
								</div>
							</div>


							<!--end: Wizard Nav-->
							<!--begin: Wizard Body-->
							<div class="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
								<div class="col-xl-12">
									<!--begin: Wizard Form-->
									<form class="form fv-plugins-bootstrap fv-plugins-framework" id="kt_form">
										<!--begin: Wizard Step 1-->
										<div class="pb-5" data-wizard-type="step-content">
											<h4 class="mb-4 font-weight-bold text-dark">Selecione o Fornecedor</h4>
											<!--begin::Input-->
											<div class="input-group">

												<select class="form-control select2 fornecedor" id="kt_select2_1" name="fornecedor">
													<option value="--">Selecione o fornecedor</option>
													@foreach($fornecedores as $f)
													<option value="{{$f->id}}">{{$f->razao_social}} ({{$f->cpf_cnpj}})</option>
													@endforeach
												</select>
												<button type="button" onclick="novoFornecedor()" class="btn btn-warning btn-sm">
													<i class="la la-plus-circle icon-add"></i>
												</button>
											</div>


											<div class="row" id="fornecedor" style="display: none">

												<br>
												<div class="row col-12">

													<div class="col-sm-6 col-lg-6">
														<h5>Razão Social: <strong id="razao_social" class="text-danger">--</strong></h5>
														<h5>Nome Fantasia: <strong id="nome_fantasia" class="text-danger">--</strong></h5>
														<h5>Logradouro: <strong id="logradouro" class="text-danger">--</strong></h5>
														<h5>Numero: <strong id="numero" class="text-danger">--</strong></h5>

													</div>
													<div class="col-sm-6 col-lg-6">
														<h5>CPF/CNPJ: <strong id="cnpj" class="text-danger">--</strong></h5>
														<h5>RG/IE: <strong id="ie" class="text-danger">--</strong></h5>
														<h5>Fone: <strong id="fone" class="text-danger">--</strong></h5>
														<h5>Cidade: <strong id="cidade" class="text-danger">--</strong></h5>

													</div>
												</div>

											</div>

											<hr>
											<br>
											<h4 class="mb-10 font-weight-bold text-dark">Produtos da Compra</h4>
											<div class="row">
												<div class="form-group validated col-sm-4 col-lg-4">
													<label class="col-form-label">Produto</label>
													<select class="form-control select2 produto" id="kt_select2_2" name="produto">
														<option value="null">--</option>
														@foreach($produtos as $p)
														<option value="{{$p->id}} - {{$p->nome}}">{{$p->id}} - {{$p->nome}}
															@if($p->referencia != "")
															| REF: {{$p->referencia}}
															@endif
														</option>
														@endforeach
													</select>
												</div>
												<div class="form-group validated col-sm-2 col-lg-2">
													<label class="col-form-label">Quantidade</label>
													<div class="">
														<input type="text" class="form-control" name="quantidade" id="quantidade">

													</div>
												</div>

												<div class="form-group validated col-sm-2 col-lg-2">
													<label class="col-form-label">Valor Unitário</label>
													<div class="">
														<input type="text" class="form-control" name="valor" value="0" id="valor">

													</div>
												</div>

												<div class="form-group validated col-sm-2 col-lg-2">
													<label class="col-form-label">SubTotal</label>
													<div class="">
														<input type="text" class="form-control" id="subtotal" value="0" disabled>

													</div>
												</div>

												<div class="form-group validated col-sm-2 col-lg-2">
													<br>
													<button type="button" style="margin-top: 13px;" id="addProd" class="btn btn-success font-weight-bold text-uppercase px-9 py-4">
														Adicionar
													</button>
												</div>
											</div>

											<div id="kt_datatable" class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded prod">
												<table class="datatable-table" style="max-width: 100%;overflow: scroll">
													<thead class="datatable-head">
														<tr class="datatable-row" style="left: 0px;">
															<th data-field="OrderID" class="datatable-cell datatable-cell-sort"><span style="width: 60px;">#</span></th>
															<th data-field="Country" class="datatable-cell datatable-cell-sort"><span style="width: 60px;">Código</span></th>
															<th data-field="Country" class="datatable-cell datatable-cell-sort"><span style="width: 120px;">Nome</span></th>
															<th data-field="ShipDate" class="datatable-cell datatable-cell-sort"><span style="width: 80px;">Valor</span></th>
															<th data-field="CompanyName" class="datatable-cell datatable-cell-sort"><span style="width: 100px;">Quantidade</span></th>
															<th data-field="Status" class="datatable-cell datatable-cell-sort"><span style="width: 80px;">Subtotal</span></th>
															<th data-field="Actions" data-autohide-disabled="false" class="datatable-cell datatable-cell-sort"><span style="width: 80px;">Ações</span></th>
														</tr>
													</thead>

													<tbody class="datatable-body">
													</tbody>

												</table>

											</div>
										</div>
										<!--end: Wizard Step 1-->


										<!--begin: Wizard Step 2-->
										<div class="pb-5" data-wizard-type="step-content" >
											<div class="col-sm-12 col-lg-12 col-md-12 col-xl-12">
												<div class="row">
													<div class="col-xl-12">
														<h3>Transportadora</h3>

														<div class="row align-items-center">
															<div class="form-group validated col-sm-6 col-lg-5 col-12">
																<select class="form-control select2" style="width: 100%" id="kt_select2_3" name="transportadora">
																	<option value="null">Selecione a transportadora (opcional)</option>
																	@foreach($transportadoras as $t)
																	<option value="{{$t->id}}">{{$t->id}} - {{$t->razao_social}}</option>
																	@endforeach
																</select>
															</div>
														</div>
													</div>
												</div>
												<hr>

												<div class="row">
													<div class="col-xl-12">
														<h3>Frete</h3>

														<div class="row align-items-center">
															<div class="form-group validated col-sm-4 col-lg-4 col-8">
																<label class="col-form-label" id="">Tipo</label>
																<select class="custom-select form-control" id="frete" name="frete">
																	<option @if($config->frete_padrao == '0') selected @endif value="0">0 - Emitente</option>
																	<option @if($config->frete_padrao == '1') selected @endif  value="1">1 - Destinatário</option>
																	<option @if($config->frete_padrao == '2') selected @endif  value="2">2 - Terceiros</option>
																	<option @if($config->frete_padrao == '9') selected @endif  value="9">9 - Sem Frete</option>
																</select>
															</div>

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Placa Veiculo</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="placa" class="form-control" value="" id="placa"/>
																	</div>
																</div>
															</div>

															<div class="form-group validated col-sm-2 col-lg-2 col-6">
																<label class="col-form-label" id="">UF</label>
																<select class="custom-select form-control" id="uf_placa" name="uf_placa">
																	<option value="--">--</option>
																	<option value="AC">AC</option>
																	<option value="AL">AL</option>
																	<option value="AM">AM</option>
																	<option value="AP">AP</option>
																	<option value="BA">BA</option>
																	<option value="CE">CE</option>
																	<option value="DF">DF</option>
																	<option value="ES">ES</option>
																	<option value="GO">GO</option>
																	<option value="MA">MA</option>
																	<option value="MG">MG</option>
																	<option value="MS">MS</option>
																	<option value="MT">MT</option>
																	<option value="PA">PA</option>
																	<option value="PB">PB</option>
																	<option value="PE">PE</option>
																	<option value="PI">PI</option>
																	<option value="PR">PR</option>
																	<option value="RJ">RJ</option>
																	<option value="RN">RN</option>
																	<option value="RS">RS</option>
																	<option value="RO">RO</option>
																	<option value="RR">RR</option>
																	<option value="SC">SC</option>
																	<option value="SE">SE</option>
																	<option value="SP">SP</option>
																	<option value="TO">TO</option>
																</select>
															</div>

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Valor</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="valor_frete" class="form-control" value="" id="valor_frete"/>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<hr>
												<div class="row">
													<div class="col-xl-12">
														<h3>Volume</h3>

														<div class="row align-items-center">

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Espécie</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="especie" class="form-control" value="" id="especie"/>
																	</div>
																</div>
															</div>

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Num. de Volumes</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="numeracaoVol" class="form-control" value="" id="numeracaoVol"/>
																	</div>
																</div>
															</div>

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Qtd. de Volumes</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="qtdVol" class="form-control" value="" id="qtdVol"/>
																	</div>
																</div>
															</div>

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Peso Liquido</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="pesoL" class="form-control" value="" id="pesoL"/>
																	</div>
																</div>
															</div>

															<div class="form-group col-lg-2 col-md-4 col-sm-6 col-6">
																<label class="col-form-label">Peso Bruto</label>
																<div class="">
																	<div class="input-group">
																		<input type="text" name="pesoB" class="form-control" value="" id="pesoB"/>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>

											</div>
										</div>
										<div class="pb-5" data-wizard-type="step-content" data-wizard-state="current">
											<h4 class="mb-10 font-weight-bold text-dark">Selecione a forma de pagamento</h4>
											<!--begin::Input-->
											<div class="row">
												<div class="form-group validated col-sm-3 col-lg-3">
													<label class="col-form-label">Forma de pagamento</label>
													<select class="custom-select form-control" id="formaPagamento">
														<option value="--">Selecione a forma de pagamento</option>
														<option value="a_vista">A vista</option>
														<option value="30_dias">30 Dias</option>
														<option value="personalizado">Personalizado</option>
													</select>
												</div>
												<div class="form-group validated col-sm-2 col-lg-2">
													<label class="col-form-label">Qtd de parcelas</label>
													<div class="">
														<input type="text" class="form-control" name="bairro" id="qtdParcelas">

													</div>
												</div>

												<div class="form-group validated col-sm-2 col-lg-2">
													<label class="col-form-label">Data de Vencimento</label>
													<div class="">
														<div class="input-group date">
															<input type="text" class="form-control data-input" id="kt_datepicker_3">
															<div class="input-group-append">
																<span class="input-group-text">
																	<i class="la la-calendar"></i>
																</span>
															</div>
														</div>
													</div>
												</div>

												<div class="form-group validated col-sm-2 col-lg-2">
													<label class="col-form-label">Valor da parcela</label>
													<div class="">
														<input type="text" class="form-control" id="valor_parcela">

													</div>
												</div>

												<div class="form-group validated col-sm-2 col-lg-2">
													<br>
													<a style="margin-top: 13px;" id="add-pag" class="btn btn-primary font-weight-bold text-uppercase px-9 py-4">
														Adicionar
													</a>
												</div>
											</div>

											<div class="row">
												<div class="form-group validated col-sm-12 col-lg-12">

													<div id="kt_datatable" class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded fatura">
														<table class="datatable-table" style="max-width: 100%;overflow: scroll">
															<thead class="datatable-head">
																<tr class="datatable-row" style="left: 0px;">
																	<th data-field="OrderID" class="datatable-cell datatable-cell-sort"><span style="width: 180px;">Parcela</span></th>
																	<th data-field="Country" class="datatable-cell datatable-cell-sort"><span style="width: 220px;">Data</span></th>
																	<th data-field="Country" class="datatable-cell datatable-cell-sort"><span style="width: 260px;">Valor</span></th>

																	<th data-field="Country" class="datatable-cell datatable-cell-sort"><span style="width: 220px;">Valor</span></th>
																</tr>
															</thead>

															<tbody class="datatable-body">
															</tbody>

														</table>

													</div>
												</div>
											</div>


										</div>
										<!--end: Wizard Step 2-->

										<!--begin: Wizard Actions-->
										<div class="d-flex justify-content-between border-top mt-5 pt-10">
										<!-- <div class="mr-2">
											<button type="button" class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4" data-wizard-type="action-prev">Voltar para Itens</button>
										</div> -->
										<div>
											<!-- <button type="button" class="btn btn-success font-weight-bold text-uppercase px-9 py-4" data-wizard-type="action-submit">Salvar Compra</button> -->
											<!-- <button type="button" class="btn btn-primary font-weight-bold text-uppercase px-9 py-4" data-wizard-type="action-next">Ir para pagamento</button> -->
										</div>
									</div>
									<!--end: Wizard Actions-->

								</form>
								<!--end: Wizard Form-->
							</div>
						</div>
						<!--end: Wizard Body-->
					</div>

					<div class="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
						<div class="col-xl-12">
							<h5>Valor Total R$ <strong id="total" class="cyan-text">0,00</strong></h5>
							<div class="row">

								<div class="form-group validated col-sm-2 col-lg-2">
									<label class="col-form-label">Desconto</label>
									<div class="">
										<input type="text" class="form-control" id="desconto">

									</div>
								</div>

								<div class="form-group validated col-sm-8 col-lg-8">
									<label class="col-form-label">Observação</label>
									<div class="">
										<input type="text" class="form-control" id="obs">

									</div>
								</div>

								<div class="form-group validated col-sm-4 col-lg-2">
									<br>
									<button disabled type="button" class="btn btn-success font-weight-bold text-uppercase px-9 py-4" id="salvar-venda" style="width: 100%; margin-top: 13px;" href="#" onclick="salvarCompra()">Finalizar</button>
								</div>

							</div>
						</div>
					</div>

				</div>

			</div>
		</div>
		<input type="hidden" id="_token" value="{{ csrf_token() }}">
	</div>
</div>
</div>

<div class="modal fade" id="modal-fornecedor" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
	<div class="modal-dialog modal-xl" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Novo Fornecedor</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					x
				</button>
			</div>
			<div class="modal-body">

				<div class="row">
					<div class="col-xl-12">

						<div class="row">
							<div class="form-group col-sm-12 col-lg-12">
								<label>Pessoa:</label>
								<div class="radio-inline">
									<label class="radio radio-success">
										<input name="group1" type="radio" id="pessoaFisica"/>
										<span></span>
										FISICA
									</label>
									<label class="radio radio-success">
										<input name="group1" type="radio" id="pessoaJuridica"/>
										<span></span>
										JURIDICA
									</label>

								</div>

							</div>
						</div>
						<div class="row">

							<div class="form-group validated col-sm-3 col-lg-4">
								<label class="col-form-label" id="lbl_cpf_cnpj">CPF</label>
								<div class="">
									<input type="text" id="cpf_cnpj" class="form-control @if($errors->has('cpf_cnpj')) is-invalid @endif" name="cpf_cnpj">
									
								</div>
							</div>
							<div class="form-group validated col-lg-2 col-md-2 col-sm-6">
								<label class="col-form-label text-left col-lg-12 col-sm-12">UF</label>

								<select class="custom-select form-control" id="sigla_uf" name="sigla_uf">
									@foreach(App\Models\Cidade::estados() as $c)
									<option value="{{$c}}">{{$c}}
									</option>
									@endforeach
								</select>

							</div>
							<div class="form-group validated col-lg-2 col-md-2 col-sm-6">
								<br><br>
								<a type="button" id="btn-consulta-cadastro" onclick="consultaCadastro()" class="btn btn-success spinner-white spinner-right">
									<span>
										<i class="fa fa-search"></i>
									</span>
								</a>
							</div>

						</div>

						<div class="row">
							<div class="form-group validated col-sm-6">
								<label class="col-form-label">Razao Social/Nome</label>
								<div class="">
									<input id="razao_social2" type="text" class="form-control @if($errors->has('razao_social')) is-invalid @endif">
									
								</div>
							</div>

							<div class="form-group validated col-sm-6">
								<label class="col-form-label">Nome Fantasia</label>
								<div class="">
									<input id="nome_fantasia2" type="text" class="form-control @if($errors->has('nome_fantasia')) is-invalid @endif">
								</div>
							</div>

							<div class="form-group validated col-sm-3 col-lg-4">
								<label class="col-form-label" id="lbl_ie_rg">RG</label>
								<div class="">
									<input type="text" id="ie_rg" class="form-control @if($errors->has('ie_rg')) is-invalid @endif">
								</div>
							</div>

							<div class="form-group validated col-lg-3 col-md-3 col-sm-10">
								<label class="col-form-label text-left col-lg-12 col-sm-12">Contribuinte</label>

								<select class="custom-select form-control" id="contribuinte">

									<option value="1">SIM</option>
									<option value="0">NAO</option>
								</select>
							</div>

						</div>
						<hr>
						<h5>Endereço</h5>
						<div class="row">
							<div class="form-group validated col-sm-8 col-lg-8">
								<label class="col-form-label">Rua</label>
								<div class="">
									<input id="rua" type="text" class="form-control @if($errors->has('rua')) is-invalid @endif">
									
								</div>
							</div>

							<div class="form-group validated col-sm-2 col-lg-2">
								<label class="col-form-label">Número</label>
								<div class="">
									<input id="numero2" type="text" class="form-control @if($errors->has('numero')) is-invalid @endif">
									
								</div>
							</div>

							<div class="form-group validated col-sm-8 col-lg-5">
								<label class="col-form-label">Bairro</label>
								<div class="">
									<input id="bairro" type="text" class="form-control @if($errors->has('bairro')) is-invalid @endif">
									
								</div>
							</div>

							<div class="form-group validated col-sm-8 col-lg-3">
								<label class="col-form-label">CEP</label>
								<div class="">
									<input id="cep" type="text" class="form-control @if($errors->has('cep')) is-invalid @endif">
									
								</div>
							</div>

							<div class="form-group validated col-sm-8 col-lg-4">
								<label class="col-form-label">Email</label>
								<div class="">
									<input id="email" type="text" class="form-control @if($errors->has('email')) is-invalid @endif">
									
								</div>
							</div>

							@php
							$cidade = App\Models\Cidade::getCidadeCod($config->codMun);
							@endphp
							<div class="form-group validated col-lg-6 col-md-6 col-sm-10">
								<label class="col-form-label text-left col-lg-4 col-sm-12">Cidade</label><br>
								<select style="width: 100%" class="form-control select2" id="kt_select2_4">
									@foreach(App\Models\Cidade::all() as $c)
									<option @if($cidade->id == $c->id) selected @endif value="{{$c->id}}">
										{{$c->nome}} ({{$c->uf}})
									</option>
									@endforeach
								</select>
								
							</div>

							<div class="form-group validated col-sm-8 col-lg-3">
								<label class="col-form-label">Telefone (Opcional)</label>
								<div class="">
									<input id="telefone" type="text" class="form-control @if($errors->has('telefone')) is-invalid @endif">
								</div>
							</div>

							<div class="form-group validated col-sm-8 col-lg-3">
								<label class="col-form-label">Celular (Opcional)</label>
								<div class="">
									<input id="celular" type="text" class="form-control @if($errors->has('celular')) is-invalid @endif">
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
			<div class="modal-footer">
				<button type="button" id="btn-frete" class="btn btn-danger font-weight-bold spinner-white spinner-right" data-dismiss="modal" aria-label="Close">Fechar</button>
				<button type="button" onclick="salvarFornecedor()" class="btn btn-success font-weight-bold spinner-white spinner-right">Salvar</button>
			</div>
		</div>
	</div>
</div>
@endsection