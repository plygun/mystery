<?php

namespace App\Command;

use App\Event\UserGreetingEmailSentEvent;
use App\Repository\UserRepository;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class SendNewslettersCommand extends Command
{
    protected static $defaultName = 'send:newsletters';
    protected static $defaultDescription = 'Sending an email to all active users created in the last week';

    private UserRepository $userRepository;
    private MailerInterface $mailer;
    private EventDispatcherInterface $eventDispatcher;
    private string $fromEmail = 'mystery_company@example.com';
    private string $fromName = 'Mysterious Company';
    private string $subject = 'Your best newsletter';
    private string $text = <<<EOT
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id interdum nibh. Phasellus blandit tortor 
in cursus convallis. Praesent et tellus fermentum, pellentesque lectus at, tincidunt risus. Quisque in 
nisl malesuada, aliquet nibh at, molestie libero.
EOT;

    public function __construct(
        UserRepository $userRepository,
        MailerInterface $mailer,
        EventDispatcherInterface $eventDispatcher
    ) {
        parent::__construct();
        $this->userRepository = $userRepository;
        $this->mailer = $mailer;
        $this->eventDispatcher = $eventDispatcher;
    }

    protected function configure(): void
    {
        $this
            ->setDescription(self::$defaultDescription)
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Dry run')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $users = $this->userRepository->createdLastWeek()->getQuery()->getResult();
        $count = count($users);

        // If the dry-run option is passed, the command will not send any emails (for debug purposes)
        if ($input->getOption('dry-run')) {
            $io->note('Dry mode enabled');
        } else {
            $from = new Address($this->fromEmail, $this->fromName);

            foreach ($users as $user) {
                $this->sendMailTo($from, new Address($user->getEmail()));

                $this->eventDispatcher->dispatch(new UserGreetingEmailSentEvent($user));
            }
        }

        if (0 === $count) {
            $logMessage = 'No new users created in the last week.';
        } else {
            $logMessage = sprintf('Sent greetings email to new %d user'.($count > 1 ? 's' : '').'.', $count);
        }

        $io->success($logMessage);

        return 0;
    }

    /**
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    private function sendMailTo(Address $from, Address $to)
    {
        $email = (new Email())
            ->from($from)
            ->to($to)
            ->subject($this->subject)
            ->text($this->text);

        $this->mailer->send($email);
    }
}
