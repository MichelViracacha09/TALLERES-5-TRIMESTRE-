<?php

namespace App\Models;

use CodeIgniter\Model;

class RoleModel extends Model
{
    protected $table            = 'role';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['name', 'description', 'is_active'];
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    /**
     * Retorna todos los roles activos e inactivos.
     */
    public function getAll()
    {
        return $this->orderBy('id', 'ASC')->findAll();
    }

    /**
     * Retorna solo roles activos (útil para selects en el frontend).
     */
    public function getActive()
    {
        return $this->where('is_active', 1)->orderBy('name', 'ASC')->findAll();
    }
}
