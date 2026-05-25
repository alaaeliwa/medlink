<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\BroadcastRequestController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\PharmacyVerificationController;
use App\Http\Controllers\Admin\AdminComplaintController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Admin\ReportController;

/*
|--------------------------------------------------------------------------
| MedLink API — base: /api/v1/
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── Public ─────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // ─── Authenticated ───────────────────────────────────────────────────────
    Route::middleware('auth:api')->group(function () {

        // Auth management
        Route::post('auth/logout',  [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);

        // User profile
        Route::prefix('users')->group(function () {
            Route::get('me',              [UserController::class, 'me']);
            Route::put('me',              [UserController::class, 'update']);
            Route::post('change-password',[UserController::class, 'changePassword']);
            Route::post('upload-avatar',  [UserController::class, 'uploadAvatar']);
        });

        // Medicines (read — all authenticated)
        Route::get('medicines/categories', [MedicineController::class, 'categories']);
        Route::get('medicines',            [MedicineController::class, 'index']);
        Route::get('medicines/{id}',       [MedicineController::class, 'show']);

        // Pharmacies (read — all authenticated)
        Route::get('pharmacies/areas',  [PharmacyController::class, 'areas']);
        Route::get('pharmacies',        [PharmacyController::class, 'index']);
        Route::get('pharmacies/{id}',   [PharmacyController::class, 'show']);

        // Reviews (read — all authenticated)
        Route::get('reviews/pharmacy/{id}', [ReviewController::class, 'byPharmacy']);

        // ── Citizen ──────────────────────────────────────────────────────────
        Route::middleware('role:citizen')->group(function () {

            // Orders
            Route::post('orders',           [OrderController::class, 'store']);
            Route::delete('orders/{id}',    [OrderController::class, 'destroy']);

            // Broadcast requests
            Route::prefix('requests')->group(function () {
                Route::get('/',                          [BroadcastRequestController::class, 'index']);
                Route::post('/',                         [BroadcastRequestController::class, 'store']);
                Route::delete('{id}',                    [BroadcastRequestController::class, 'destroy']);
                Route::post('{id}/accept/{pharmacyId}',  [BroadcastRequestController::class, 'accept']);
            });

            // Favorites
            Route::get('favorites',         [FavoriteController::class, 'index']);
            Route::post('favorites',        [FavoriteController::class, 'store']);
            Route::delete('favorites/{id}', [FavoriteController::class, 'destroy']);

            // Reviews
            Route::post('reviews', [ReviewController::class, 'store']);

            // Complaints
            Route::get('complaints',  [ComplaintController::class, 'index']);
            Route::post('complaints', [ComplaintController::class, 'store']);
        });

        // ── Pharmacy ─────────────────────────────────────────────────────────
        Route::middleware('role:pharmacy')->group(function () {

            // Profile settings
            Route::put('pharmacies/me/settings', [PharmacyController::class, 'updateSettings']);

            // Inventory
            Route::prefix('inventory')->group(function () {
                Route::get('/',       [InventoryController::class, 'index']);
                Route::post('/',      [InventoryController::class, 'store']);
                Route::put('{id}',    [InventoryController::class, 'update']);
                Route::delete('{id}', [InventoryController::class, 'destroy']);
            });

            // Broadcast request network
            Route::get('requests/network',          [BroadcastRequestController::class, 'network']);
            Route::post('requests/{id}/respond',    [BroadcastRequestController::class, 'respond']);
        });

        // ── Citizen OR Pharmacy (shared order endpoints) ──────────────────────
        Route::middleware('role:citizen,pharmacy')->group(function () {
            Route::get('orders',      [OrderController::class, 'index']);
            Route::get('orders/{id}', [OrderController::class, 'show']);
        });

        // Order status update — pharmacy only
        Route::middleware('role:pharmacy')->put('orders/{id}/status', [OrderController::class, 'updateStatus']);

        // ── Admin ─────────────────────────────────────────────────────────────
        Route::middleware('role:admin')->prefix('admin')->group(function () {

            // User management
            Route::get('users',                 [UserManagementController::class, 'index']);
            Route::put('users/{id}/status',     [UserManagementController::class, 'updateStatus']);

            // Pharmacy verification
            Route::get('pharmacies/verification',   [PharmacyVerificationController::class, 'pending']);
            Route::put('pharmacies/{id}/verify',    [PharmacyVerificationController::class, 'verify']);

            // Medicines CRUD
            Route::post('medicines',        [MedicineController::class, 'store']);
            Route::put('medicines/{id}',    [MedicineController::class, 'update']);
            Route::delete('medicines/{id}', [MedicineController::class, 'destroy']);

            // Complaints
            Route::get('complaints',        [AdminComplaintController::class, 'index']);
            Route::put('complaints/{id}',   [AdminComplaintController::class, 'update']);

            // Statistics & reports
            Route::get('statistics', [StatisticsController::class, 'index']);
            Route::get('reports',    [ReportController::class, 'index']);
        });
    });
});
