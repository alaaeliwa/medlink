<?php

namespace Database\Seeders;

use App\Models\{User, Pharmacy, Category, Medicine, InventoryItem, Order, BroadcastRequest, Review, Complaint};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ────────────────────────────────────────────────────────────
        $admin = User::create([
            'name'      => 'MedLink Admin',
            'email'     => 'admin@medlink.com',
            'password'  => Hash::make('Admin@123'),
            'role'      => 'admin',
            'is_active' => true,
        ]);

        $citizen = User::create([
            'name'      => 'Ahmed Ali',
            'email'     => 'ahmed@example.com',
            'password'  => Hash::make('Citizen@123'),
            'role'      => 'citizen',
            'phone'     => '+20 100 123 4567',
            'is_active' => true,
        ]);

        $pharmUser = User::create([
            'name'      => 'Al-Shifa Pharmacy',
            'email'     => 'alshifa@pharmacy.com',
            'password'  => Hash::make('Pharmacy@123'),
            'role'      => 'pharmacy',
            'phone'     => '+20 112 987 6543',
            'is_active' => true,
        ]);

        $pharmUser2 = User::create([
            'name'      => 'Al-Noor Pharmacy',
            'email'     => 'alnoor@pharmacy.com',
            'password'  => Hash::make('Pharmacy@123'),
            'role'      => 'pharmacy',
            'phone'     => '+20 111 555 0000',
            'is_active' => true,
        ]);

        // ── Pharmacies ────────────────────────────────────────────────────────
        $pharmacy1 = Pharmacy::create([
            'user_id'        => $pharmUser->id,
            'name'           => 'Al-Shifa Pharmacy',
            'license_number' => 'LIC-001-2024',
            'address'        => '12 Tahrir Square, Downtown',
            'area'           => 'Downtown',
            'phone'          => '+20 112 987 6543',
            'description'    => 'Serving the community since 2005.',
            'is_verified'    => true,
            'is_active'      => true,
            'has_delivery'   => true,
            'opening_hours'  => '08:00',
            'closing_hours'  => '23:00',
            'latitude'       => 30.0444,
            'longitude'      => 31.2357,
        ]);

        $pharmacy2 = Pharmacy::create([
            'user_id'        => $pharmUser2->id,
            'name'           => 'Al-Noor Pharmacy',
            'license_number' => 'LIC-002-2024',
            'address'        => '5 Nasr City Road',
            'area'           => 'Nasr City',
            'phone'          => '+20 111 555 0000',
            'is_verified'    => true,
            'is_active'      => true,
            'has_delivery'   => false,
            'opening_hours'  => '09:00',
            'closing_hours'  => '22:00',
        ]);

        // ── Categories ────────────────────────────────────────────────────────
        $cats = [];
        foreach ([
            ['Antibiotics',        'Medications that fight bacterial infections', 'fa-bacterium'],
            ['Painkillers',        'Analgesic medications for pain relief',       'fa-pills'],
            ['Vitamins',           'Nutritional supplements',                      'fa-apple-alt'],
            ['Cardiovascular',     'Heart and blood pressure medications',         'fa-heartbeat'],
            ['Respiratory',        'Medications for breathing conditions',         'fa-lungs'],
            ['Gastrointestinal',   'Digestive system medications',                 'fa-stomach'],
            ['Dermatology',        'Skin care and treatment medications',          'fa-hand-holding-medical'],
        ] as [$name, $desc, $icon]) {
            $cats[] = Category::create(['name' => $name, 'description' => $desc, 'icon' => $icon]);
        }

        // ── Medicines ─────────────────────────────────────────────────────────
        $medicines = [];
        $medicineData = [
            ['Amoxicillin 500mg',   'amoxicillin',         0, 'Broad-spectrum antibiotic.',          'GSK',       true],
            ['Augmentin 625mg',     'amoxicillin/clavulanic acid', 0, 'Combined antibiotic.',       'GSK',       true],
            ['Panadol Extra',       'paracetamol/caffeine',1, 'Fast-acting pain & fever relief.',   'Haleon',    false],
            ['Brufen 400mg',        'ibuprofen',           1, 'Anti-inflammatory analgesic.',       'Abbott',    false],
            ['Vitamin C 1000mg',    'ascorbic acid',       2, 'Immune system support.',             'Pharco',    false],
            ['Vitamin D3 5000IU',   'cholecalciferol',     2, 'Bone health supplement.',            'MEPACO',    false],
            ['Concor 5mg',          'bisoprolol',          3, 'Beta blocker for hypertension.',     'Merck',     true],
            ['Lipitor 20mg',        'atorvastatin',        3, 'Cholesterol-lowering statin.',       'Pfizer',    true],
            ['Ventolin Inhaler',    'salbutamol',          4, 'Reliever inhaler for asthma.',       'GSK',       true],
            ['Nexium 20mg',         'esomeprazole',        5, 'Proton pump inhibitor for GERD.',   'AstraZeneca',true],
            ['Betadine Cream',      'povidone-iodine',     6, 'Antiseptic wound care cream.',       'Mundipharma',false],
        ];

        foreach ($medicineData as [$name, $ingredient, $catIdx, $desc, $mfr, $rx]) {
            $medicines[] = Medicine::create([
                'name'                  => $name,
                'active_ingredient'     => $ingredient,
                'category_id'           => $cats[$catIdx]->id,
                'description'           => $desc,
                'manufacturer'          => $mfr,
                'requires_prescription' => $rx,
            ]);
        }

        // ── Inventory ─────────────────────────────────────────────────────────
        $inventoryData = [
            // [medicine_idx, pharmacy, qty, price, expiry]
            [0,  $pharmacy1, 50,  45.00, '2026-12-01'],
            [1,  $pharmacy1, 30,  78.50, '2026-11-01'],
            [2,  $pharmacy1, 100, 22.00, '2026-10-01'],
            [3,  $pharmacy1, 80,  35.00, '2026-09-01'],
            [4,  $pharmacy1, 200, 15.00, '2027-01-01'],
            [6,  $pharmacy1, 20,  65.00, '2026-12-01'],
            [8,  $pharmacy1, 15,  120.00,'2026-08-01'],
            [2,  $pharmacy2, 60,  21.00, '2026-10-01'],
            [4,  $pharmacy2, 150, 14.50, '2027-02-01'],
            [5,  $pharmacy2, 100, 55.00, '2027-03-01'],
            [7,  $pharmacy2, 25,  95.00, '2026-12-01'],
            [9,  $pharmacy2, 40,  48.00, '2026-11-01'],
            [10, $pharmacy2, 35,  28.00, '2026-09-01'],
        ];

        $inventoryItems = [];
        foreach ($inventoryData as [$medIdx, $pharm, $qty, $price, $expiry]) {
            $inventoryItems[] = InventoryItem::create([
                'pharmacy_id' => $pharm->id,
                'medicine_id' => $medicines[$medIdx]->id,
                'quantity'    => $qty,
                'price'       => $price,
                'expiry_date' => $expiry,
                'is_available'=> true,
            ]);
        }

        // ── Orders ────────────────────────────────────────────────────────────
        order::create([
            'citizen_id'        => $citizen->id,
            'pharmacy_id'       => $pharmacy1->id,
            'inventory_item_id' => $inventoryItems[2]->id,
            'quantity'          => 2,
            'total_price'       => 44.00,
            'status'            => 'approved',
            'notes'             => 'Please pack carefully.',
        ]);

        Order::create([
            'citizen_id'        => $citizen->id,
            'pharmacy_id'       => $pharmacy1->id,
            'inventory_item_id' => $inventoryItems[4]->id,
            'quantity'          => 1,
            'total_price'       => 15.00,
            'status'            => 'pending',
        ]);

        // ── Broadcast Requests ────────────────────────────────────────────────
        BroadcastRequest::create([
            'citizen_id'  => $citizen->id,
            'medicine_id' => $medicines[6]->id,
            'notes'       => 'Need urgently, any available pharmacy.',
            'status'      => 'open',
        ]);

        // ── Reviews ───────────────────────────────────────────────────────────
        Review::create([
            'citizen_id'  => $citizen->id,
            'pharmacy_id' => $pharmacy1->id,
            'rating'      => 5,
            'comment'     => 'Excellent service and fast delivery!',
        ]);

        // ── Complaints ────────────────────────────────────────────────────────
        Complaint::create([
            'citizen_id'  => $citizen->id,
            'pharmacy_id' => $pharmacy2->id,
            'subject'     => 'Wrong medicine dispensed',
            'body'        => 'I received a different dosage than what was prescribed.',
            'status'      => 'open',
        ]);

        $this->command->info('✅ MedLink database seeded successfully!');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin',    'admin@medlink.com',    'Admin@123'],
                ['Citizen',  'ahmed@example.com',    'Citizen@123'],
                ['Pharmacy', 'alshifa@pharmacy.com', 'Pharmacy@123'],
            ]
        );
    }
}
