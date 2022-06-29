@extends('relatorios.default')
@section('content')

@if($d1 && $d2)
<p>Periodo: {{$d1}} - {{$d2}}</p>
@endif

<table class="table-sm table-borderless"
style="border-bottom: 1px solid rgb(206, 206, 206); margin-bottom:10px;  width: 100%;">
<thead>
	<tr>
		<th width="30%" class="text-left">Cliente</th>
		<th width="15%" class="text-left">Data</th>
		<th width="15%" class="text-left">Estado</th>
		<th width="30%" class="text-left">Chave</th>
		<th width="10%" class="text-left">Número</th>
	</tr>
</thead>

@foreach($data as $key => $d)
<tr class="@if($key%2 == 0) pure-table-odd @endif">
	<td>{{$d['cliente'] == '' ? 'Consumidor Final' : $d['cliente']}}</td>
	<td>{{$d['data']}}</td>
	<td>{{$d['estado']}}</td>
	<td>{{$d['chave']}}</td>
	<td>{{$d['numero']}}</td>
</tr>
@endforeach

</table>

<table style="width: 100%;">
	<tbody>
		<tr class="text-left">
			<th width="50%">Total de documentos: {{ sizeof($data) }}</th>
		</tr>
	</tbody>
</table>

@endsection
