# Repository rules

Configure two GitHub rulesets after the CI workflow has run at least once, so its `Quality gate` status check is available for selection.

## `develop` integration branch

- Require a pull request before merging.
- Do not require approvals while NOVIA has only one maintainer; the author cannot approve their own pull request.
- Require conversation resolution.
- Require the `Quality gate` status check and require the branch to be up to date.
- Block force pushes and branch deletion.
- Require linear history.
- Allow squash merging and delete feature branches after merge.

Feature branches must start from `develop` and use the `feature/` prefix.

## `master` production branch

- Require a pull request before merging.
- Require conversation resolution.
- Require the `Quality gate` and `Production source` status checks.
- Block force pushes and branch deletion.
- Require linear history.

The CI workflow permits pull requests into `master` only when their source branch is `develop`. Deployments can be added later, but should run only after this production gate succeeds.
