<?php
// database/migrations/xxxx_xx_xx_create_favorites_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {

            // Primary Key
            $table->uuid('id')->primary();

            // FK → users (citizen)
            $table->foreignId('citizen_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // medicine OR pharmacy
            $table->enum('favorite_type', [
                'medicine',
                'pharmacy'
            ]);

            // ID of medicine/pharmacy
            $table->string('favorite_id');

            // Snapshot data
            $table->json('favorite_data')
                  ->nullable();

            // created_at
            $table->timestamps();

            // Unique Index
            $table->unique([
                'citizen_id',
                'favorite_type',
                'favorite_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};