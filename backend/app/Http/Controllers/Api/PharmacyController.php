<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\RespondsWithJson;
use App\Http\Requests\StorePharmacyRequest;
use App\Http\Requests\UpdatePharmacyRequest;
use App\Http\Resources\PharmacyResource;
use App\Services\PharmacyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    use RespondsWithJson;

    public function __construct(
        private readonly PharmacyService $pharmacies
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->pharmacies->paginate(
            $request->only(['area', 'status']),
            (int) $request->get('per_page', 15)
        );

        return $this->success([
            'items' => PharmacyResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(int $pharmacy): JsonResponse
    {
        return $this->success(new PharmacyResource($this->pharmacies->findOrFail($pharmacy)));
    }

    public function store(StorePharmacyRequest $request): JsonResponse
    {
        $pharmacy = $this->pharmacies->create($request->validated());

        return $this->created(new PharmacyResource($pharmacy->load('user')));
    }

    public function update(UpdatePharmacyRequest $request, int $pharmacy): JsonResponse
    {
        $model = $this->pharmacies->findOrFail($pharmacy);
        $updated = $this->pharmacies->update($model, $request->validated());

        return $this->success(new PharmacyResource($updated), 'تم التحديث بنجاح');
    }

    public function destroy(int $pharmacy): JsonResponse
    {
        $this->pharmacies->delete($this->pharmacies->findOrFail($pharmacy));

        return $this->success(null, 'تم الحذف بنجاح');
    }
}
