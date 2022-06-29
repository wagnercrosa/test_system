<?php

namespace App\Http\Controllers\Pdv;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Produto;

class ProdutoController extends Controller
{
    public function index(Request $request){
    	$produtos = Produto::
    	where('empresa_id', $request->empresa_id)
    	->get();

        foreach($produtos as $p){
            $p->estoque_atual = $p->estoqueAtual();
        }

    	return response()->json($produtos, 200);
    }
}
