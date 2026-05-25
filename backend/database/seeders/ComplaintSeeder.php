<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Complaints;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        Complaints::insert([
            [
                'id' => 'CP-1001',
                'reporter_id' => 1,
                'against_pharmacy_id' => 2,
                'subject' => 'Late delivery',
                'details' => 'Order arrived late than expected',
                'severity' => 'medium',
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}