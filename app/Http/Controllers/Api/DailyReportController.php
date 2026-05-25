<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDailyReportRequest;
use App\Http\Requests\UpdateDailyReportRequest;
use App\Http\Resources\DailyReportResource;
use App\Models\DailyReport;

class DailyReportController extends Controller
{
    public function index()
    {
        return DailyReportResource::collection(DailyReport::orderByDesc('report_date')->paginate(15));
    }

    public function store(StoreDailyReportRequest $request)
    {
        $report = DailyReport::create($request->validated());
        return new DailyReportResource($report);
    }

    public function show(DailyReport $dailyReport)
    {
        return new DailyReportResource($dailyReport);
    }

    public function update(UpdateDailyReportRequest $request, DailyReport $dailyReport)
    {
        $dailyReport->update($request->validated());
        return new DailyReportResource($dailyReport);
    }

    public function destroy(DailyReport $dailyReport)
    {
        $dailyReport->delete();
        return response()->noContent();
    }
}
