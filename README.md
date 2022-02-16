# inertia

## Committing rules
- no commits must directly be made to the `main` branch.
- `main` is updated by creating merge requests for feature branches
- each feature should be worked on in a different branch
- each commit must begin with `component: `. For example the commit message that modifies the backend will be: `backend: Initial Commit`. Keep the component names consistent (use `webapp`, `desktopapp`, `backend`) 
- the commits in a feature branch must only modify a single component at a time
- no rebasing is allowed.
- force pushing and reverting to previous commits should be avoided 
- after a feature branch is done, a merge request must be created
- keep the commit history clean - especially on branches that are not to be squash merged
- executable, or other compilation artifacts **MUST NOT** be commited
- keep `.gitignore` updated with files that should be excluded (i.e. compilation artifacts)
- by committing any code you agree to signing up your soul away to me