<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Libraries\JwtService;

class AuthFilter implements FilterInterface
{
    /** Usuario autenticado de la petición actual (datos del token). Uso: AuthFilter::$user['id'] */
    public static ?array $user = null;

    public function before(RequestInterface $request, $arguments = null)
    {
        $jwt = new JwtService();
        $token = $jwt->getBearerToken();

        if (!$token) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['status' => 'error', 'message' => 'Token no proporcionado.']);
        }

        $payload = $jwt->validate($token);
        if (!$payload) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['status' => 'error', 'message' => 'Token inválido o expirado.']);
        }

        // Guardar el usuario actual para usarlo en los controladores.
        // (Antes se guardaba en $request->user, pero crear propiedades dinámicas
        //  está deprecado desde PHP 8.2.)
        self::$user = $payload;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No se necesita hacer nada después de la respuesta
    }
}
