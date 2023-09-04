<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all();
        $clientsData = $clients->map(function ($client) {
            return [
                'id' => $client->id,
                'file' => asset($client->file),
                'description_user' => $client->description_user,
                'description_admin' => $client->description_admin,
                'user_id' => $client->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $clientsData,
        ], 200);
    }

    public function show($user_id)
    {
        $client = Client::where('user_id', $user_id)->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $clientData = [
            'id' => $client->id,
            'file' => asset($client->file),
            'description_user' => $client->description_user,
            'description_admin' => $client->description_admin,
            'user_id' => $client->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $clientData
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
            client::create([
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

        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $client->file = $filePath;
        }

        $client->description_user = $request->description_user;
        $client->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $client = Client::find($id);
        if ($client) {
            $client->delete();
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

    public function clientsDescriptionAdmin(Request $request, $id)
    {
        $client = Client::find($id);

        if ($client) {
            $client->description_admin = $request->description_admin;
            $client->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
