<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\RespondsWithJson;
use App\Http\Requests\StoreMedicineRequest;
use App\Http\Requests\UpdateMedicineRequest;
use App\Http\Resources\MedicineResource;
use App\Services\MedicineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    use RespondsWithJson;

    public function __construct(
        private readonly MedicineService $medicines
    ) {}

    /**
     * GET /api/v1/medicines?q=panadol&category_id=1
     * البحث الفوري لاحقاً من الفرونت: يرسل ?q= مع كل حرف
     */
    public function index(Request $request): JsonResponse
    {
        $paginator = $this->medicines->paginate(
            $request->only(['q', 'category_id', 'is_active']),
            (int) $request->get('per_page', 15)
        );

        return $this->success([
            'items' => MedicineResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(int $medicine): JsonResponse
    {
        return $this->success(new MedicineResource($this->medicines->findOrFail($medicine)));
    }

    public function store(StoreMedicineRequest $request): JsonResponse
    {
        $medicine = $this->medicines->create($request->validated());

        return $this->created(new MedicineResource($medicine->load('category')));
    }

    public function update(UpdateMedicineRequest $request, int $medicine): JsonResponse
    {
        $model = $this->medicines->findOrFail($medicine);
        $updated = $this->medicines->update($model, $request->validated());

        return $this->success(new MedicineResource($updated), 'تم التحديث بنجاح');
    }

    public function destroy(int $medicine): JsonResponse
    {
        $this->medicines->delete($this->medicines->findOrFail($medicine));

        return $this->success(null, 'تم الحذف بنجاح');
    }
}
