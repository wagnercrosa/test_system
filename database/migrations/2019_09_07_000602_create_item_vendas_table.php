<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemVendasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_vendas', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('venda_id')->unsigned();
            $table->foreign('venda_id')->references('id')->on('vendas')->onDelete('cascade');

            $table->integer('produto_id')->unsigned();
            $table->foreign('produto_id')->references('id')->on('produtos');

            $table->decimal('quantidade', 10,3);
            $table->decimal('valor', 16,7);
            $table->decimal('valor_custo', 16,7)->default(0);
            
            $table->integer('cfop')->default(0);
            // alter table item_vendas add column cfop integer default 0;

            $table->decimal('altura', 10,2);
            $table->decimal('largura', 10,2);
            $table->decimal('profundidade', 10,2);
            $table->decimal('acrescimo_perca', 10,2);
            $table->decimal('esquerda', 10,2);
            $table->decimal('direita', 10,2);
            $table->decimal('inferior', 10,2);
            $table->decimal('superior', 10,2);

            // alter table item_vendas add column altura decimal(10,2) default 0;
            // alter table item_vendas add column largura decimal(10,2) default 0;
            // alter table item_vendas add column profundidade decimal(10,2) default 0;
            // alter table item_vendas add column acrescimo_perca decimal(10,2) default 0;
            // alter table item_vendas add column esquerda decimal(10,2) default 0;
            // alter table item_vendas add column direita decimal(10,2) default 0;
            // alter table item_vendas add column inferior decimal(10,2) default 0;
            // alter table item_vendas add column superior decimal(10,2) default 0;
            // alter table item_vendas add column valor_custo decimal(16,7) default 0;
            
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
        Schema::dropIfExists('item_vendas');
    }
}
