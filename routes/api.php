<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CafeTableController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DailyReportController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderItemController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('users', UserController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('menu-items', MenuItemController::class);
    Route::apiResource('cafe-tables', CafeTableController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('order-items', OrderItemController::class);
    Route::apiResource('daily-reports', DailyReportController::class);
});
