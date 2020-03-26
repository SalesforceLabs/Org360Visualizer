#!/bin/bash

# print message function
printMsg() {
  echo ""
  date +"%T $*"
}

createPackagingFolder() {
  if [ ! -d "./packaging/" ] 
  then
    mkdir "./packaging/"
  fi
}

clearCorePackageFolders () {
  printMsg "Removing Core Package Folder"
  find "./packaging/core-package/" -exec rm -rf {} \;

  if [ $? -gt 0 ]
  then
    printMsg "Creating Core Package Folder"
    sleep 3s
    mkdir "./packaging/core-package/"
  fi
}

clearAuthPackageFolders () {
  printMsg "Removing Auth Package Folder"
  find "./packaging/auth-package/" -exec rm -rf {} \;

  if [ $? -gt 0 ]
  then
    printMsg "Creating Auth Package Folder"
    sleep 3s
    mkdir "./packaging/auth-package/"
  fi
}


copyCorePackageFolders () {
  printMsg "Copying Files for Core Packaging"
  DIR="./packaging/core-package/"
  ROOT="./force-app/main/default"

  cp -R $ROOT/classes $ROOT/lwc $DIR

  printMsg "Copying Files for Core Package has Completed"
}

copyAuthPackageFolders () {
  printMsg "Copying Files for Auth Packaging"
  DIR="./packaging/auth-package/"
  ROOT="./force-app/main/default"

  cp -R $ROOT/authproviders $ROOT/namedCredentials $DIR

  printMsg "Copying Files for Auth Package has Completed"
}

createPackagingFolder
clearCorePackageFolders
copyCorePackageFolders
clearAuthPackageFolders
copyAuthPackageFolders