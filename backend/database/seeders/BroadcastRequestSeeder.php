<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\broadcastRequest;

class BroadcastRequestSeeder extends Seeder
{
    public function run(): void
    {
        broadcastrequest::insert([
            [
                'id' => 'REQ-1001',
                'citizen_id' => 1,
                'medicine_name' => 'Aspirin 500mg',
                'quantity' => 2,
                'notes' => 'Urgent need',
                'urgency' => 'urgent',
                'status' => 'open',
                'responses' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}