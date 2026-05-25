<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\favorites;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        favorites::insert([
            [
                'id' => Str::uuid(),
                'citizen_id' => 1,
                'favorite_type' => 'medicine',
                'favorite_id' => '1',
                'favorite_data' => json_encode([
                    'name' => 'Aspirin 500mg'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}