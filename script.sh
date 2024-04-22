#!/bin/bash
current_branch=$(git rev-parse --abbrev-ref HEAD)
git add .
echo "Введите сообщение коммита"
read commit
git commit -m "$commit"
git checkout task-information-tab
git merge $current_branch
git push origin task-information-tab
