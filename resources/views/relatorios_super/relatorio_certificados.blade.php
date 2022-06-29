@extends('relatorios.cabecalho')
@section('content')

<div class="row">
	<div class="col s12">
		<h3 class="center-align">Relatório de Certificados</h3>

	</div>


	<table class="pure-table">
		<thead>
			<tr>
				<th width="150">NOME DA EMPRESA</th>
				<th width="100">NOME DO CONTATO</th>
				<th width="70">TELEFONE</th>
				<th width="120">CONTADOR</th>
				<th width="70">STATUS</th>
				<th width="70">DATA DE VENCIMENTO</th>
			</tr>
		</thead>

		<tbody>
			@foreach($empresas as $e)
			<tr>
				<td>{{$e->nome}}</td>
				<td>{{$e->usuarioFirst->nome}}</td>
				<td>{{$e->telefone}}</td>
				<td>{{$e->info_contador}}</td>
				<td>{{$e->vencido ? 'Vencido' : 'À Vencer'}}</td>
				<td>{{\Carbon\Carbon::parse($e->vencimento)->format('d/m/Y')}}</td>
			</tr>
			@endforeach
		</tbody>
	</table>
</div>
@endsection
