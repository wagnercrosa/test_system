<?php

namespace App\Http\Controllers\Pdv;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VendaCaixa;
use App\Models\ItemVendaCaixa;
use App\Models\Empresa;
use App\Models\Produto;

class VendaController extends Controller
{
    public function salvar(Request $request){
        try{
            $venda = json_decode($request->venda, true);

            $empresa = Empresa::find($request->empresa_id);
            $result = VendaCaixa::create([
                'cliente_id' => null,
                'usuario_id' => $venda['usuario_id'],
                'valor_total' => $venda['valor_total'],
                'NFcNumero' => 0,
                'natureza_id' => $empresa->configNota->natureza->id,
                'chave' => '',
                'path_xml' => '',
                'estado' => 'DISPONIVEL',
                'tipo_pagamento' => $venda['tipo_pagamento'],
                'forma_pagamento' => '',
                'dinheiro_recebido' => $venda['dinheiro_recebido'] ?? 0,
                'troco' => $venda['troco'] ?? 0,
                'nome' => '',
                'cpf' => '',
                'observacao' => '',
                'desconto' => $venda['desconto'] ?? 0,
                'acrescimo' => $venda['acrescimo'] ?? 0,
                'pedido_delivery_id' => 0,
                'tipo_pagamento_1' => '',
                'valor_pagamento_1' => 0,
                'tipo_pagamento_2' => '',
                'valor_pagamento_2' => 0,
                'tipo_pagamento_3' => '',
                'valor_pagamento_3' => 0,
                'empresa_id' => $empresa->id,
                'bandeira_cartao' => '',
                'cnpj_cartao' => '',
                'cAut_cartao' => '',
                'descricao_pag_outros' => '',
                'rascunho' => 0,
                'consignado' => 0
            ]);

            foreach($venda['itens'] as $i){
                $produto = Produto::find($i['produto_id']);
                $cfop = 0;

                if($empresa->configNota->natureza->sobrescreve_cfop){
                    $cfop = $empresa->configNota->natureza->CFOP_saida_estadual;
                }else{
                    $cfop = $produto->CFOP_saida_estadual;
                }
                ItemVendaCaixa::create([
                    'produto_id' => $i['produto_id'],
                    'venda_caixa_id' => $result->id,
                    'quantidade' => $i['quantidade'],
                    'valor' => $i['valor'],
                    'item_pedido_id' => null,
                    'observacao' => '',
                    'cfop' => $cfop,
                    'valor_custo' => $produto->valor_compra
                ]);
            }
            return response()->json("ok", 200);
        }catch(\Exception $e){
            return response()->json($e->getMessage(), 401);
        }
    }
}
