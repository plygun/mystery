<?php

namespace App\Form\Type;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\All;
use Symfony\Component\Validator\Constraints\Count;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\NotBlank;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $allowedImageMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
        ];

        $builder
            ->add('firstName')
            ->add('lastName')
            ->add('email')
            ->add('password')
            ->add('avatar', FileType::class, [
                'label' => 'Avatar (JPG or PNG file)',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new File([
                        'maxSize' => '2m',
                        'mimeTypes' => $allowedImageMimeTypes,
                        'mimeTypesMessage' => 'Please upload a valid image file',
                    ]),
                ],
            ])
            ->add('photos', FileType::class, [
                'label' => 'Photos (JPG or PNG files)',
                'mapped' => false,
                'multiple' => true,
                'required' => true,
                'constraints' => [
                    new NotBlank(),
                    new Count(['min' => 4]),
                    new All([
                        new File([
                            'maxSize' => '2m',
                            'mimeTypes' => $allowedImageMimeTypes,
                            'mimeTypesMessage' => 'Please upload a valid image files',
                            'maxSizeMessage' => 'The file {{ name }} is too large ({{ size }} {{ suffix }}). ' .
                                'Allowed maximum size is {{ limit }} {{ suffix }}.'
                        ]),
                    ]),
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'csrf_protection' => false,
        ]);
    }
}
