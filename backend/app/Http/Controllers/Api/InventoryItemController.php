<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\RespondsWithJson;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Http\Resources\InventoryItemResource;
use App\Services\InventoryItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{
    use RespondsWithJson;

    public function __construct(
        private readonly InventoryItemService $inventory
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->inventory->paginate(
            $request->only(['pharmacy_id', 'medicine_id']),
            (int) $request->get('per_page', 15)
        );

        return $this->success([
            'items' => InventoryItemResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(int $inventory_item): JsonResponse
    {
        return $this->success(new InventoryItemResource($this->inventory->findOrFail($inventory_item)));
    }

    public function store(StoreInventoryItemRequest $request): JsonResponse
    {
        $item = $this->inventory->create($request->validated());

        return $this->created(new InventoryItemResource($item->load(['pharmacy', 'medicine'])));
    }
    public function update(UpdateInventoryItemRequest $request, int $inventory_item): JsonResponse
    {
        $model = $this->inventory->findOrFail($inventory_item);
        $updated = $this->inventory->update($model, $request->validated());

        return $this->success(new InventoryItemResource($updated), 'تم التحديث بنجاح');
    }

    public function destroy(int $inventory_item): JsonResponse
    {
        $this->inventory->delete($this->inventory->findOrFail($inventory_item));

        return $this->success(null, 'تم الحذف بنجاح');
    }
}
