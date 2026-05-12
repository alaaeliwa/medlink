<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::insert([
            ['id' => 1, 'name' => 'Painkillers', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Antibiotics', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Vitamins', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}