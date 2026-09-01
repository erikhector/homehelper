**PR description**

Describe your pull request (briefly, just enough for a reviewer to know what to look for)

**Before submitting this PR into the default branch, please check the following:**

**General development**

- [ ] Your code builds without any errors or warnings
- [ ] Removed all commented/experiment/temp code

**Frontend development**

- [ ] You have followed our frontend code standards to the best of your abilities: [code standards wiki](https://dev.azure.com/dekiru/Internal/_wiki/wikis/Internal.wiki/305/Kodstandarder-Namnstandarder)
- [ ] UI changes in desktop views are verified on laptop, monitor and tablet resolutions/screens
- [ ] UI changes in mobile views are verified on smaller and larger smartphone resolutions/screens
- [ ] Meets accessiblity standards
- [ ] Made sure to use `formatMessage` for all user-facing text

**Backend development**

- [ ] You have followed our backend code standard
- [ ] You have checked whether or not your changes require a database migration
  - [ ] If yes - You have ensured that accidental loss of data is not an issue
  - [ ] If yes - You have ensured that the migrations are compatible with the current production database
- [ ] You have run `dotnet-format`
- [ ] Potential unhandled exceptions have been covered
- [ ] NuGet packages are up-to-date
- [ ] ~~Tests have been updated and/or added~~ (Not yet)
