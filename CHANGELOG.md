# rimfrost-portal-handlaggare changelog

Changelog of rimfrost-portal-handlaggare.

## 0.3.1 (2026-09-15)

### Bug Fixes

-  namespace the runtime-config global per app ([9d434](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9d434381ab3c516) LisaWedin_Ductus)  

### Other changes

**Update package.json**


[a7bc3](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a7bc34afd893800) LisaWedin-Ductus *2026-09-15 10:36:44*

**Rename project from rimfrost-fe to rimfrost-portal-handlaggare**


[9c918](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9c918e21ab32159) LisaWedin-Ductus *2026-09-15 10:36:22*


## 0.3.0 (2026-09-14)

### Features

-  let a case worker hand back an assigned task (FKPOC-1009) ([22053](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/22053de75a81ab2) julolsso)  
-  gör teamets uppgifter till en tabell i huvudytan (FKPOC-1013) ([fafdb](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/fafdb106e5c6e88) LisaWedin_Ductus)  
-  visa teamets uppgifter i en egen vy (FKPOC-1013) ([05ac0](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/05ac0bf79013b88) LisaWedin_Ductus)  
-  visar kvarstående toast vid uppgifter borttagna av behörighetsskäl ([8b65e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/8b65e087ff6d31d) LisaWedin_Ductus)  
-  adds temporary console log with sid status when opening task ([7e97a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/7e97ad8c41e2be0) LisaWedin_Ductus)  
-  adds krav file ([7d9d4](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/7d9d4fbab93efdc) LisaWedin_Ductus)  
-  updates for be token changes ([7c970](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/7c970aab597c754) LisaWedin_Ductus)  
-  cant press ok without a choosen handlaggare AND passcode ([0c634](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0c6347e70ebdfb6) julolsso)  
-  changes after feedback from last pr login features/startpage ([8a96a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/8a96aca4461dc57) julolsso)  
-  added login features and a start page for before logging in ([923a6](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/923a67f83cd8445) julolsso)  
-  add env development handling and updates readme ([fa497](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/fa497c98d2080e3) LisaWedin_Ductus)  
-  adds documentation in readme ([9043a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9043aa23054d1ec) LisaWedin_Ductus)  
-  adds playwright e2e testing ([6cc4b](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/6cc4b00098e173b) LisaWedin_Ductus)  
-  adds unit testing ([977ea](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/977ea884ae813b9) LisaWedin_Ductus)  
-  registers correct names and updates the loading structure ([7074c](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/7074c6c01a6208c) LisaWedin_Ductus)  
-  added button ladda template MFE ([d991a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d991a36652dce83) julolsso)  
-  resolved merge conflict ([e8980](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e8980b88cb90a54) julolsso)  
-  changes remote registry to runtime capable via bff ([c6e35](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/c6e358aca044bd6) LisaWedin_Ductus)  
-  add template MFE button and federation config ([0abfc](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0abfcbbdb92a22e) julolsso)  
-  migrates to module federations vite package ([f84df](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/f84df9f2dbecd12) LisaWedin_Ductus)  
-  added utility when handlaggare hasnt loaded ([085d6](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/085d6ed35125a68) julolsso)  
-  updates paths for backend changes, puts ids on body to bff instead of path ([a8c96](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a8c961f1e4a19a1) LisaWedin_Ductus)  
-  changes env handling from script to loose config file for openshift usage ([97d58](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/97d582878603fa6) LisaWedin_Ductus)  
-  add success field to task-done event ([cde51](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/cde51154e0b6d0b) Jorgen Lindstrom)  
-  functionality when there are no tasks found ([8f79d](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/8f79d6a95ad33e7) julolsso)  
-  add error handling, store-driven handlaggare id and task list updates ([ce493](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/ce49350baebd759) Jorgen Lindstrom)  
-  add handlaggare dropdown with store and bff endpoint ([fb654](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/fb6541bcda0053f) Jorgen Lindstrom)  
-  add handlaggare dropdown with store and bff endpoint ([35e32](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/35e32ffdb81838e) Jorgen Lindstrom)  
-  addera federation.d.ts typ deklaration och bekraftabeslut rout ([33eae](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/33eaedae93df0c7) Jorgen Lindstrom)  
-  changes loading of modules ([2d86c](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/2d86c4bed9dffcf) LisaWedin_Ductus)  
-  removes old mock data, updates endpoints, removes ref in util function ([9d732](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9d7327602e552d2) LisaWedin_Ductus)  
-  added loaders for Oppnaduppg. and Uppglista ([5276e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5276e2bc4fb460c) julolsso)  
-  transform changes fe->be ([bc0af](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/bc0af34ebeff9f0) julolsso)  
-  updates dynamic import ([757f1](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/757f117b4b7fc9b) LisaWedin_Ductus)  
-  updates the dynamic remote module loading ([a947e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a947e30645ac6c0) LisaWedin_Ductus)  
-  removes unused files and tweaks env use ([47308](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/47308805dfc190b) LisaWedin_Ductus)  
-  adds util file to load remote modules with MF and complete URLs ([202a1](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/202a10d8ce96f31) Lisa Wedin)  
-  rewrites oul functions to use the (undeployed) bff with fallback mock data, generates readme ([330d2](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/330d21c5758cd3a) Lisa Wedin)  

### Bug Fixes

-  log in inside gotoPortal, extend e2e coverage to all BFF endpoints and both real MFEs ([408b3](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/408b32146027535) LisaWedin_Ductus)  
-  make the main content area scrollable, not just the nav list ([8b03d](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/8b03d0a9ac87768) LisaWedin_Ductus)  
-  show uppgiftId, not handlaggningId, in the nav list label ([9650f](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9650f19a8f8ace8) LisaWedin_Ductus)  
-  let OK close the login modal when no handläggare are available ([635b9](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/635b9bdf73a87f1) LisaWedin_Ductus)  
-  route uppgifter by uppgiftId instead of handlaggningId (FKPOC-1022) ([0b9b5](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0b9b533c5579238) LisaWedin_Ductus)  
-  fix tests ([84543](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/84543675b1b778d) LisaWedin_Ductus)  
-  adds better error handling ([b9843](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b98439f9f2bf77c) LisaWedin_Ductus)  
-  adds layout classes ([f8a0a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/f8a0a581d70fcb4) LisaWedin_Ductus)  
-  adds public to constructor ([6954f](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/6954f9338ca12e4) LisaWedin_Ductus)  
-  persist login and minor bug fixes ([b355a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b355a877c608e00) LisaWedin_Ductus)  
-  build error fix. feature/FKPOC830 was merged even though it has build errors ([bac93](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/bac931eb7041096) julolsso)  
-  changes to spell nebulosa right ([b3af4](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b3af49b3163fb28) julolsso)  
-  test fix ([89631](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/89631eaf878e710) LisaWedin_Ductus)  
-  adds missing comma ([3d20f](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/3d20f5d0c1a910d) LisaWedin_Ductus)  
-  updates gitignore to exclude diagnostic test files ([c7251](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/c7251d44e03b58b) LisaWedin_Ductus)  
-  makes paths relative ([edb9a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/edb9ad5f3f67218) LisaWedin_Ductus)  
-  excludes test files from linting ([75516](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/75516702a031f4e) LisaWedin_Ductus)  
-  pushar till Lisa (sorri) ([45c3d](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/45c3da34c724c5d) julolsso)  
-  error handling ([8d9da](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/8d9dacf0a5d1ef2) LisaWedin_Ductus)  
-  remove error toast from task-done handler ([a5d4a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a5d4a51005033a4) Jorgen Lindstrom)  
-  adds back handler change functionality ([5005f](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5005f14014f20ff) LisaWedin_Ductus)  
-  updates with BE changes, adds pure optimistic removal of tasks on task done press ([6141d](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/6141d5deca0252a) LisaWedin_Ductus)  
-  import uppgiftListaStore to resolve missing store reference in App.vue ([de855](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/de85589401038fc) Jorgen Lindstrom)  
-  remove logout option and use rem units for navigation offset ([e1b8e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e1b8e2de97b93f8) Jorgen Lindstrom)  
-  updates UppgiftLista properly on Hämta ny uppgift press ([08aab](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/08aab1388957d45) LisaWedin_Ductus)  
-  handles update of portal when a task is done ([7fa54](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/7fa5465eea9433d) LisaWedin_Ductus)  
-  merging conflict ([64639](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/646390f684b6f1e) Jorgen Lindstrom)  
-  fixed the correct spelling ([95840](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9584033bf5f8f8c) julolsso)  
-  rout-manifest ([a6ec2](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a6ec24ece062bfe) Jorgen Lindstrom)  
-  removes example remote component used for demo ([b35c0](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b35c0b605652ffe) LisaWedin_Ductus)  
-  adjusted the hight of loaders for Oppnaduppg. and Uppglista and deleted the delay ([4c5d9](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/4c5d92c9bd3324e) julolsso)  
-  updated loaders for Oppnaduppg. and Uppglista ([d06cf](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d06cfc6d73d8612) julolsso)  
-  removes unused vars ([99fca](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/99fca6a160603e6) LisaWedin_Ductus)  
-  added dot to readme to test ([86465](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/8646533b8330532) julolsso)  
-  merge with dev ([e9270](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e9270d47fe572dc) Lisa)  
-  changes path string to url to match backend ([29f2a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/29f2a0ac6e34e25) Lisa)  
-  removes redundant proxy ([96070](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/96070e8882b2292) Lisa)  
-  changes the mock to only handle uppgifter and changes the proxy address ([fe118](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/fe118b6b0508b6e) Lisa)  
-  adds changes for micro fe bff, wip ([b85e6](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b85e63360cbc5a4) Lisa Wedin)  
-  merge ([3a87e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/3a87ee3fa0f7f56) Lisa Wedin)  

### Other changes

**Merge branch 'development' into fix/FKPOC-1022-duplicate-uppgift-assignment**

* # Conflicts: 
* #	src/components/HuvudytaUppgift.vue 

[a1259](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a12591b82b4f2e2) LisaWedin_Ductus *2026-09-10 05:48:02*

**Update docs/krav.md**

* Co-authored-by: Ulf Slunga &lt;98820233+UlfSlunga-Sinetiq@users.noreply.github.com&gt; 

[35c32](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/35c32ea16d3107a) LisaWedin-Ductus *2026-08-13 08:07:13*

**Merge branch 'development' into feat/FKPOC-766-e2e-testing-implementation**


[b2e1b](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b2e1b9d08f621cc) LisaWedin-Ductus *2026-05-18 14:11:14*

**Merge branch 'development' into feat/FKPOC-766-e2e-testing-implementation**


[90bb7](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/90bb7bf24ebec9a) LisaWedin-Ductus *2026-05-18 12:42:28*

**Merge branch 'development' into feature/FKPOC-719**


[99c9d](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/99c9de15a649ce6) julolsso *2026-05-08 08:38:05*

**Bump version from 0.2.2 to 1.0.0**


[03937](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/03937a83c68d97c) LisaWedin-Ductus *2026-05-05 05:36:34*

**Bump version from 0.2.2 to 1.0.0**


[d7934](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d79346664f7ddbf) LisaWedin-Ductus *2026-05-05 05:36:17*

**wip**


[87ebc](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/87ebc9c77add212) LisaWedin_Ductus *2026-04-08 10:55:46*

**Merge branch 'development' into feat/FKPOC-508-handlaggare-dropdown**


[10a23](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/10a235af923d229) JorgenDuctus *2026-04-08 08:56:26*

**Merge branch 'development' into feat/FKPOC-508-handlaggare-dropdown**


[12abf](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/12abf0d9a5ed25b) Jorgen Lindstrom *2026-04-01 11:20:00*

**Merge branch 'development' into feat/FKPOC-457-VABo-prep**


[f83b3](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/f83b3f06615e7d7) LisaWedin_Ductus *2026-03-12 14:40:41*

**Merge branch 'development' into feat/FKPOC-457-VABo-prep**


[0aec4](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0aec4f32a9e9285) LisaWedin_Ductus *2026-03-11 07:42:43*

**wip**


[2a580](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/2a5804e34d5cc85) LisaWedin_Ductus *2026-03-11 07:02:56*

**wip**


[5b59a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5b59ad1f6baf7bb) LisaWedin_Ductus *2026-03-10 12:37:57*

**Merge branch 'development' of https://github.com/Forsakringskassan/rimfrost-portal-handlaggare into development**


[a7864](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/a786485e29cd978) Lisa *2026-02-06 09:59:07*

**updates readme**


[7119a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/7119aadf179b564) Lisa *2026-02-06 09:58:52*


## 0.2.2 (2026-01-22)

### Bug Fixes

-  stegar version för ny dockerfile ([1bdc6](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/1bdc6cc827e2ae0) hannahanen)  

## 0.2.1 (2026-01-22)

### Bug Fixes

-  bumpar version med ny dockerfil ([0fcf8](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0fcf8f214fcc1d9) hannahanen)  

## 0.2.0 (2026-01-22)

### Features

-  bumpar version ([47e2b](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/47e2bbdb1f2eabf) hannahanen)  

## 0.1.1 (2026-01-22)

### Bug Fixes

-  uppdaterar Pom med version ([5c049](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5c0490cedbd3e7f) hannahanen)  

### Other changes

**Update package.json**


[08cca](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/08ccab19fff88df) hannahanen *2026-01-21 14:36:10*

**testing changelog version**


[e22e0](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e22e0b53aaa016d) LisaWedin-Ductus *2026-01-21 14:17:45*

**adds dist to build**


[5d0ba](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5d0ba7a2511a458) Lisa Wedin *2026-01-21 14:01:35*

**Update and rename bundle-app-npm-ci.yaml to bundle-app-npm-ci-runtime-env.yaml**


[35ca5](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/35ca5690f40cc92) hannahanen *2026-01-21 13:56:01*

**ups version**


[035e3](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/035e3945018a54c) LisaWedin-Ductus *2026-01-21 13:22:03*


## 0.1.0 (2026-01-21)

### Features

-  rewrites env injection for FE and adds description for starting with runtime envs in readme ([48bbf](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/48bbf81ad6cb35e) Lisa Wedin)  
-  adds runtime envs injectible in command line run of image ([47166](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/4716629b1265a13) Lisa Wedin)  

### Bug Fixes

-  adds module declarations for module federation ([e1322](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e13226f19b305d1) Lisa Wedin)  
-  removes unused function ([420ca](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/420caaf72662097) Lisa Wedin)  
-  ups version ([37013](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/370133340aedf5d) Lisa Wedin)  
-  merge main into branch ([de24f](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/de24f37cf58da45) Lisa Wedin)  

## 0.0.2 (2026-01-20)

### Bug Fixes

-  replaces hard coded url values with envs ([741e2](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/741e2747146fe4f) Lisa Wedin)  

### Other changes

**Ups version**


[58230](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5823026cde7b567) LisaWedin-Ductus *2026-01-20 07:36:25*


## 0.0.1 (2026-01-19)

### Features

-  places host application in root and creates docker/nginx configuration files ([10cc9](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/10cc93a0e5c3b7e) Lisa Wedin)  
-  removes mock data, sets up MF ([57252](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5725208a2fd1bfa) Lisa Wedin)  
-  connects host and remote app with module federation ([0250e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0250e15fcb43790) Lisa Wedin)  
-  adds casting from snake case to camel case and fixes radio buttons ([2fe98](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/2fe98979ccfd1e2) Lisa Wedin)  
-  fetches task from regel in the micro frontend ([39468](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/39468997b1414fe) Lisa Wedin)  
-  fetches uppgift from oul in BE on hamta ny uppgift instead of mocked uppgift ([e9f19](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e9f194886690a4d) Lisa Wedin)  
-  gets assigned tasks from BE instead of mock part one ([d8244](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d8244064768d071) Lisa Wedin)  
-  adds some comments describing the tasks to come ([61651](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/616515e03654edb) Lisa Wedin)  
-  changes custom navigation to FK design system navigation menu ([91998](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/91998ab31ab08b4) Lisa Wedin)  
-  adds mocked OUL ([cc75f](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/cc75f05352af6db) Lisa Wedin)  
-  adds ny uppgift button and fixes side nav layout ([9f3f9](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9f3f9fb28502265) Lisa Wedin)  
-  update types in logic ([0a161](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/0a161d6f09341ef) Lisa Wedin)  
-  adds types from regel manuell rtf ([25898](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/25898e7883cb606) Lisa Wedin)  
-  adds error message and radio group container styling ([14aca](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/14aca61412d0d06) Lisa Wedin)  
-  adds validation to radio button fields ([d2e82](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d2e8277586db28f) Lisa Wedin)  
-  adds save button and logs the -saved- object ([3c8dc](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/3c8dc4be88fe4c9) Lisa Wedin)  
-  finds a way to include css into container - scoped styles did not import before ([61f39](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/61f391b1267f0a7) Lisa Wedin)  
-  adds pinia, adds tabs for arbetsgivare-folkbokforing, updates mock data ([9ea1e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/9ea1e2084e482d7) Lisa Wedin)  
-  sends ID from container to load info in the fetched URL, renames all arende to uppgift ([86521](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/86521627d7e2afe) Lisa Wedin)  
-  sprucing up styling to prepare for demo ([71748](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/717485a391407c1) Lisa Wedin)  
-  creates packages based on FK poc for mounting sub applications, creates mock data to load ([6269b](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/6269b53bfb8eb89) Lisa Wedin)  

### Bug Fixes

-  moves workflow files ([ff569](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/ff569e63a277739) LisaWedin-Ductus)  
-  copies workflow docker file for temporary local testing ([cbc6d](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/cbc6d55d967e491) Lisa Wedin)  
-  adds version and changes package name ([f6a39](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/f6a392770bc649e) Lisa Wedin)  
-  more stuff ([b0324](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b0324c9fe8cac2e) Lisa Wedin)  
-  updates mock kunduppgifter to match the type and changes the radio buttons accordingly ([97d13](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/97d1388a84b85d6) Lisa Wedin)  
-  bugfixing before demo ([83d79](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/83d7961ea0fec6f) Lisa Wedin)  
-  adds comment ([5d2c7](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5d2c7178a0b392a) Lisa Wedin)  
-  display checkboxes ([b4119](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b411945855f41b8) Lisa Wedin)  
-  rmoves component with save buttons from portal ([10516](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/10516bc5e04f947) Lisa Wedin)  
-  minor styling, changing comments ([e7a0a](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e7a0a4615dcd80a) Lisa Wedin)  
-  forgot router index file in PR ([d89c2](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d89c2b581013fdb) Lisa Wedin)  
-  merge stuff ([6d53e](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/6d53e7b3bc85e1c) Lisa Wedin)  

### Dependency updates

- add renovate.json ([c1964](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/c1964adfc0ac43d) renovate[bot])  
### Other changes

**wip**


[b6520](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b6520cf98e9229c) Lisa Wedin *2025-12-23 10:15:47*

**Merge branch 'feat/215-klarmarkera-uppgifter' of https://github.com/Forsakringskassan/rimfrost-fe-handlaggare into feat/215-klarmarkera-uppgifter**


[ff696](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/ff696b68b8cc678) Lisa Wedin *2025-12-19 12:40:07*

**wip**


[b3dfb](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/b3dfbb0aa153b82) Lisa Wedin *2025-12-19 12:39:43*

**wip**


[53e8b](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/53e8b87715827a9) Lisa *2025-12-18 13:51:15*

**push test**


[32e8c](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/32e8c0391357832) Lisa *2025-12-17 12:27:09*

**wip**


[d1942](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/d1942d60a54a9ac) Lisa Wedin *2025-12-17 07:13:26*

**merging**


[37332](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/37332ef2caadd86) Lisa Wedin *2025-12-16 12:17:36*

**wip**


[bd486](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/bd4860fac467654) Lisa Wedin *2025-12-16 07:05:18*

**wip**


[3858b](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/3858b8f7e29394f) Lisa Wedin *2025-12-15 12:27:22*

**Merge branch 'development' into feat/210-koppla-fe-be**


[5b65c](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/5b65c9c0748ad40) Lisa Wedin *2025-12-09 14:39:53*

**Adds left side navigation list, route given title and id on middle field on item press, updates mock data and adds some utils**


[fb180](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/fb180c70af55b0a) Lisa Wedin *2025-11-12 17:07:41*

**Add Figma design file link to README**

* Added link to Figma design file for reference. 

[e591c](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/e591c619542ce3f) LisaWedin-Ductus *2025-11-10 13:56:20*

**initial commit with crude fe start**


[ea4e5](https://github.com/Forsakringskassan/rimfrost-portal-handlaggare/commit/ea4e50b43dd487e) Lisa Wedin *2025-11-10 13:29:35*


