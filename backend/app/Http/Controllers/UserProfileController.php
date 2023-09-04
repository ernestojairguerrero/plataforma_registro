<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function index()
    {
        $userProfiles = UserProfile::all();
        $userProfileData = $userProfiles->map(function ($userProfile) {
            return [
                'id' => $userProfile->id,
                'file' => asset($userProfile->file),
                'description_user' => $userProfile->description_user,
                'description_admin' => $userProfile->description_admin,
                'user_id' => $userProfile->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $userProfileData,
        ], 200);
    }

    public function show($user_id)
    {
        $userProfile = UserProfile::where('user_id', $user_id)->first();

        if (!$userProfile) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $userProfileData = [
            'id' => $userProfile->id,
            'file' => asset($userProfile->file),
            'description_user' => $userProfile->description_user,
            'description_admin' => $userProfile->description_admin,
            'user_id' => $userProfile->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $userProfileData
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
            UserProfile::create([
                'file' => $file,
                'description_user' => $request->description_user,
                'user_id' => $request->user_id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Employeee creada correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {

        $userProfile = UserProfile::find($id);

        if (!$userProfile) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $userProfile->file = $filePath;
        }

        $userProfile->description_user = $request->description_user;
        $userProfile->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }


    public function destroy($id)
    {
        $userProfile = UserProfile::find($id);
        if ($userProfile) {
            $userProfile->delete();
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

    public function userProfilesDescriptionAdmin(Request $request, $id)
    {

        $userProfile = UserProfile::find($id);

        if ($userProfile) {
            $userProfile->description_admin = $request->description_admin;
            $userProfile->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
