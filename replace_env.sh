#!/bin/sh

# Используем `envsubst` для замены переменных окружения в index.html
envsubst '\$API_URL \$VUE_APP_OAUTH_REDIRECT_URI \$VUE_APP_OAUTH_CLIENT_ID \$VUE_APP_OAUTH_AUTH_HEADER \$VUE_APP_OAUTH_URL' < /app/public/index.html > /app/public/index.html.tmp && mv /app/public/index.html.tmp /app/public/index.html

# Запустим Nginx
exec "$@"