@extends('default.layout')
@section('content')
<div class=" d-flex flex-column flex-column-fluid" id="kt_content">
	<div class="card card-custom gutter-b example example-compact">
		<div class="container @if(getenv('ANIMACAO')) animate__animated @endif animate__backInLeft">
			<div class="col-lg-12">
				<br>
				<form method="post" action="{{{ isset($natureza) ? '/naturezaOperacao/update': '/naturezaOperacao/save' }}}">
					<input type="hidden" name="id" value="{{{ isset($natureza->id) ? $natureza->id : 0 }}}">
					<div class="card card-custom gutter-b example example-compact">
						<div class="card-header">
							<h3 class="card-title">{{{ isset($natureza) ? "Editar": "Cadastrar" }}} Natureza de Operação</h3>
						</div>
					</div>
					@csrf
					<div class="row">
						<div class="col-xl-12">
							<div class="kt-section kt-section--first">
								<div class="kt-section__body">
									<div class="row">
										<div class="form-group validated col-sm-10 col-lg-6">
											<label class="col-form-label">Nome</label>
											<div class="">
												<input id="natureza" type="text" class="form-control @if($errors->has('natureza')) is-invalid @endif" name="natureza" value="{{{ isset($natureza) ? $natureza->natureza : old('natureza') }}}">
												@if($errors->has('natureza'))
												<div class="invalid-feedback">
													{{ $errors->first('natureza') }}
												</div>
												@endif
											</div>
										</div>
									</div>
									<hr>

									<div class="row">
										<div class="col-lg-6 col-12">
											<div class="row">
												<h4 class="col-12">CFOP ESTADUAL</h4>

												<div class="form-group validated col-6">
													<label class="col-form-label">Saída</label>
													<div class="">
														<input id="CFOP_saida_estadual" type="text" class="form-control @if($errors->has('CFOP_saida_estadual')) is-invalid @endif" name="CFOP_saida_estadual" value="{{{ isset($natureza) ? $natureza->CFOP_saida_estadual : old('CFOP_saida_estadual') }}}">
														@if($errors->has('CFOP_saida_estadual'))
														<div class="invalid-feedback">
															Venda
														</div>
														@endif
													</div>
												</div>

												<div class="form-group validated col-6">
													<label class="col-form-label">Entrada</label>
													<div class="">
														<input id="CFOP_entrada_estadual" type="text" class="form-control @if($errors->has('CFOP_entrada_estadual')) is-invalid @endif" name="CFOP_entrada_estadual" value="{{{ isset($natureza) ? $natureza->CFOP_entrada_estadual : old('CFOP_entrada_estadual') }}}">
														@if($errors->has('CFOP_entrada_estadual'))
														<div class="invalid-feedback">
															Venda
														</div>
														@endif
													</div>
												</div>
											</div>
										</div>
										
										<div class="col-lg-6 col-12">

											<div class="row">
												<h4 class="col-12">CFOP INTERESTADUAL</h4>
												<div class="form-group validated col-6">
													<label class="col-form-label">Saída</label>
													<div class="">
														<input id="CFOP_saida_inter_estadual" type="text" class="form-control @if($errors->has('CFOP_saida_inter_estadual')) is-invalid @endif" name="CFOP_saida_inter_estadual" value="{{{ isset($natureza) ? $natureza->CFOP_saida_inter_estadual : old('CFOP_saida_inter_estadual') }}}">
														@if($errors->has('CFOP_saida_inter_estadual'))
														<div class="invalid-feedback">
															Venda
														</div>
														@endif
													</div>
												</div>

												<div class="form-group validated col-6">
													<label class="col-form-label">Entrada</label>
													<div class="">
														<input id="CFOP_entrada_inter_estadual" type="text" class="form-control @if($errors->has('CFOP_entrada_inter_estadual')) is-invalid @endif" name="CFOP_entrada_inter_estadual" value="{{{ isset($natureza) ? $natureza->CFOP_entrada_inter_estadual : old('CFOP_entrada_inter_estadual') }}}">
														@if($errors->has('CFOP_entrada_inter_estadual'))
														<div class="invalid-feedback">
															Venda
														</div>
														@endif
													</div>
												</div>
											</div>
										</div>
									</div>

									<div class="row">
										<div class="col-sm-4 col-lg-3">
											<label>Sobrescrever CFOP do produto</label>

											<div class="switch switch-outline switch-success">
												<label class="">
													<input @if(isset($natureza->sobrescreve_cfop) && $natureza->sobrescreve_cfop) checked @endisset value="true" name="sobrescreve_cfop" class="red-text" type="checkbox">
													<span class="lever"></span>
												</label>
											</div>
										</div>

										<div class="col-sm-4 col-lg-3">
											<label>Não movimentar estoque</label>

											<button type="button" class="btn btn-light-info btn-sm btn-icon col-lg-6 col-sm-6" data-toggle="popover" data-trigger="click" data-content="Se marcado a ação de venda com esta natureza de operação, será sem movimentação de estoque"><i class="la la-info"></i></button>
											<div class="switch switch-outline switch-info">
												<label class="">
													<input @if(isset($natureza->nao_movimenta_estoque) && $natureza->nao_movimenta_estoque) checked @endisset value="true" name="nao_movimenta_estoque" class="red-text" type="checkbox">
													<span class="lever"></span>
												</label>
											</div>
										</div>

										<div class="form-group validated col-sm-4 col-lg-3">
											<label class="col-form-label">Finalidade</label>
											<div class="">
												<select name="finNFe" class="custom-select">
													@foreach(App\Models\NaturezaOperacao::finalidades() as $key => $f)
													<option 
													@isset($natureza)
													@if($natureza->finNFe == $key)
													selected
													@endif
													@endisset
													value="{{$key}}">{{$f}}</option>
													@endforeach
												</select>
											</div>
										</div>
									</div>

									<hr>

								</div>
							</div>
						</div>
					</div>

					<div class="card-footer">

						<div class="row">
							<div class="col-xl-2">

							</div>
							<div class="col-lg-3 col-sm-6 col-md-4">
								<a style="width: 100%" class="btn btn-danger" href="/naturezaOperacao">
									<i class="la la-close"></i>
									<span class="">Cancelar</span>
								</a>
							</div>
							<div class="col-lg-3 col-sm-6 col-md-4">
								<button style="width: 100%" type="submit" class="btn btn-success">
									<i class="la la-check"></i>
									<span class="">Salvar</span>
								</button>
							</div>

						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
@section('javascript')
<script type="text/javascript">
	$('[data-toggle="popover"]').popover()
</script>
@endsection
@endsection