@extends('relatorios.cabecalho')
@section('content')
<div class="row">
	<div class="col s12">
		<h3 class="center-align">Relatório de Empresas</h3>

	</div>

	<table class="pure-table">
		<thead>
			<tr>

				<th width="80">DATA DE CADASTRO</th>
				<th width="150">NOME DA EMPRESA</th>
				<th width="100">NOME RESPONSÁVEL</th>
				<th width="70">TELEFONE</th>
				<th width="120">CONTADOR</th>
				<th width="70">STATUS</th>
				<th width="70">PLANO</th>
				<th width="70">VALOR</th>
			</tr>
		</thead>


		<tbody>
			@php 
			$soma = 0;
			@endphp

			@foreach($empresas as $key => $e)
			<tr>
				<td><center>{{\Carbon\Carbon::parse($e->created_at)->format('d/m/Y')}}</center></td>
				<td><center>{{$e->nome}}</center></td>
				<td><center>{{$e->usuarioFirst->nome}}</center></td>
				<td><center>{{$e->telefone}}</center></td>
				<td><center>{{$e->info_contador == '' ? '--' : $e->info_contador }}</center></td>
				<td>
					<center>
					@if($e->status() == -1)
					<span class="label label-xl label-inline label-light-info">
						MASTER
					</span>

					@elseif($e->status() && $e->tempo_expira >= 0)
					<span class="label label-xl label-inline label-light-success">
						ATIVO
					</span>
					@else

					@if(!$e->planoEmpresa)
					<span class="label label-xl label-inline label-light-danger">
						DESATIVADO
					</span>
					@else
					@if($e->planoEmpresa->expiracao == '0000-00-00')
					<span class="label label-xl label-inline label-light-success">
						ATIVO
					</span>
					@else
					<span class="label label-xl label-inline label-light-danger">
						DESATIVADO
					</span>
					@endif
					@endif
					@endif
					</center>
				</td>
				<td>
					<center>
					@if($e->planoEmpresa)
					{{$e->planoEmpresa->plano->nome}}
					@else
					--
					@endif
					</center>
				</td>
				<td>
					<center>
					@if($e->planoEmpresa)
					{{number_format($e->planoEmpresa->plano->valor, 2, ',', '.')}}
					@else
					--
					@endif
					</center>
				</td>
			</tr>

			@php
			if($e->planoEmpresa)
			$soma += $e->planoEmpresa->plano->valor;
			@endphp
			@endforeach
			
		</tbody>
	</table>
	<h4>Somatório: <strong style="color: red">R$ {{number_format($soma, 2, ',', '.')}}</strong></h4>

</div>
@endsection
