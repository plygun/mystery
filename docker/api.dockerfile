FROM php:7.4.33-fpm-alpine
WORKDIR /app

COPY service/api /app
COPY docker/config/nginx/ /etc/nginx/
COPY docker/config/php/php.ini /usr/local/etc/php/
COPY docker/config/supervisord-api.ini /etc/supervisor.d/supervisord.ini
COPY docker/api.entrypoint.sh docker/bootstrap-helper.sh /usr/local/bin/

RUN apk update && \
    apk add --no-cache nginx bash coreutils shadow tzdata libintl \
        libmcrypt libmcrypt-dev curl-dev supervisor mysql-client sudo && \
    apk del icu-dev libmcrypt-dev && \
    docker-php-ext-install pdo_mysql && \
    mkdir -p /etc/nginx/ssl && \
    # creating SSL certificate for Nginx https connections
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
      -subj "/C=DE/ST=Nuremberg/L=Nuremberg/O=mystery/OU=localhost/CN=localhost" && \
    # change UIDs for www-data user and group, change home and work directory's ownership
    usermod -u 1000 www-data && \
    groupmod -g 1000 www-data && \
    chown --silent --no-dereference --recursive www-data:www-data /home/www-data /app && \
    # install, configure Composer and it's dependencies
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/bin --filename=composer --version=2.6.3 && \
    sudo -u www-data composer install --no-dev --no-scripts --no-progress --optimize-autoloader --quiet --no-interaction && \
    # cron setup
    echo "0 */18 * * * sudo -E -u www-data php /app/bin/console send:newsletters >> /dev/null 2>&1" >> /etc/crontabs/root

CMD ["api.entrypoint.sh"]
