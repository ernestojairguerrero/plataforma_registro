<?php

namespace App\Http\Controllers;

use App\Models\AccountPlan;
use Illuminate\Http\Request;

class AccountPlanController extends Controller
{
    public function index()
    {
        $accountPlans = AccountPlan::all();
        $accountPlanData = $accountPlans->map(function ($accountPlan) {
            return [
                'id' => $accountPlan->id,
                'file' => asset($accountPlan->file),
                'description_user' => $accountPlan->description_user,
                'description_admin' => $accountPlan->description_admin,
                'user_id' => $accountPlan->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $accountPlanData,
        ], 200);
    }

    public function show($user_id)
    {
        $accountPlan = AccountPlan::where('user_id', $user_id)->first();

        if (!$accountPlan) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $accountPlanData = [
            'id' => $accountPlan->id,
            'file' => asset($accountPlan->file),
            'description_user' => $accountPlan->description_user,
            'description_admin' => $accountPlan->description_admin,
            'user_id' => $accountPlan->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $accountPlanData
        ], 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xlsm,xlsb,xltx',
            'user_id' => 'required',
        ]);

        $file = $request->file('file')->store('public/excel/step_1');

        if ($request) {
            AccountPlan::create([
                'file' => $file,
                'description_user' => $request->description_user,
                'user_id' => $request->user_id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Cliente creada correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {

        $accountPlan = AccountPlan::find($id);

        if (!$accountPlan) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $accountPlan->file = $filePath;
        }

        $accountPlan->description_user = $request->description_user;
        $accountPlan->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $accountPlan = AccountPlan::find($id);
        if ($accountPlan) {
            $accountPlan->delete();
            return response()->json([
                'success' => true,
                'message' => 'Eliminado correctamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }
    }

    public function accountPlanDescriptionAdmin(Request $request, $id)
    {

        $accountPlan = AccountPlan::find($id);

        if ($accountPlan) {
            $accountPlan->description_admin = $request->description_admin;
            $accountPlan->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }

}
