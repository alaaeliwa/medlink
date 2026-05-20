<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\InventoryItemController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\PharmacyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| MedLink API — Week 10 (Server-side / CRUD)
|--------------------------------------------------------------------------
| كل المسارات تبدأ بـ /api/v1
| مثال: GET http://127.0.0.1:8000/api/v1/medicines?q=panadol
*/

Route::prefix('v1')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('medicines', MedicineController::class);
    Route::apiResource('pharmacies', PharmacyController::class);
    Route::apiResource('inventory-items', InventoryItemController::class);
});
