<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicine;
use App\Models\medicines;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        medicines::insert([
            [
                'id' => 1,
                'name' => 'Aspirin 500mg',
                'category_id' => 1,
                'price' => 5.00,
                'stock' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}