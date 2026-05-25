<?php
// database/migrations/xxxx_xx_xx_create_complaints_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {

            // ID (custom format CP-{timestamp})
            $table->string('id')->primary();

            // Reporter (citizen)
            $table->foreignId('reporter_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Against pharmacy (user role = pharmacy)
            $table->foreignId('against_pharmacy_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('subject', 255);

            $table->text('details');

            $table->enum('severity', [
                'low',
                'medium',
                'high',
                'critical'
            ])->default('low');

            $table->enum('status', [
                'open',
                'in_review',
                'resolved',
                'rejected'
            ])->default('open');

            // Admin handling it (optional)
            $table->foreignId('assigned_admin_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->text('resolution')
                  ->nullable();

            $table->timestamp('resolution_date')
                  ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};