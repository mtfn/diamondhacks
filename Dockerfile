FROM alpine:latest

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

RUN apk add --no-cache bash

# Change ownership to the non-root user (if adding files)
# COPY . /app
# RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Default command
CMD ["bash"]

