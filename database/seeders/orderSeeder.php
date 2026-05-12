<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\orders;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        orders::insert([
            [
                'id' => 'ORD-1001',
                'citizen_id' => 1,
                'pharmacy_id' => 2,
                'medicines' => json_encode([
                    [
                        'medicine_id' => 1,
                        'name' => 'Aspirin 500mg',
                        'quantity' => 2,
                        'price' => 5
                    ]
                ]),
                'total_price' => 10,
                'urgency' => 'standard',
                'status' => 'pending',
                'status_timeline' => json_encode([]),
                'order_date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}