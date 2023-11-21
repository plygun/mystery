<?php

namespace App\EventSubscriber;

use App\Event\UserGreetingEmailSentEvent;
use App\Repository\UserRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserSubscriber implements EventSubscriberInterface
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public static function getSubscribedEvents()
    {
        return [
            UserGreetingEmailSentEvent::class => 'onGreetingEmailSent',
        ];
    }

    /**
     * Update user.greeting_email_sent field after greeting email sent.
     */
    public function onGreetingEmailSent(UserGreetingEmailSentEvent $event)
    {
        $user = $event->getUser();
        $user->setGreetingEmailSent(true);
        $this->userRepository->update($user);
    }
}
