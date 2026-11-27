<?php

namespace App\Models;

use CodeIgniter\Model;

class ModuleModel extends Model
{
    protected $table            = 'module';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['name', 'route', 'icon', 'description', 'is_active'];
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    /**
     * Retorna todos los módulos.
     */
    public function getAll()
    {
        return $this->orderBy('id', 'ASC')->findAll();
    }

    /**
     * Retorna solo módulos activos (útil para el menú del frontend).
     */
    public function getActive()
    {
        return $this->where('is_active', 1)->orderBy('name', 'ASC')->findAll();
    }
}
