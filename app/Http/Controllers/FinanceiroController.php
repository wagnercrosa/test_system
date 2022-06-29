<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\RepresentanteEmpresa;
use App\Models\FinanceiroRepresentante;
use App\Models\PlanoEmpresa;
class FinanceiroController extends Controller
{
	protected $empresa_id = null;

	public function __construct(){
		$this->middleware(function ($request, $next) {
			$this->empresa_id = $request->empresa_id;
			$value = session('user_logged');
			if(!$value){
				return redirect("/login");
			}

			if(!$value['super']){
				return redirect('/graficos');
			}
			return $next($request);
		});
	}

	public function index(){
		$payments = Payment::paginate(40);
		return view('payment/list')
		->with('payments', $payments)
		->with('links', true)
		->with('title', 'Financeiro');
	}

	public function filtro(Request $request){

		$payments = Payment::select('payments.*');

		if($request->status != 'TODOS'){
			$payments->where('status', $request->status);
		}

		if($request->tipo_pagamento != 'TODOS'){
			$payments->where('forma_pagamento', $request->tipo_pagamento);
		}

		if($request->empresa){
			$payments->join('empresas', 'empresas.id' , '=', 'payments.empresa_id');
			$payments->where('empresas.nome', 'LIKE', "%$request->empresa%");
		}

		if($request->data_inicial && $request->data_final){
			$payments->whereBetween('payments.created_at', 
				[
					$this->parseDate($request->data_inicial) . " 00:00:00", 
					$this->parseDate($request->data_final) . " 23:59:00"
				]);
		}


		$payments = $payments->get();

		return view('payment/list')
		->with('payments', $payments)
		->with('status', $request->status)
		->with('dataInicial', $request->data_inicial)
		->with('dataFinal', $request->data_final)
		->with('empresa', $request->empresa)
		->with('tipo_pagamento', $request->tipo_pagamento)
		->with('title', 'Financeiro');
	}

	private function parseDate($date){
		return date('Y-m-d', strtotime(str_replace("/", "-", $date)));
	}

	public function novoPagamento(){
		$temp = PlanoEmpresa::limit(300)->get();
		$planosEmpresa = [];

		foreach($temp as $t){
			if(!$t->payment){
				array_push($planosEmpresa, $t);
			}
		}
		return view('payment/planos_sem_pagamento')
		->with('planosEmpresa', $planosEmpresa)
		->with('title', 'Financeiro');

	}

	public function pay($id){
		$plano = PlanoEmpresa::find($id);
		
		return view('payment/pay')
		->with('plano', $plano)
		->with('title', 'Financeiro');

	}

	public function payStore(Request $request){

		$plano = PlanoEmpresa::find($request->plano_id);

		$data = [
			'empresa_id' => $plano->empresa_id,
			'plano_id' => $request->plano_id,
			'valor' => (float)$request->valor,
			'transacao_id' => '',
			'status' => 'approved',
			'forma_pagamento' => $request->forma_pagamento,
			'link_boleto' => '',
			'status_detalhe' => '',
			'descricao' => '',
			'qr_code_base64' => '',
			'qr_code' => '',
		];

		$this->setPagamentoRepresentante($plano->empresa_id, (float)$request->valor, $request->forma_pagamento);

		Payment::create($data);
		session()->flash("mensagem_sucesso", "Operação realizada!");
		return redirect('/financeiro/novoPagamento');
	}

	private function setPagamentoRepresentante($empresa_id, $valor, $formaPagamento){

        $rep = RepresentanteEmpresa::
        where('empresa_id', $empresa_id)
        ->first();

        if($rep != null){

            $percComissao = $rep->representante->comissao;
            $valorComissao = $valor*($percComissao/100);

            FinanceiroRepresentante::create(
                [
                    'representante_empresa_id' => $rep->id,
                    'forma_pagamento' => $formaPagamento,
                    'valor' => $valor
                ]
            );
        }
    }

	public function detalhes($id){
		$payment = Payment::find($id);

		return view('payment/detalhes_pagamento')
		->with('payment', $payment)
		->with('title', 'Detalhes pagamento');
	}

	public function verificaPagamentos(){
		$payments = Payment::
		where('transacao_id', '!=', '')
		->limit(100)
		->get();

		if(getenv("MERCADOPAGO_AMBIENTE") == 'sandbox'){
			\MercadoPago\SDK::setAccessToken(getenv("MERCADOPAGO_ACCESS_TOKEN"));
		}else{
			\MercadoPago\SDK::setAccessToken(getenv("MERCADOPAGO_ACCESS_TOKEN_PRODUCAO"));
		}

		$temp = [];
		foreach($payments as $p){
			$payStatus = \MercadoPago\Payment::find_by_id($p->transacao_id);

			if($p->status != $payStatus->status){
				$p->status = $payStatus->status;
				$p->status_detalhe = $payStatus->status_detail;
				$p->descricao = $payStatus->description;

				$p->save();
				array_push($temp, $p);
			}
		}

		return view('payment/alteracoes')
		->with('payments', $temp)
		->with('title', 'Detalhes pagamento');
	}

	public function removerPlano($id){
		try{
			PlanoEmpresa::find($id)->delete();
			session()->flash("mensagem_sucesso", "Registro removido!");
		}catch(\Exception $e){
			session()->flash("mensagem_erro", "Erro: " . $e->getMessage());
		}
		return redirect()->back();
	}
}
