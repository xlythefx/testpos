<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItemResource::collection(MenuItem::with('category')->paginate(15));
    }

    public function store(StoreMenuItemRequest $request)
    {
        $menuItem = MenuItem::create($request->validated());
        return new MenuItemResource($menuItem);
    }

    public function show(MenuItem $menuItem)
    {
        return new MenuItemResource($menuItem->load('category'));
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem)
    {
        $menuItem->update($request->validated());
        return new MenuItemResource($menuItem);
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();
        return response()->noContent();
    }
}
