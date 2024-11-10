#!/bin/bash
# setup-hooks.sh

echo "Copying commit-msg hook to .git/hooks directory..."
cp .githooks/commit-msg .git/hooks/commit-msg
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit
echo "commit-msg hook has been installed."