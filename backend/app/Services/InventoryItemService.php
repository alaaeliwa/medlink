<?php

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * إدارة مخزون الصيدلية — يحدّث حالة المخزون (in_stock / low_stock / out_of_stock) تلقائياً.
 */
class InventoryItemService
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = InventoryItem::query()->with(['pharmacy', 'medicine']);

    if (! empty($filters['pharmacy_id'])) {
      $query->where('pharmacy_id', $filters['pharmacy_id']);
    }

    if (! empty($filters['medicine_id'])) {
      $query->where('medicine_id', $filters['medicine_id']);
    }

    return $query->orderByDesc('updated_at')->paginate($perPage);
  }

  public function findOrFail(int $id): InventoryItem
  {
    return InventoryItem::query()->with(['pharmacy', 'medicine'])->findOrFail($id);
  }

  public function create(array $data): InventoryItem
  {
    $data['status'] = $this->resolveStockStatus(
      (int) $data['quantity'],
      (int) ($data['minimum_stock'] ?? 10)
    );

    return InventoryItem::query()->create($data);
  }

  public function update(InventoryItem $item, array $data): InventoryItem
  {
    if (array_key_exists('quantity', $data) || array_key_exists('minimum_stock', $data)) {
      $quantity = (int) ($data['quantity'] ?? $item->quantity);
      $minimum = (int) ($data['minimum_stock'] ?? $item->minimum_stock);
      $data['status'] = $this->resolveStockStatus($quantity, $minimum);
    }

    $item->update($data);

    return $item->fresh()->load(['pharmacy', 'medicine']);
  }

  public function delete(InventoryItem $item): void
  {
    $item->delete();
  }

  /** قاعدة عمل بسيطة: كمية 0 = نفاد، أقل من الحد الأدنى = منخفض، وإلا متوفر */
  public function resolveStockStatus(int $quantity, int $minimumStock): string
  {
    if ($quantity <= 0) {
      return 'out_of_stock';
    }

    if ($quantity <= $minimumStock) {
      return 'low_stock';
    }

    return 'in_stock';
  }
}
