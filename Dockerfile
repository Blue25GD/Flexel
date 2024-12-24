# syntax=docker/dockerfile:1
# check=error=true

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t flexel .
# docker run -d -p 80:80 -e RAILS_MASTER_KEY=<value from config/master.key> --name flexel flexel

# For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.3.6
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Install base packages including OpenSSL for SSL certificate generation
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips sqlite3 openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build gems
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Precompiling assets for production without requiring secret RAILS_MASTER_KEY
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

RUN bin/rails credentials:edit

RUN bin/rails db:migrate
RUN bin/rails db:seed

# Final stage for app image
FROM base

# Copy built artifacts: gems, application
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

# Generate a self-signed SSL certificate that expires in 10 years (3650 days)
RUN mkdir -p ./ssl && \
    openssl req -x509 -nodes -days 30 -newkey rsa:2048 -keyout ./ssl/selfsigned.key -out ./ssl/selfsigned.crt \
    -subj "/C=XX/ST=State/L=City/O=Flexel/OU=IT/CN=localhost"

# Run and own only the runtime files as a non-root user for security
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp config ssl

USER 1000:1000

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Configure the Rails server to use SSL
# Expose ports for both HTTP and HTTPS
EXPOSE 3000

# Set up the SSL certificate and key environment variables for Rails
CMD ["./bin/thrust", "./bin/rails", "server", "-b", "ssl://0.0.0.0:3000?key=./ssl/selfsigned.key&cert=./ssl/selfsigned.crt"]
#CMD ["./bin/thrust", "./bin/rails", "server", "-b", "http://0.0.0.0:3000"]