#!/usr/bin/env bash

git config user.name "keixiv"
git config user.email "keixiv@users.noreply.github.com"
git config commit.gpgsign false
git config core.sshcommand "ssh -i /stuff/secrets/git-ssh-key-keixiv"
git config tag.gpgsign false
git config user.signingkey ""

ssh-add /stuff/secrets/git-ssh-key-keixiv
