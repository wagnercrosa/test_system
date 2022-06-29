<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plano;
use App\Models\Empresa;
use Dompdf\Dompdf;
use NFePHP\Common\Certificate;

class RelatorioSuperController extends Controller
{
	public function __construct(){
		$this->middleware(function ($request, $next) {
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

		$planos = Plano::all();
		return view('relatorios_super/index')
		->with('planos', $planos)
		->with('title', 'Relatórios');
	}

	public function empresas(Request $request){
		$nome = $request->nome;
		$status = $request->status;
		$plano = $request->plano;

		$empresas = Empresa::
		select('empresas.*');

		if($nome != ''){
			$empresas->where('nome', 'LIKE', "%$nome%");
		}

		if($plano != 'null'){
			$empresas->join('plano_empresas', 'plano_empresas.empresa_id', '=', 
				'empresas.id');
			$empresas->where('plano_empresas.plano_id', $plano);
		}

		$empresas = $empresas->get();

		if($status != 'TODOS'){
			$temp = [];
			foreach($empresas as $e){
				if($e->status() == $request->status){
					array_push($temp, $e);
				}
				if($request->status == 2){
					if(!$e->planoEmpresa){
						array_push($temp, $e);	
					}
				}
			}
			$empresas = $temp;
		}

		$p = view('relatorios_super/relatorio_empresas')
		->with('nome', $nome)
		->with('plano', $plano)
		->with('empresas', $empresas)
		->with('status', $status);

		// return $p;

		$domPdf = new Dompdf(["enable_remote" => true]);
		$domPdf->loadHtml($p);

		$pdf = ob_get_clean();

		$domPdf->setPaper("A4", "landscape");
		$domPdf->render();
		$domPdf->stream("relatorio_empresas.pdf");
	}

	public function certificados(Request $request){
		$data_inicial = $request->data_inicial;
		$data_final = $request->data_final;
		$status = $request->status;

		$dataHoje = date('Y-m-d');
		$empresas = Empresa::all();

		$temp = [];

		$dtInicial = $this->parseDate($data_inicial);
		$dtFinal = $this->parseDate($data_final);
		foreach($empresas as $e){
			if($e->certificado){
				$infoCertificado = Certificate::readPfx($e->certificado->arquivo, $e->certificado->senha);
				$publicKey = $infoCertificado->publicKey;

				$e->vencimento = $publicKey->validTo->format('Y-m-d');
				$e->vencido = strtotime($dataHoje) > strtotime($e->vencimento);

				if($data_inicial && $data_final){
					if((strtotime($e->vencimento) > strtotime($dtInicial)) && (strtotime($e->vencimento) < strtotime($dtFinal))){
						array_push($temp, $e);
					}
				}
				else if($status != 'TODOS'){
					if($status == 1 && $e->vencido){
						array_push($temp, $e);
					}elseif($status == 2 && !$e->vencido){
						array_push($temp, $e);
					}
				}else{
					array_push($temp, $e);
				}

				usort($temp, function($a, $b){
					return strtotime($a->vencimento) > strtotime($b->vencimento) ? 1 : 0;
				});
			}	
		}

		$p = view('relatorios_super/relatorio_certificados')
		->with('data_inicial', $data_inicial)
		->with('data_final', $data_final)
		->with('empresas', $temp)
		->with('status', $status);

		// return $p;

		$domPdf = new Dompdf(["enable_remote" => true]);
		$domPdf->loadHtml($p);

		$pdf = ob_get_clean();

		$domPdf->setPaper("A4", "landscape");
		$domPdf->render();
		$domPdf->stream("relatorio_certificados.pdf");

	}

	private static function parseDate($date, $plusDay = false){
		if($plusDay == false)
			return date('Y-m-d', strtotime(str_replace("/", "-", $date)));
		else
			return date('Y-m-d', strtotime("+1 day",strtotime(str_replace("/", "-", $date))));
	}
}
