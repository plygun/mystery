<?php

namespace App\Service\FileUploader;

use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBag;
use Symfony\Component\HttpFoundation\RequestStack;

class FileUploaderFactory
{
    private string $uploadServiceType;
    private string $targetDirectory;
    private RequestStack $requestStack;
    private ParameterBag $params;
    private FilesystemOperator $s3Filesystem;

    public function __construct(
        string $uploadServiceType,
        string $targetDirectory,
        RequestStack $requestStack,
        ParameterBag $params,
        FilesystemOperator $s3Filesystem
    ) {
        $this->uploadServiceType = $uploadServiceType;
        $this->targetDirectory = $targetDirectory;
        $this->requestStack = $requestStack;
        $this->params = $params;
        $this->s3Filesystem = $s3Filesystem;
    }

    public function create(): FileUploaderInterface
    {
        if ('local' === $this->uploadServiceType) {
            return new LocalFileUploader($this->targetDirectory, $this->requestStack);
        } elseif ('s3' === $this->uploadServiceType) {
            return new S3FileUploader($this->targetDirectory, $this->params, $this->s3Filesystem);
        } else {
            throw new \LogicException('Invalid UPLOAD_SERVICE parameter value.');
        }
    }
}
