<?php
//DONE
// database/migrations/2026_05_11_000002_create_pharmacies_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharmacies', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('pharmacy_name');

            $table->string('license_number')->unique();

            $table->date('license_expiry')->nullable();

            $table->text('address');

            $table->string('area')->nullable();

            $table->decimal('latitude', 10, 8)->nullable();

            $table->decimal('longitude', 11, 8)->nullable();

            $table->boolean('delivery_available')->default(false);

            $table->decimal('delivery_fee', 8, 2)->default(0);

            $table->decimal('rating', 3, 2)->default(0);

            $table->integer('review_count')->default(0);

            $table->enum('status', [
                'pending',
                'verified',
                'rejected',
                'suspended'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacies');
    }
};