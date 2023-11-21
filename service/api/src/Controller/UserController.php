<?php

namespace App\Controller;

use App\Entity\Photo;
use App\Entity\User;
use App\Form\Type\UserType;
use App\Repository\PhotoRepository;
use App\Repository\UserRepository;
use App\Service\FileUploader\FileUploaderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserController extends ApiController
{
    private UserRepository $userRepository;
    private PhotoRepository $photoRepository;

    public function __construct(
        UserRepository $userRepository,
        PhotoRepository $photoRepository
    ) {
        $this->userRepository = $userRepository;
        $this->photoRepository = $photoRepository;
    }

    /**
     * @Route("/api/users/register", name="users_register", methods={"POST"})
     */
    public function register(
        Request $request,
        UserPasswordEncoderInterface $passwordEncoder,
        FileUploaderInterface $fileUploader
    ): JsonResponse {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->submit($request->request->all() + $request->files->all());

        if (!$form->isSubmitted() || !$form->isValid()) {
            return $this->respondValidationError($this->getErrorsFromForm($form));
        }

        /** @var UploadedFile $avatarFile */
        $avatarFile = $form->get('avatar')->getData();
        $avatarUrl = null;

        /** @var UploadedFile[] $photoFiles */
        $photoFiles = $form->get('photos')->getData();
        $photoFilesPathPrefix = $this->getParameter('photos_directory').'/'.md5(uniqid());
        $defaultAvatarUrl = $request->getScheme().'://'.$request->getHttpHost().'/'.User::DEFAULT_AVATAR;

        // store the avatar file if it was uploaded
        if ($avatarFile) {
            try {
                $uploadedAvatarData = $fileUploader->upload(
                    $avatarFile,
                    $this->getParameter('avatar_directory').'/'.md5(uniqid()),
                );
            } catch (FileException $e) {
                return $this->respondValidationError([$e->getMessage()]);
            }

            $avatarUrl = $uploadedAvatarData->getPublicUrl();
        }

        // store the photo files
        foreach ($photoFiles as $photoFile) {
            try {
                $uploadedPhotoData = $fileUploader->upload($photoFile, $photoFilesPathPrefix);
            } catch (FileException $e) {
                return $this->respondValidationError([$e->getMessage()]);
            }

            $photoEntity = new Photo();
            $photoEntity->setName($uploadedPhotoData->getOriginalFilename());
            $photoEntity->setUrl($uploadedPhotoData->getPublicUrl());
            $this->photoRepository->add($photoEntity, false);
            $user->addPhoto($photoEntity);
        }

        // Hash and store the password
        $encodedPassword = $passwordEncoder->encodePassword($user, $user->getPassword());
        $user->setPassword($encodedPassword);
        $user->setAvatar($avatarUrl ?? $defaultAvatarUrl);

        // Persist the user entity to the database
        $this->userRepository->add($user);

        return $this->respondCreated(['success' => sprintf('User %s successfully created', $user->getUsername())]);
    }

    /**
     * @Route("/api/users/login", name="users_login", methods={"POST"})
     */
    public function login(UserInterface $user, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        return $this->json(['token' => $JWTManager->create($user)]);
    }

    /**
     * @Route("/api/users/me", name="users_me", methods={"GET"})
     */
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        return $this->json($user, 200, [], ['groups' => ['user:read']]);
    }
}
