<?php

namespace App\Http\Controllers;

use App\Models\PayrollConcept;
use Illuminate\Http\Request;

class PayrollConceptController extends Controller
{
    public function index()
    {
        $payrollsConcepts = PayrollConcept::all();
        $payrollsConceptData = $payrollsConcepts->map(function ($payrollsConcept) {
            return [
                'id' => $payrollsConcept->id,
                'file' => asset($payrollsConcept->file),
                'description_user' => $payrollsConcept->description_user,
                'description_admin' => $payrollsConcept->description_admin,
                'user_id' => $payrollsConcept->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $payrollsConceptData,
        ], 200);
    }

    public function show($user_id)
    {
        $payrollsConcept = PayrollConcept::where('user_id', $user_id)->first();

        if (!$payrollsConcept) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $payrollsConceptData = [
            'id' => $payrollsConcept->id,
            'file' => asset($payrollsConcept->file),
            'description_user' => $payrollsConcept->description_user,
            'description_admin' => $payrollsConcept->description_admin,
            'user_id' => $payrollsConcept->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $payrollsConceptData
        ], 200);

    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xlsm,xlsb,xltx',
            'user_id' => 'required',
        ]);
        $file = $request->file('file')->store('public/excel/step_2');

        PayrollConcept::create([
            'file' => $file,
            'description_user' => $request->description_user,
            'user_id' => $request->user_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'PayrollConcept creada correctamente'
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $payrollPlan = PayrollConcept::find($id);

        if (!$payrollPlan) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $payrollPlan->file = $filePath;
        }

        $payrollPlan->description_user = $request->description_user;
        $payrollPlan->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $payrollsConcepts = PayrollConcept::find($id);
        if ($payrollsConcepts) {
            $payrollsConcepts->delete();
            return response()->json([
                'success' => true,
                'message' => 'PayrollConcept eliminada correctamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'PayrollConcept no encontrado'
            ], 404);
        }
    }

    public function payrollConceptsDescriptionAdmin(Request $request, $id)
    {

        $payrollConcept = PayrollConcept::find($id);

        if ($payrollConcept) {
            $payrollConcept->description_admin = $request->description_admin;
            $payrollConcept->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
