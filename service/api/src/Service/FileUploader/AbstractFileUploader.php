<?php

namespace App\Service\FileUploader;

abstract class AbstractFileUploader implements FileUploaderInterface
{
    /**
     * Target directory for all uploads.
     */
    protected string $targetDirectory;

    /**
     * Absolute path to the uploaded file.
     */
    protected string $absolutePath;

    /**
     * Original filename of the uploaded file (aka client original name).
     */
    protected string $originalFilename;

    public function getAbsolutePath(): string
    {
        return $this->absolutePath;
    }

    public function setAbsolutePath(string $absolutePath): self
    {
        $this->absolutePath = $absolutePath;

        return $this;
    }

    public function getOriginalFilename(): string
    {
        return $this->originalFilename;
    }

    public function setOriginalFilename(string $originalFilename): self
    {
        $this->originalFilename = $originalFilename;

        return $this;
    }
}
