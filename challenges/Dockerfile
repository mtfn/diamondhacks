FROM alpine:latest

USER root
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /
RUN mkdir /resources
COPY ./resources /resources
COPY ./a /

WORKDIR /home/appuser

# RUN apk add linux-headers

RUN apk add --no-cache bash


# Change ownership to the non-root user (if adding files)
# COPY . /app
# RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Default command
CMD ["bash"]

