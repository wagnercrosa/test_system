<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServicosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicos', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('empresa_id')->unsigned();
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');

            $table->string('nome', 60);
            $table->decimal('valor', 10,2);
            $table->string('unidade_cobranca', 5);
            $table->integer('tempo_servico');

            $table->integer('tempo_adicional')->default(0);
            $table->integer('tempo_tolerancia')->default(0);
            $table->decimal('valor_adicional', 10,2)->default("");

            $table->decimal('comissao', 6, 2)->default(0);
            
            $table->integer('categoria_id')->unsigned();
            $table->foreign('categoria_id')->references('id')->on('categoria_servicos');

            // alter table servicos add column tempo_adicional integer default 0;
            // alter table servicos add column tempo_tolerancia integer default 0;
            // alter table servicos add column valor_adicional decimal(10, 2) default 0;
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
        Schema::dropIfExists('servicos');
    }
}
