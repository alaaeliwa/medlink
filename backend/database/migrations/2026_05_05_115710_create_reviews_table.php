<?php
//DONE
// database/migrations/2026_05_11_000008_create_reviews_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {

            $table->id();

            $table->foreignId('citizen_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('pharmacy_id')
                ->constrained('pharmacies')
                ->onDelete('cascade');

            $table->decimal('rating', 2, 1);

            $table->text('review_text')->nullable();

            $table->timestamps();

            $table->unique([
                'citizen_id',
                'pharmacy_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};