<?php
//DONE
// database/migrations/2026_05_11_000005_create_inventory_items_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {

            $table->id();

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('medicine_id')
                ->constrained()
                ->onDelete('cascade');

            $table->integer('quantity')->default(0);

            $table->decimal('price', 8, 2);

            $table->decimal('cost_price', 8, 2)
                ->nullable();

            $table->integer('minimum_stock')
                ->default(10);

            $table->integer('maximum_stock')
                ->default(500);

            $table->enum('status', [
                'in_stock',
                'low_stock',
                'out_of_stock'
            ])->default('in_stock');

            $table->date('expiry_date')->nullable();

            $table->timestamps();

            $table->unique([
                'pharmacy_id',
                'medicine_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};