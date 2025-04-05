FROM alpine:latest

# Install minimal tools (optional)
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Default command
CMD ["bash"]

