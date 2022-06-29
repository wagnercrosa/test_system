@extends('default.layout')
@section('content')
<div class="card card-custom gutter-b">
	<div class="card-body">

		<div class="" id="kt_user_profile_aside" style="margin-left: 10px; margin-right: 10px;">
			<div class="row">

				<div class="col-sm-12 col-lg-6 col-md-6 col-xl-6 @if(getenv('ANIMACAO')) animate__animated @endif animate__backInLeft">
					<div class="accordion" id="accordionExample1">

						<div class="card card-custom gutter-b example example-compact">
							<div class="card-header">
								<div class="card-title collapsed" data-toggle="collapse" data-target="#collapseOne1a">
									<h3 class="card-title">Relatório de Empresas<i class="la la-angle-double-down"></i>
									</h3>
								</div>
							</div>

							<div id="collapseOne1a" class="collapse" data-parent="#accordionExample1">
								<div class="card-content">
									<div class="col-xl-12">
										<form method="get" action="/relatorioSuper/empresas">
											<div class="row">
												<div class="form-group col-lg-12">
													<label class="col-form-label">Nome da empresa</label>
													<div class="">
														<div class="input-group">
															<input type="text" name="nome" class="form-control" value="" />
														</div>
													</div>
												</div>

												<div class="form-group col-lg-6 col-md-6 col-sm-6">
													<label class="col-form-label">Status</label>
													<div class="">
														<select name="status" class="custom-select">
															<option @isset($status) @if($status == 'TODOS') selected @endif @endisset value="TODOS">TODOS</option>
															<option @isset($status) @if($status == 1) selected @endif @endisset value="1">ATIVO</option>
															<option @isset($status) @if($status == 2) selected @endif @endisset value="2">PENDENTE</option>
															<option @isset($status) @if($status == 0) selected @endif @endisset value="0">DESATIVADO</option>
														</select>
													</div>
												</div>

												<div class="form-group validated col-lg-6 col-md-6 col-sm-6">
													<label class="col-form-label text-left col-lg-12 col-sm-12">Plano</label>

													<select class="form-control select2" style="width: 100%" id="kt_select2_8" name="plano">
														<option value="null">Selecione o plano</option>
														@foreach($planos as $p)
														<option value="{{$p->id}}">{{$p->nome}}</option>
														@endforeach
													</select>
												</div>

												<div class="form-group validated col-lg-12 col-xl-12 mt-12 mt-lg-0">
													<button style="width: 100%" class="btn btn-light-primary px-6 font-weight-bold">Gerar Relatório</button>
												</div>

											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-12 col-lg-6 col-md-6 col-xl-6 @if(getenv('ANIMACAO')) animate__animated @endif animate__backInLeft">
					<div class="accordion" id="accordionExample2">

						<div class="card card-custom gutter-b example example-compact">
							<div class="card-header">
								<div class="card-title collapsed" data-toggle="collapse" data-target="#collapseOne2">
									<h3 class="card-title">Certificados à Vencer<i class="la la-angle-double-down"></i>
									</h3>
								</div>
							</div>

							<div id="collapseOne2" class="collapse" data-parent="#accordionExample2">
								<div class="card-content">
									<div class="col-xl-12">
										<form method="get" action="/relatorioSuper/certificados">
											<div class="row">
												<div class="form-group col-lg-6">
													<label class="col-form-label">Data Inicial</label>
													<div class="">
														<div class="input-group date">
															<input type="text" name="data_inicial" class="form-control date-input" value="" id="kt_datepicker_3" />
															<div class="input-group-append">
																<span class="input-group-text">
																	<i class="la la-calendar"></i>
																</span>
															</div>
														</div>
													</div>
												</div>
												<div class="form-group col-lg-6 col-md-6 col-sm-6">
													<label class="col-form-label">Data Final</label>
													<div class="">
														<div class="input-group date">
															<input type="text" name="data_final" class="form-control date-input" value="" id="kt_datepicker_3" />
															<div class="input-group-append">
																<span class="input-group-text">
																	<i class="la la-calendar"></i>
																</span>
															</div>
														</div>
													</div>
												</div>

												<div class="form-group col-lg-6 col-md-6 col-sm-6">
													<label class="col-form-label">Status</label>
													<div class="">
														<select name="status" class="custom-select">
															<option @isset($status) @if($status == 'TODOS') selected @endif @endisset value="TODOS">TODOS</option>
															<option @isset($status) @if($status == 1) selected @endif @endisset value="1">VENCIDOS</option>
															<option @isset($status) @if($status == 2) selected @endif @endisset value="2">Á VENCER</option>
														</select>
													</div>
												</div>

												

												<div class="form-group validated col-lg-12 col-xl-12 mt-12 mt-lg-0">
													<button style="width: 100%" class="btn btn-light-primary px-6 font-weight-bold">Gerar Relatório</button>
												</div>

											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

@section('javascript')
<script type="text/javascript">
	var SUBCATEGORIAS = [];
	$(function () {

		SUBCATEGORIAS = JSON.parse($('#subs').val())
		console.log(SUBCATEGORIAS)
	})

	$('#categoria').change(() => {
		montaSubs()
	})

	function montaSubs(){
		let categoria_id = $('#categoria').val()
		let subs = SUBCATEGORIAS.filter((x) => {
			return x.categoria_id == categoria_id
		})

		let options = ''
		subs.map((s) => {
			options += '<option value="'+s.id+'">'
			options += s.nome
			options += '</option>'
		})
		$('#sub_categoria_id').html('<option value="">--</option>')
		$('#sub_categoria_id').append(options)
	}
</script>
@endsection	

@endsection	