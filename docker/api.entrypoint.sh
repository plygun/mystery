#!/bin/bash

set -a
source bootstrap-helper.sh
source .env

if [ -f .env.local ]; then
    source .env.local
fi

set +a

# only in local environment because app volume mounting will remove "vendor" directory,
# awaiting db, redis services etc.
if [ "$APP_ENV" == "dev" ]; then
    check_env_vars_are_set DB_PORT DB_HOST

    apk add --no-cache netcat-openbsd

    log "Installing Composer dependencies"
    run_as_user www-data composer install --optimize-autoloader --no-interaction

    # pause until the database container is ready
    while ! nc -z -v "$DB_HOST" "$DB_PORT";
        do
            log "Waiting for db service"
            sleep 1;
        done;

    # pause until the cache container is ready
#    while ! nc -z -v cache "$REDIS_PORT";
#        do
#            log "Waiting for cache service"
#            sleep 1;
#        done;
fi

# run migrations
run_as_user www-data bin/console doctrine:migrations:migrate --no-interaction
run_as_user www-data bin/console lexik:jwt:generate-keypair --overwrite --no-interaction

exec supervisord -c /etc/supervisord.conf