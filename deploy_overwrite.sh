#!/bin/bash

# 1. Initialize Git
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: Abraham Yada Guitar Course Rebranding"

# 4. Set Remote
git remote remove origin 2> /dev/null
git remote add origin https://github.com/abrahamyada24/abraham-guitar-courses.git

# 5. Force Push (Overwrites history)
echo "Overwriting remote repository... please enter credentials if prompted."
git push -u origin main --force
