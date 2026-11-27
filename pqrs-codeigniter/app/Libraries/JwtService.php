<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Servicio JWT usado por AuthController y AuthFilter.
 * Lee JWT_SECRET y JWT_EXPIRE del archivo .env
 */
class JwtService
{
    private string $key;
    private int $expire;

    public function __construct()
    {
        $this->key    = (string) env('JWT_SECRET');
        $this->expire = (int) env('JWT_EXPIRE', 3600);
    }

    /** Genera un token JWT con los datos del usuario dentro de "data". */
    public function generate(array $payload): string
    {
        $time = time();

        return JWT::encode([
            'iat'  => $time,                 // Emitido en
            'exp'  => $time + $this->expire, // Expira en
            'data' => $payload,              // id, username, email...
        ], $this->key, 'HS256');
    }

    /** Valida el token y retorna los datos (array), o false si es inválido/expirado. */
    public function validate(string $token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            return (array) $decoded->data;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /** Extrae el token del header "Authorization: Bearer <token>". */
    public function getBearerToken(): ?string
    {
        $authHeader = \Config\Services::request()->getHeaderLine('Authorization');

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
