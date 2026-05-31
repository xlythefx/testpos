<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        return OrderResource::collection(
            Order::with(['cafeTable', 'user', 'items.menuItem', 'payment'])
                ->latest()
                ->paginate(15)
        );
    }

    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();
        if (empty($data['order_number'])) {
            $data['order_number'] = 'ORD-' . now()->format('Ymd') . '-' . str_pad((string)(Order::whereDate('created_at', today())->count() + 1), 4, '0', STR_PAD_LEFT);
        }
        $order = Order::create($data);
        return new OrderResource($order->load(['cafeTable', 'user', 'items.menuItem', 'payment']));
    }

    public function show(Order $order)
    {
        return new OrderResource($order->load(['cafeTable', 'user', 'items.menuItem', 'payment']));
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->update($request->validated());
        return new OrderResource($order->load(['cafeTable', 'user', 'items.menuItem', 'payment']));
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->noContent();
    }
}
