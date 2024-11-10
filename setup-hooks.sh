#!/bin/bash
# setup-hooks.sh

echo "Copying commit-msg hook to .git/hooks directory..."
cp .githooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
echo "commit-msg hook has been installed."