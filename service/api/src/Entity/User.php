<?php

namespace App\Entity;

use App\Entity\Contracts\HasTimestamps;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @UniqueEntity("email", message="Email already exists")
 * @ORM\HasLifecycleCallbacks()
 */
class User implements HasTimestamps, UserInterface
{
    use Traits\TimestampableEntity;

    public const DEFAULT_AVATAR = 'uploads/avatar/default.png';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups("user:read")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=25)
     * @Assert\NotBlank()
     * @Assert\Length(min=2, max=25, allowEmptyString=false)
     * @Groups("user:read")
     */
    private string $firstName;

    /**
     * @ORM\Column(type="string", length=25)
     * @Assert\NotBlank()
     * @Assert\Length(min=2, max=25, allowEmptyString=false)
     * @Groups("user:read")
     */
    private string $lastName;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(min=5, max=50, allowEmptyString=false)
     * @Groups("user:read")
     */
    public string $fullName;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\NotBlank()
     * @Assert\Email()
     * @Assert\Length(max=255, allowEmptyString=false)
     * @Groups("user:read")
     */
    private string $email;

    /**
     * @ORM\Column(type="string", length=60)
     * @Assert\NotBlank()
     * @Assert\Length(min=6, max=50, allowEmptyString=false)
     * @Assert\Regex(pattern="/\d+/", message="Password must contain at least one number")
     */
    private string $password;

    /**
     * @ORM\Column(type="boolean", options={"default": true})
     * @Assert\Type("bool")
     */
    private bool $active = true;

    /**
     * @ORM\Column(type="boolean", options={"default": false})
     * @Assert\Type("bool")
     */
    private bool $greetingEmailSent = false;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Assert\Url()
     * @Groups("user:read")
     */
    private string $avatar;

    /**
     * @ORM\OneToMany(targetEntity=Photo::class, mappedBy="user", cascade={"persist"}, orphanRemoval=true)
     * @Groups("user:read")
     */
    private Collection $photos;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFullName(): ?string
    {
        return $this->fullName;
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function setFullName(): self
    {
        $this->fullName = $this->firstName.' '.$this->lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getGreetingEmailSent(): ?bool
    {
        return $this->greetingEmailSent;
    }

    public function setGreetingEmailSent(bool $greetingEmailSent): self
    {
        $this->greetingEmailSent = $greetingEmailSent;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(string $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
    }

    /**
     * @return Collection<int, Photo>
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(Photo $photo): self
    {
        if (!$this->photos->contains($photo)) {
            $this->photos[] = $photo;
            $photo->setUser($this);
        }

        return $this;
    }

    public function removePhoto(Photo $photo): self
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getUser() === $this) {
                $photo->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return string[]
     */
    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function getUsername(): string
    {
        return $this->email;
    }

    /**
     * @return void
     */
    public function eraseCredentials()
    {
    }
}
