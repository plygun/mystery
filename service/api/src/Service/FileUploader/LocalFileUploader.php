<?php

namespace App\Service\FileUploader;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;

class LocalFileUploader extends AbstractFileUploader
{
    private RequestStack $requestStack;

    public function __construct(string $targetDirectory, RequestStack $requestStack)
    {
        $this->targetDirectory = $targetDirectory;
        $this->requestStack = $requestStack;
    }

    /**
     * @throws FileException
     */
    public function upload(UploadedFile $file, string $pathPrefix = ''): self
    {
        $uploadDir = $this->targetDirectory.($pathPrefix ? '/'.$pathPrefix : '');
        $storedFileName = md5(uniqid()).'.'.$file->guessExtension();
        $this->setOriginalFilename(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $this->setAbsolutePath($uploadDir.'/'.$storedFileName);

        try {
            $file->move($uploadDir, $storedFileName);
        } catch (FileException $e) {
            // delete files directory in case of error
            (new Filesystem())->remove($uploadDir);

            throw $e;
        }

        return $this;
    }

    public function getPublicUrl(): string
    {
        // Get the current request from the request stack
        $currentRequest = $this->requestStack->getCurrentRequest();

        return $currentRequest->getScheme().'://'.$currentRequest->getHttpHost().'/'.$this->getAbsolutePath();
    }
}
