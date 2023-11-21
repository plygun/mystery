#!/bin/bash

log() {
    echo "$1"
}

log_error() {
    log "$1" >&2
}

# run specific command with arguments as user different from root user
run_as_user() {
    first_arg="$1"
    shift

    # run either "sudo", either "su" tool. "sudo" is preferable if it's installed in OS
    if [ -n "$(which sudo)" ]; then
        sudo -EH -u "$first_arg" "$@"
    else
        if [ -n "$(which su)" ]; then
            su -- "$first_arg" -c "$*"
        else
            log_error "Neither 'sudo' nor 'su' tool was found"
            exit 1
        fi
    fi
}

# check environment variables are set
check_env_vars_are_set() {
    for var in "$@"; do
        if [ -z "$(env | awk -v pattern="^$var=" -F "=" '$0~pattern{print $2}')" ]; then
            log_error "$var env var is not set or empty"
            exit 1
        fi
    done
}
