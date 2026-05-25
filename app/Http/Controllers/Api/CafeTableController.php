<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCafeTableRequest;
use App\Http\Requests\UpdateCafeTableRequest;
use App\Http\Resources\CafeTableResource;
use App\Models\CafeTable;

class CafeTableController extends Controller
{
    public function index()
    {
        return CafeTableResource::collection(CafeTable::paginate(15));
    }

    public function store(StoreCafeTableRequest $request)
    {
        $cafeTable = CafeTable::create($request->validated());
        return new CafeTableResource($cafeTable);
    }

    public function show(CafeTable $cafeTable)
    {
        return new CafeTableResource($cafeTable);
    }

    public function update(UpdateCafeTableRequest $request, CafeTable $cafeTable)
    {
        $cafeTable->update($request->validated());
        return new CafeTableResource($cafeTable);
    }

    public function destroy(CafeTable $cafeTable)
    {
        $cafeTable->delete();
        return response()->noContent();
    }
}
