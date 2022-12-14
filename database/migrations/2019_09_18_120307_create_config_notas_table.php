<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfigNotasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('config_notas', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('empresa_id')->unsigned();
            $table->foreign('empresa_id')->references('id')->on('empresas')
            ->onDelete('cascade');

            $table->string('razao_social', 100);
            $table->string('nome_fantasia', 80);
            $table->string('cnpj', 19);
            $table->string('ie', 20);
            $table->string('logradouro', 80);
            $table->string('complemento', 100)->default('');

            $table->string('numero', 10);
            $table->string('bairro', 50);
            $table->string('fone', 20);
            $table->string('cep', 10);
            $table->string('pais', 20);
            $table->string('email', 60);
            $table->string('municipio', 30);
            $table->integer('codPais');
            $table->integer('codMun');
            $table->char('UF', 2);

            $table->string('CST_CSOSN_padrao', 3);
            $table->string('CST_COFINS_padrao', 3);
            $table->string('CST_PIS_padrao', 3);
            $table->string('CST_IPI_padrao', 3);
            $table->integer('frete_padrao');
            $table->string('tipo_pagamento_padrao', 2);
            $table->integer('nat_op_padrao');
            $table->integer('ambiente');
            $table->string('cUF', 2);
            $table->string('numero_serie_nfe', 3);
            $table->string('numero_serie_nfce', 3);
            $table->string('numero_serie_cte', 3);
            $table->string('numero_serie_mdfe', 3);

            $table->integer('ultimo_numero_nfe');
            $table->integer('ultimo_numero_nfce');
            $table->integer('ultimo_numero_cte');
            $table->integer('ultimo_numero_mdfe');

            $table->string('csc', 60);
            $table->string('csc_id', 10);
            $table->boolean('certificado_a3')->default(0);

            $table->string('inscricao_municipal', 25)->default('');
            $table->string('aut_xml', 20)->default('');
            $table->string('logo', 100)->default('');
            
            $table->integer('casas_decimais')->default(2);
            $table->text('campo_obs_nfe');
            $table->string('senha_remover', 80)->default('');
            $table->decimal('percentual_lucro_padrao', 6, 2)->default(0);

            $table->string('sobrescrita_csonn_consumidor_final', 3)->deafult('');

            // alter table config_notas add column campo_obs_nfe text;
            // alter table config_notas add column senha_remover varchar(80) default '';
            // alter table config_notas add column percentual_lucro_padrao decimal(6,2) default 0;
            // alter table config_notas add column complemento varchar(100) default '';
            // alter table config_notas add column numero_serie_mdfe varchar(3) default '1';
            // alter table config_notas add column sobrescrita_csonn_consumidor_final varchar(3) default '';

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('config_notas');
    }
}
