# Group-8-COP4331-Large-Project

|Name|Role|
|----|----|
|Blake Lochmandy|Team Lead|
|Alexander Slort|Database/API|
|Leonie Alexandra|API/Front-End (Mobile)|
|Kenny Dao|Front-End (Mobile)|
|Samuel Georgis|API/Front-End (Web)|
|Hunter Smith|Front-End (Web)|


# Git Command Cheat Sheet

Before doing anything on Git, it is best to make sure you have checked out the correct branch and are basing on the correct branch

- Enter into the command line `git branch` this will show what your current branch is marked with the `*` symbol
- It is a good rule of thumb to base most changes off of **main** which is the **main** repository that the sudo-finished code will reside in


## Common Commands

- `git branch` Shows the available branches and your current branch
- `git checkout "your-specific-branch name"` Checks out the specified branch
    - NOTE: By doing `git checkout -b "new-branch_name"` you create a branch and `git checkout -D "branch-name"` you delete a branch
    - SECOND NOTE: Create branch names without spaces and make the titles meaningful (this will be helpful not only for this project but in industry) (also goes for commit messages but those you have a little more leeway with but still best to add meaningful, short, messages about the nature of the commits)
        - Examples:
            - Don`t: "My branch to work on"
            - Do: "Completed_Contribution_HTML_and_Finish_LogIn_JavaScript"
            - Don`t: "Branch_That_Does_Something"
            - Do: "Added_Rework_To_API"
- `git pull` Pulls the most recently committed changes on a branch (Use frequently whenever you branch a branch off of main)
- `git add "specific-file.file"` Add your staged changes to your branch (Add all the files that you want to permanently add to your branch here)
- `git commit "whatever-message-you-have"` Commits your changes to your respective branch
- `git push` Pushes your changes on your branch to the actual website of GitHub.com


## Merging

Question: Why do I need to merge?
Answer: When a new branch gets merged to the **main** new changes are added to the repository that your branch may not have.
Follow-up Question: What if I think that my branch already has the changes?
Follow-up Answer: Do it anyway.

### ***Step to follow***
- Make sure that all changes to your specific branch are commited
- Firstly, type `git checkout main` then `git pull` to pull the newest changes to **main** to your local computer
- Then, `git checkout "my-branch-that-is-getting-merged-with-master"` going back to your branch
- Type, `git merge main` this will essentially merge the two branches together (this is good and probably will be the long part of this)
- Now you must go through the code and resolve the code of merge conflicts (essentially when git cannot tell what changes you want from a specific branch)
- When you complete fixing the merge conflicts, type `git add "my-files.file"` then `git commit "my-funny-little-message"` which will then commit the changes to your branch
- Last Step Optional: `git push` will push the changes to the GitHub.com repo on your specific branch
- Last Last all-else fails Step: Google your problems
