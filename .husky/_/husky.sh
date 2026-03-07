#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky: $1"
    fi
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name hook"

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  export readonly husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"

  if [ "$exitCode" != "0" ]; then
    debug "$hook_name hook failed (exit code $exitCode)"
  fi

  exit "$exitCode"
fi
