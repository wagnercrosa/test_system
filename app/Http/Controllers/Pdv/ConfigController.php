<?php

namespace App\Http\Controllers\Pdv;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConfigNota;
use App\Models\Tributacao;

class ConfigController extends Controller
{
	public function index(Request $request){
		$config = ConfigNota::
		where('empresa_id', $request->empresa_id)
		->first();

		$tributacao = Tributacao::
		where('empresa_id', $request->empresa_id)
		->first();
		$objeto = [];

		if($config != null && $tributacao != null){
			$objeto = [
				'numeroSerieNfe' => $config->numero_serie_nfe,
				'ultimoNumeroNfe' => $config->ultimo_numero_nfe,
				'numeroSerieNfce' => $config->numero_serie_nfce,
				'ultimoNumeroNfce' => $config->ultimo_numero_nfce,
				'razao_social' => $config->razao_social,
				'ambiente' => $config->ambiente,
				'regime' => $tributacao->regime,
				'naturezaOperacao' => $config->natureza ? $config->natureza->natureza : '',
				'nome_fantasia' => $config->nome_fantasia,
				'cnpj' => $config->cnpj,
				'ie' => $config->ie,
				'logradouro' => $config->logradouro,
				'numero' => $config->numero,
				'bairro' => $config->bairro,
				'municipio' => $config->municipio,
				'codMun' => $config->codMun,
				'cep' => $config->cep,
				'UF' => $config->UF,
				'fone' => $config->fone,
				'complemento' => $config->complemento,
			];
		}

		return response()->json($objeto, 200);
	}
}
