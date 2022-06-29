<html>

<head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
	integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

	<style type="text/css">

		@page {
			margin: 0cm 0cm;
		}

		/** Define now the real margins of every page in the PDF **/
		body {
			margin-top: 2cm;
			margin-left: 1cm;
			margin-right: 1cm;
			margin-bottom: 2cm;
		}

		/** Define the header rules **/
		header {
			position: fixed;
			margin-top: 25px;
			margin-left: 40px;
			margin-right: 40px;
			margin-bottom: 25px;
			height: 20px;
		}
		.banner {
			text-align: center;
			display: flex;
			align-items: flex-start;
		}

		.logoBanner img {
			float: left;
			max-width: 70px;
			margin-top: 0;
		}

		.banner h1 {
			position: absolute;
			margin-top: 0;
		}

		.banner hr {
			margin-top: 29px;
			margin-left: 120px;
		}

		.date {
			float: right;
		}

		.provider {
			text-align: left;
			margin-top: 5px;
			margin-bottom: 10px;
		}


		.client {
			margin-bottom: 0.6rem;
		}

		footer {
			position: fixed;
			bottom: 0.5cm;
			left: 0cm;
			right: 0cm;
			height: 1.5cm;
		}

		img {
			max-width: 100px;
			height: auto;
		}


		table {
			font-size: 0.8rem;
			margin: 0;
		}

		table thead {
			border-bottom: 1px solid rgb(206, 206, 206);
			border-top: 1px solid rgb(206, 206, 206);
		}

		.caption {
			/* Make the caption a block so it occupies its own line. */
			display: block;
		}
	</style>
</head>
<header>
	<div class="headReport" style="display:flex;justify-content:  padding-top:1rem">

		@php $config = App\Models\ConfigNota::configStatic(); @endphp
		@if($config->logo != "")
		<img src="{{'data:image/png;base64,' . base64_encode(file_get_contents(@public_path('logos/').$config->logo))}}" alt="Logo" class="mb-2">
		@else
		<img src="{{'data:image/png;base64,' . base64_encode(file_get_contents(@public_path('imgs/akila.png')))}}" alt="Logo" class="mb-2">
		@endif

		<h4 style="text-align:center; margin-top: 0px">Relatório de Contas a Receber</h4>

		<div class="row">
			<div class="col-12" style="margin-top:0.4rem">
				<small class="float-right" style="color:grey;">Emissão:
				{{ date('d/m/Y - H:i') }}</small><br>
			</div>
		</div>
		@if($data_inicial && $data_final)
		<div class="row">
			<div class="col-12" style="margin-top:2.4rem">
				Periodo: {{$data_inicial}} - {{$data_final}}
			</div>
		</div>
		@endif
	</div>
</header>
<body>
	<br>
	<table class="table-sm table-borderless"
	style="border-bottom: 1px solid rgb(206, 206, 206); margin-bottom:10px;  width: 100%;">
	<thead>
		<tr>
			<th width="10%" class="text-left">Referência</th>
			<th width="25%" class="text-left">Cliente</th>
			<th width="15%" class="text-left">Data de cadastro</th>
			<th width="15%" class="text-left">Data de vencimento</th>
			<th width="10%" class="text-left">Estado</th>
			<th width="10%" class="text-left">Valor</th>
			<th width="15%" class="text-left">Tipo de pag.</th>
		</tr>
	</thead>
	<tbody>
		@php 
		$dTemp = null;
		$somaPago = $somaLinhaPago = 0; 
		$somaPendente = $somaLinhaPendente = 0; 
		@endphp

		@foreach($contas as $key => $c)

		@if($dTemp != $c->data_vencimento)
		<tr><td colspan="7"></td></tr>
		<tr style="font-size:15px; background: #D7D7D7;">
			<td colspan="7">Vencimento: {{ \Carbon\Carbon::parse($c->data_vencimento)->format('d/m/Y') }}</td>
		</tr>
		@endif

		<tr style="font-size:12px;">
			<td class="text-left">{{ $c->referencia }}</td>
			<td class="text-left">{{ $c->cliente ? $c->cliente->razao_social : 'Não Identificado' }}</td>
			<td class="text-left">{{ \Carbon\Carbon::parse($c->created_at)->format('d/m/Y') }}</td>
			<td class="text-left">{{ \Carbon\Carbon::parse($c->data_vencimento)->format('d/m/Y') }}</td>
			<td class="text-left">
				@if($c->status)
				<span class="text-success">Pago</span>
				@else
				<span class="text-danger">Pendente</span>
				@endif
			</td>
			<td class="text-left">{{ number_format($c->valor_integral, 2, ',', '.') }}</td>
			<td class="text-left">{{ $c->tipo_pagamento != '' ? $c->tipo_pagamento : '-' }}</td>
		</tr>

		@php 
		if($c->status){
			$somaPago += $c->valor_integral;
			$somaLinhaPago += $c->valor_integral;
		}else{
			$somaPendente += $c->valor_integral;
			$somaLinhaPendente += $c->valor_integral;
		}
		@endphp

		@isset($contas[$key+1])
		@if($contas[$key+1]->data_vencimento != $c->data_vencimento)
		<tr style="font-size:14px; background: #e8f0fe;">
			<td colspan="3">
				Contas Pagas: <strong>R$ {{number_format($somaLinhaPago, 2, ',', '.')}}</strong>
			</td>
			<td colspan="4">
				Contas Pendentes: <strong>R$ {{number_format($somaLinhaPendente, 2, ',', '.')}}</strong>
			</td>
		</tr>
		@php
		$somaLinhaPago = 0; 
		$somaLinhaPendente = 0;
		@endphp
		@endif
		@else

		<tr style="font-size:14px; background: #e8f0fe;">
			<td colspan="3">
				Contas Pagas: <strong>R$ {{number_format($somaLinhaPago, 2, ',', '.')}}</strong>
			</td>
			<td colspan="4">
				Contas Pendentes: <strong>R$ {{number_format($somaLinhaPendente, 2, ',', '.')}}</strong>
			</td>
		</tr>
		@endif

		@php
		$dTemp = $c->data_vencimento;
		@endphp

		@endforeach

	</tbody>
	<tfoot>
		<tr style="font-size:14px;">
			<td colspan="3">
				Soma Contas Pagas: <strong>R$ {{number_format($somaPago, 2, ',', '.')}}</strong>
			</td>
			<td colspan="4">
				Soma Contas Pendentes: <strong>R$ {{number_format($somaPendente, 2, ',', '.')}}</strong>
			</td>
		</tr>
	</tfoot>
</table>
</body>
<footer id="footer_imagem">
	<hr>
	<table style="width: 100%;">
		<tbody>
			<tr>
				<td class="text-left ml-3 mb-3">
					{{getenv('SITE_SUPORTE')}}
				</td>
				<td class="text-right">
					@if($config->logo != "")
					<img src="{{'data:image/png;base64,' . base64_encode(file_get_contents(@public_path('logos/').$config->logo))}}" alt="logo" class="mr-3">
					@else
					<img src="{{'data:image/png;base64,' . base64_encode(file_get_contents(@public_path('imgs/akila.png')))}}" alt="Logo" class="mr-3">
					@endif
				</td>
			</tr>
		</tbody>
	</table>
</footer>
</html>
