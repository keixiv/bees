```
- name: internal name
- version: version
- repo: custom repo the plugin is from
- projectRoot: path that contains \<name>.csproj
- git?: git repo if the custom repo has no RepoUrl attribute
- csprojName?: if the csproj file isnt the same as the plugin name
- buildSystem?: for fuckers that only wanna work with msbuild
- extraBuildArgs?: self fucking explanatory
- configuration?: configuration to build with, otherwise "Release"
- noVersionFlags?: skips adding version flags to build
- disabled?: to fuck the plugin
```
