<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Database\Seeders\UserSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\MedicineSeeder;
use Database\Seeders\FavoriteSeeder;
use Database\Seeders\ComplaintSeeder;
use Database\Seeders\BroadcastRequestSeeder;
use Database\Seeders\OrderSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            MedicineSeeder::class,
            FavoriteSeeder::class,
            ComplaintSeeder::class,
            BroadcastRequestSeeder::class,
            OrderSeeder::class,
        ]);
    }
}