<?php
//DONE
// database/migrations/xxxx_xx_xx_create_broadcast_requests_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('broadcast_requests', function (Blueprint $table) {

            // ID (REQ-{timestamp})
            $table->string('id')->primary();

            // Citizen
            $table->foreignId('citizen_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('medicine_name', 255);

            $table->integer('quantity');

            $table->text('notes')->nullable();

            $table->enum('urgency', [
                'standard',
                'urgent',
                'critical'
            ])->default('standard');

            $table->enum('status', [
                'open',
                'accepted',
                'expired',
                'closed'
            ])->default('open');

            // Pharmacy responses (JSON array)
            $table->json('responses')
                  ->nullable();

            // Selected pharmacy
            $table->foreignId('accepted_pharmacy_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamp('expires_at')
                  ->nullable();

            $table->timestamp('closed_at')
                  ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('broadcast_requests');
    }
};