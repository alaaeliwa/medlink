<?php

namespace App\Services;

use App\Models\Pharmacy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PharmacyService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Pharmacy::query()->with('user');

        if (! empty($filters['area'])) {
            $query->where('area', $filters['area']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('pharmacy_name')->paginate($perPage);
    }

    public function findOrFail(int $id): Pharmacy
    {
        return Pharmacy::query()->with(['user', 'inventoryItems.medicine'])->findOrFail($id);
    }

    public function create(array $data): Pharmacy
    {
        return Pharmacy::query()->create($data);
    }

    public function update(Pharmacy $pharmacy, array $data): Pharmacy
    {
        $pharmacy->update($data);

        return $pharmacy->fresh()->load('user');
    }

    public function delete(Pharmacy $pharmacy): void
    {
        $pharmacy->delete();
    }
}
