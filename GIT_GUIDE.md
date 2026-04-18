# Git Version Control Guide

## ✅ Git Setup Complete!

Your Flying Monkey game is now under version control with Git.

## Current Status

- **Repository**: Initialized ✅
- **Version 1.0**: Tagged and committed ✅
- **Branch**: master
- **Latest Commit**: v1.0 with all features

---

## Useful Git Commands

### Check Status
```bash
git status
```
Shows which files have been modified.

### View Commit History
```bash
git log --oneline
```
Shows all commits in a compact format.

### View All Tags
```bash
git tag
```
Lists all version tags (like v1.0).

### Create a New Commit
```bash
git add .
git commit -m "Your commit message here"
```

### Create a New Version Tag
```bash
git tag -a v1.1 -m "Version 1.1 description"
```

### Go Back to Version 1.0
```bash
git checkout v1.0
```
**Warning**: This puts you in "detached HEAD" state. To go back to latest:
```bash
git checkout master
```

### Create a New Branch for Experiments
```bash
git checkout -b experimental-features
```
Work on new features without affecting master branch.

### Switch Back to Master Branch
```bash
git checkout master
```

### See Differences
```bash
git diff
```
Shows what changed in your files.

---

## Recommended Workflow for New Changes

1. **Before making changes**, create a new branch:
   ```bash
   git checkout -b feature-name
   ```

2. **Make your changes** to the code

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **If you like the changes**, merge back to master:
   ```bash
   git checkout master
   git merge feature-name
   ```

5. **If you don't like the changes**, just switch back to master:
   ```bash
   git checkout master
   ```
   Your master branch remains unchanged!

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `git status` | Check what's changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes with a message |
| `git log` | View history |
| `git tag` | List version tags |
| `git checkout v1.0` | Go to version 1.0 |
| `git checkout master` | Go back to latest |
| `git branch` | List all branches |
| `git checkout -b name` | Create new branch |

---

## Your Current Version 1.0 Includes

✅ Monkey emoji character (🐵)
✅ Intro message
✅ Bonus collectibles (🍼)
✅ Sound effects (pass, collect, game over)
✅ Complete gameplay mechanics
✅ Score tracking and best score

---

## Need Help?

- Run `git status` to see what's changed
- Run `git log` to see your commit history
- You can always go back to v1.0 with `git checkout v1.0`

**Happy coding!** 🚀
