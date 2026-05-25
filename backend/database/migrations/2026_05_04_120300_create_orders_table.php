<?php
//done
// database/migrations/2026_05_11_000006_create_orders_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->string('id')->primary();
            $table->foreignId('citizen_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->json('medicines');

            $table->foreignId('pharmacy_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->decimal('total_price', 10, 2)
                ->default(0);

            $table->enum('urgency', [
                'standard',
                'urgent',
                'critical'
            ])->default('standard');

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'preparing',
                'ready',
                'delivered',
                'cancelled'
            ])->default('pending');

            $table->text('notes')->nullable();

            $table->json('status_timeline')
          ->nullable();

             $table->text('pharmacy_response')
          ->nullable();

             $table->timestamp('response_date')
          ->nullable();

            $table->timestamp('order_date')->useCurrent();
    

            $table->timestamp('expected_delivery')
                ->nullable();

            $table->timestamp('completed_at')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};