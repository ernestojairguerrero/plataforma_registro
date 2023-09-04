<?php

namespace App\Http\Controllers;

use App\Models\ProductService;
use Illuminate\Http\Request;

class ProductServiceController extends Controller
{
    public function index()
    {
        $productServices = ProductService::all();
        $productServiceData = $productServices->map(function ($productService) {
            return [
                'id' => $productService->id,
                'file' => asset($productService->file),
                'description_user' => $productService->description_user,
                'description_admin' => $productService->description_admin,
                'user_id' => $productService->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $productServiceData,
        ], 200);
    }

    public function show($user_id)
    {
        $productService = ProductService::where('user_id', $user_id)->first();

        if (!$productService) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $productServiceData = [
            'id' => $productService->id,
            'file' => asset($productService->file),
            'description_user' => $productService->description_user,
            'description_admin' => $productService->description_admin,
            'user_id' => $productService->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $productServiceData
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
            ProductService::create([
                'file' => $file,
                'description_user' => $request->description_user,
                'user_id' => $request->user_id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Creada correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {

        $productService = ProductService::find($id);

        if (!$productService) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $productService->file = $filePath;
        }

        $productService->description_user = $request->description_user;
        $productService->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $productService = ProductService::find($id);
        if ($productService) {
            $productService->delete();
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

    public function productServiceDescriptionAdmin(Request $request, $id)
    {
        $productService = ProductService::find($id);

        if ($productService) {
            $productService->description_admin = $request->description_admin;
            $productService->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }

}
