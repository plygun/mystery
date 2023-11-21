<?php

namespace App\Service\FileUploader;

use Symfony\Component\HttpFoundation\File\UploadedFile;

interface FileUploaderInterface
{
    public function upload(UploadedFile $file, string $pathPrefix = ''): FileUploaderInterface;

    public function getOriginalFilename(): string;

    public function getPublicUrl(): string;
}
