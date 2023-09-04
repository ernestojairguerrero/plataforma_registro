<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::all();
        $supplierData = $suppliers->map(function ($supplier) {
            return [
                'id' => $supplier->id,
                'file' => asset($supplier->file),
                'description_user' => $supplier->description_user,
                'description_admin' => $supplier->description_admin,
                'user_id' => $supplier->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $supplierData,
        ], 200);
    }

    public function show($user_id)
    {


        $supplier = Supplier::where('user_id', $user_id)->first();

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $supplierData = [
            'id' => $supplier->id,
            'file' => asset($supplier->file),
            'description_user' => $supplier->description_user,
            'description_admin' => $supplier->description_admin,
            'user_id' => $supplier->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $supplierData
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xlsm,xlsb,xltx',
            'user_id' => 'required',
        ]);
        $file = $request->file('file')->store('public/excel/step_2');

        Supplier::create([
            'file' => $file,
            'description_user' => $request->description_user,
            'user_id' => $request->user_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Suppliere creada correctamente'
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $supplier->file = $filePath;
        }

        $supplier->description_user = $request->description_user;
        $supplier->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $supplier = Supplier::find($id);
        if ($supplier) {
            $supplier->delete();
            return response()->json([
                'success' => true,
                'message' => 'Suppliere eliminada correctamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Suppliere no encontrado'
            ], 404);
        }
    }

    public function supplierDescriptionAdmin(Request $request, $id)
    {

        $supplier = Supplier::find($id);

        if ($supplier) {
            $supplier->description_admin = $request->description_admin;
            $supplier->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
