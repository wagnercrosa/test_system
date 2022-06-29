<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContaPagar extends Model
{
	protected $fillable = [
		'compra_id', 'data_vencimento', 'data_pagamento', 'valor_integral', 'valor_pago', 
		'referencia', 'categoria_id', 'status', 'empresa_id', 'fornecedor_id', 'tipo_pagamento'
	];

	public function compra(){
		return $this->belongsTo(Compra::class, 'compra_id');
	}

	public function categoria(){
		return $this->belongsTo(CategoriaConta::class, 'categoria_id');
	}

	public function fornecedor(){
		return $this->belongsTo(Fornecedor::class, 'fornecedor_id');
	}

	public static function filtroData($dataInicial, $dataFinal, $status){
		$value = session('user_logged');
        $empresa_id = $value['empresa'];
		$c = ContaPagar::
		orderBy('data_vencimento', 'asc')
		->where('empresa_id', $empresa_id)
		->whereBetween('data_vencimento', [$dataInicial, 
			$dataFinal]);

		if($status == 'pago'){
			$c->where('status', true);
		} else if($status == 'pendente'){
			$c->where('status', false);
		}
		return $c->get();
	}
	public static function filtroDataFornecedor($fornecedor, $dataInicial, $dataFinal, $status){
		$value = session('user_logged');
        $empresa_id = $value['empresa'];
        $contas = [];
		$c = ContaPagar::
		orderBy('conta_pagars.data_vencimento', 'asc')
		->join('compras', 'compras.id' , '=', 'conta_pagars.compra_id')
		->join('fornecedors', 'fornecedors.id' , '=', 'compras.fornecedor_id')
		->where('fornecedors.razao_social', 'LIKE', "%$fornecedor%")
		->where('conta_pagars.empresa_id', $empresa_id)
		->whereBetween('data_vencimento', [$dataInicial, 
			$dataFinal]);

		if($status == 'pago'){
			$c->where('status', true);
		} else if($status == 'pendente'){
			$c->where('status', false);
		}
		$temp = $c->get();
		foreach($temp as $t){
			array_push($contas, $t);
		}

		$c = ContaPagar::
		orderBy('conta_pagars.data_vencimento', 'asc')
		->join('fornecedors', 'fornecedors.id' , '=', 'conta_pagars.fornecedor_id')
		->where('fornecedors.razao_social', 'LIKE', "%$fornecedor%")
		->where('conta_pagars.empresa_id', $empresa_id)
		->whereBetween('data_vencimento', [$dataInicial, 
			$dataFinal]);

		if($status == 'pago'){
			$c->where('status', true);
		} else if($status == 'pendente'){
			$c->where('status', false);
		}
		$temp = $c->get();
		foreach($temp as $t){
			array_push($contas, $t);
		}
		return $contas;
	}

	public static function filtroFornecedor($fornecedor, $status){
		$value = session('user_logged');
        $empresa_id = $value['empresa'];
        $contas = [];
		$c = ContaPagar::
		orderBy('conta_pagars.data_vencimento', 'asc')
		->join('compras', 'compras.id' , '=', 'conta_pagars.compra_id')
		->join('fornecedors', 'fornecedors.id' , '=', 'compras.fornecedor_id')
		->where('conta_pagars.empresa_id', $empresa_id)
		->where('fornecedors.razao_social', 'LIKE', "%$fornecedor%");

		if($status == 'pago'){
			$c->where('status', true);
		} else if($status == 'pendente'){
			$c->where('status', false);
		}
		
		$temp = $c->get();
		foreach($temp as $t){
			array_push($contas, $t);
		}

		$c = ContaPagar::
		orderBy('conta_pagars.data_vencimento', 'asc')
		->join('fornecedors', 'fornecedors.id' , '=', 'conta_pagars.fornecedor_id')
		->where('conta_pagars.empresa_id', $empresa_id)
		->where('fornecedors.razao_social', 'LIKE', "%$fornecedor%");

		if($status == 'pago'){
			$c->where('status', true);
		} else if($status == 'pendente'){
			$c->where('status', false);
		}
		
		$temp = $c->get();
		foreach($temp as $t){
			array_push($contas, $t);
		}

		return $contas;
	}

	public static function filtroStatus($status){
		$value = session('user_logged');
        $empresa_id = $value['empresa'];
		$c = ContaPagar::
		where('empresa_id', $empresa_id)
		->orderBy('conta_pagars.data_vencimento', 'asc');

		if($status == 'pago'){
			$c->where('status', true);
		} else if($status == 'pendente'){
			$c->where('status', false);
		}
		
		return $c->get();
	}

	public static function tiposPagamento(){
		return [
			'Dinheiro',
			'Cheque',
			'Cartão de Crédito',
			'Cartão de Débito',
			'Vale Alimentação',
			'Vale Refeição',
			'Vale Presente',
			'Vale Combustível',
			'Depósito Bancário',
			'Pix',
			'Outros'
		];
	}

}
