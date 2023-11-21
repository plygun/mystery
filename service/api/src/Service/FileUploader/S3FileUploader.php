<?php

namespace App\Service\FileUploader;

use League\Flysystem\FilesystemException;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class S3FileUploader extends AbstractFileUploader
{
    private ParameterBagInterface $params;
    private FilesystemOperator $s3Filesystem;

    public function __construct(
        string $targetDirectory,
        ParameterBagInterface $params,
        FilesystemOperator $s3Filesystem
    ) {
        $this->targetDirectory = $targetDirectory;
        $this->params = $params;
        $this->s3Filesystem = $s3Filesystem;
    }

    /**
     * @throws FileException|FilesystemException
     */
    public function upload(UploadedFile $file, string $pathPrefix = ''): self
    {
        $uploadDir = $this->targetDirectory.($pathPrefix ? '/'.$pathPrefix : '');
        $storedFileName = md5(uniqid()).'.'.$file->guessExtension();
        $this->setOriginalFilename(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $this->setAbsolutePath($uploadDir.'/'.$storedFileName);

        try {
            $fileHandle = fopen($file, 'r');
            $this->s3Filesystem->writeStream($this->absolutePath, $fileHandle, ['visibility' => 'public']);
        } catch (\Exception $e) {
            // Delete files directory in case of error
            try {
                $this->s3Filesystem->deleteDirectory($uploadDir);
            } catch (\Exception $e) {
                // ignore
            }

            throw new FileException('Error uploading file to S3.', 0, $e);
        } finally {
            // Releasing resources
            if (isset($fileHandle) && is_resource($fileHandle)) {
                fclose($fileHandle);
            }
        }

        return $this;
    }

    public function getPublicUrl(): string
    {
        return 'https://'.$this->params->get('aws_s3_bucket_name').'.s3.'.$this->params->get('aws_s3_region')
            .'.amazonaws.com/'.$this->getAbsolutePath();
    }
}
