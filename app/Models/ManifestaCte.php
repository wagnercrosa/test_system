<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManifestaCte extends Model
{
    use HasFactory;
     protected $fillable = [
		'chave', 'nome', 'documento', 'valor', 'data_emissao', 
		'sequencia_evento', 'tipo', 'empresa_id'
	];

	public function estado(){
		if($this->tipo == 0){
			return "--";
		}else if($this->tipo == 1){
			return "Ciência";
		}else if($this->tipo == 2){
			return "Confirmada";
		}else if($this->tipo == 2){
			return "Desconhecimento";
		}else if($this->tipo == 2){
			return "Operação não realizada";
		}
	}
}
