<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * منطق الأعمال للفئات (Categories) — Create, Read, Update, Delete.
 * الـ Controller يستدعي هذه الدوال فقط ولا يكتب استعلامات SQL مباشرة.
 */
class CategoryService
{
  public function paginate(int $perPage = 15): LengthAwarePaginator
  {
    return Category::query()
      ->orderBy('name')
      ->paginate($perPage);
  }

  public function findOrFail(int $id): Category
  {
    return Category::query()->findOrFail($id);
  }

  public function create(array $data): Category
  {
    return Category::query()->create($data);
  }

  public function update(Category $category, array $data): Category
  {
    $category->update($data);

    return $category->fresh();
  }

  public function delete(Category $category): void
  {
    // CASCADE على medicines حسب الـ migration
    $category->delete();
  }
}
