#!/bin/bash
if [ -z "$1" ]; then
echo "Сообщение: $0 <Сообщение коммита>"
exit 1
fi
current_branch=$(git rev-parse --abbrev-ref HEAD)
git add .
git commit -m "$commit"
git checkout task-information-tab
git merge $current_branch
git push origin task-information-tab
