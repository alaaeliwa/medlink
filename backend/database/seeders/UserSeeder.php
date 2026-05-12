<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
    [
        'first_name' => 'Ahmed',
        'last_name' => 'Ali',
        'email' => 'citizen@test.com',
        'password' => bcrypt('123456'),
        'phone' => '0599000001',
        'address' => 'Nablus',
        'role' => 'citizen',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'first_name' => 'Al Shifa',
        'last_name' => 'Pharmacy',
        'email' => 'pharmacy@test.com',
        'password' => bcrypt('123456'),
        'phone' => '0599000002',
        'address' => 'Nablus Center',
        'role' => 'pharmacy',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ],
]);
    }
}