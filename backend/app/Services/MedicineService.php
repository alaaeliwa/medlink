<?php

namespace App\Services;

use App\Models\Medicine;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * منطق الأعمال للأدوية — يشمل البحث الفوري (?q=) الذي سيتصل به الفرونت لاحقاً.
 */
class MedicineService
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = Medicine::query()->with('category');

    if (! empty($filters['q'])) {
      $term = '%'.mb_strtolower(trim($filters['q'])).'%';
      $query->where(function ($q) use ($term) {
        $q->whereRaw('LOWER(name) LIKE ?', [$term])
          ->orWhereRaw('LOWER(COALESCE(generic_name, \'\')) LIKE ?', [$term]);
      });
    }

    if (isset($filters['category_id'])) {
      $query->where('category_id', $filters['category_id']);
    }

    if (isset($filters['is_active'])) {
      $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
    }

    return $query->orderBy('name')->paginate($perPage);
  }

  public function findOrFail(int $id): Medicine
  {
    return Medicine::query()->with('category')->findOrFail($id);
  }

  public function create(array $data): Medicine
  {
    return Medicine::query()->create($data);
  }

  public function update(Medicine $medicine, array $data): Medicine
  {
    $medicine->update($data);

    return $medicine->fresh()->load('category');
  }

  public function delete(Medicine $medicine): void
  {
    $medicine->delete();
  }
}
