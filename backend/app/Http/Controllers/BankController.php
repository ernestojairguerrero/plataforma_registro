<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    public function index()
    {
        $banks = Bank::all();
        $bankData = $banks->map(function ($bank) {
            return [
                'id' => $bank->id,
                'file' => asset($bank->file),
                'description_user' => $bank->description_user,
                'description_admin' => $bank->description_admin,
                'user_id' => $bank->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $bankData,
        ], 200);
    }

    public function show($user_id)
    {
        $bank = Bank::where('user_id', $user_id)->first();

        if (!$bank) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $bankData = [
            'id' => $bank->id,
            'file' => asset($bank->file),
            'description_user' => $bank->description_user,
            'description_admin' => $bank->description_admin,
            'user_id' => $bank->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $bankData
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xlsm,xlsb,xltx',
            'user_id' => 'required',
        ]);
        $file = $request->file('file')->store('public/excel/step_2');

        Bank::create([
            'file' => $file,
            'description_user' => $request->description_user,
            'user_id' => $request->user_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Banco creado correctamente'
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $bank = Bank::find($id);

        if (!$bank) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $bank->file = $filePath;
        }

        $bank->description_user = $request->description_user;
        $bank->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $bank = Bank::find($id);
        if ($bank) {
            $bank->delete();
            return response()->json([
                'success' => true,
                'message' => 'Banco eliminada correctamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Banco no encontrado'
            ], 404);
        }
    }

    public function bankDescriptionAdmin(Request $request, $id)
    {

        $bank = Bank::find($id);

        if ($bank) {
            $bank->description_admin = $request->description_admin;
            $bank->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }

}
