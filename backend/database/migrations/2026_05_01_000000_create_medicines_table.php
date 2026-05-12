<?php
//DONE
// database/migrations/2026_05_11_000004_create_medicines_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {

            $table->id();

            $table->foreignId('category_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('name');

            $table->string('generic_name')->nullable();

            $table->string('strength')->nullable();

            $table->decimal('price', 10, 2);

            $table->enum('form', [
                'tablet',
                'capsule',
                'liquid',
                'cream',
                'injection'
            ])->default('tablet');

            $table->string('manufacturer')->nullable();
            $table->integer('stock');

            $table->text('description')->nullable();

            $table->boolean('requires_prescription')
                ->default(false);

            $table->boolean('is_controlled')
                ->default(false);

            $table->date('expiry_date')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};