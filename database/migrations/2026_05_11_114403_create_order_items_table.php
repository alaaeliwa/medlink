<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {

            $table->id();

            // FK → orders.id (string)
            $table->string('order_id');
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade');

            // FK → medicines.id
            $table->foreignId('medicine_id')
                ->constrained()
                ->onDelete('cascade');

            $table->integer('quantity');

            $table->decimal('unit_price', 8, 2);

            $table->decimal('subtotal', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};