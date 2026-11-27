<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentTypeModel extends Model
{
    protected $table            = 'document_type';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['name', 'description'];
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';
}
