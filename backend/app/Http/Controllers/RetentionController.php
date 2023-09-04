<?php

namespace App\Http\Controllers;

use App\Models\Retention;
use Illuminate\Http\Request;

class RetentionController extends Controller
{
    public function index()
    {
        $retentions = Retention::all();
        $retentionData = $retentions->map(function ($retention) {
            return [
                'id' => $retention->id,
                'file' => asset($retention->file),
                'description_user' => $retention->description_user,
                'description_admin' => $retention->description_admin,
                'user_id' => $retention->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $retentionData,
        ], 200);
    }

    public function show($user_id)
    {
        $retention = Retention::where('user_id', $user_id)->first();

        if (!$retention) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $retentionData = [
            'id' => $retention->id,
            'file' => asset($retention->file),
            'description_user' => $retention->description_user,
            'description_admin' => $retention->description_admin,
            'user_id' => $retention->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $retentionData
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xlsm,xlsb,xltx',
            'user_id' => 'required',
        ]);
        $file = $request->file('file')->store('public/excel/step_2');

        Retention::create([
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

        $retention = Retention::find($id);

        if (!$retention) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $retention->file = $filePath;
        }

        $retention->description_user = $request->description_user;
        $retention->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $retention = Retention::find($id);
        if ($retention) {
            $retention->delete();
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

    public function retentionsDescriptionAdmin(Request $request, $id)
    {

        $retention = Retention::find($id);

        if ($retention) {
            $retention->description_admin = $request->description_admin;
            $retention->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }

}
