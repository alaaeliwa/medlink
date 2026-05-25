<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\RespondsWithJson;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * طبقة HTTP رقيقة — CRUD للفئات.
 * المنطق الحقيقي في CategoryService (مطلوب Week 10: عدم كتابة كل شيء في ملف واحد طويل).
 */
class CategoryController extends Controller
{
    use RespondsWithJson;

    public function __construct(
        private readonly CategoryService $categories
    ) {}

    /** GET /api/v1/categories — عرض القائمة */
    public function index(Request $request): JsonResponse
    {
        $paginator = $this->categories->paginate((int) $request->get('per_page', 15));

        return $this->success([
            'items' => CategoryResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /** GET /api/v1/categories/{id} */
    public function show(int $category): JsonResponse
    {
        return $this->success(new CategoryResource($this->categories->findOrFail($category)));
    }

    /** POST /api/v1/categories */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categories->create($request->validated());

        return $this->created(new CategoryResource($category));
    }

    /** PUT/PATCH /api/v1/categories/{id} */
    public function update(UpdateCategoryRequest $request, int $category): JsonResponse
    {
        $model = $this->categories->findOrFail($category);
        $updated = $this->categories->update($model, $request->validated());

        return $this->success(new CategoryResource($updated), 'تم التحديث بنجاح');
    }

    /** DELETE /api/v1/categories/{id} */
    public function destroy(int $category): JsonResponse
    {
        $this->categories->delete($this->categories->findOrFail($category));

        return $this->success(null, 'تم الحذف بنجاح');
    }
}
