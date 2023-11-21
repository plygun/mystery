<?php

namespace App\Entity\Contracts;

use DateTime;

/**
 * Interface HasTimestamps.
 */
interface HasTimestamps
{
    public function getCreatedAt(): ?DateTime;

    public function setCreatedAt(): self;

    public function getUpdatedAt(): ?DateTime;

    public function setUpdatedAt(): self;
}
