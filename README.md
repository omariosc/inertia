# inertia

## Interim Deliverables

The full interim deliverable specification list is listed [here](https://gitlab.com/sc20aim/inertia/-/wikis/interim) with hyperlinks to all links in the Wiki. It is recommended for any assessors reading this to follow those hyperlinks to make sure everything listed in the specification has been included in the repository.

## Notes

- The directory structure of the repository could be considered like a storage location containing all important files to the project as well as all the code
- The issues are for us to organize work
- Issue board consists of lists on each priority, in progress, merge requests and completed
- Issues are closed once merged to main
- Backlog issues may have A/B/C/D after the ID number:
  * A | Customer Interface
  * B | Employee Interface
  * C | Manager Interface
  * D | Backend

## Committing rules

- no commits must directly be made to the `main` branch (except for maintainer work)
- `main` is updated by creating merge requests for feature branches
- each feature should be worked on in a different branch
- each commit must begin with `component: `. For example the commit message that modifies the backend will be: `backend: Initial Commit`. Keep the component names consistent (use `ui-customer`, `ui-staff`, `backend`, `docs`) 
- the commits in a feature branch must only modify a single component at a time
- no rebasing is allowed.
- force pushing and reverting to previous commits should be avoided 
- after a feature branch is done, a merge request must be created
- keep the commit history clean - especially on branches that are not to be squash merged
- executable, or other compilation artifacts **MUST NOT** be commited
- keep `.gitignore` updated with files that should be excluded (i.e. compilation artifacts)
