#!/bin/bash
set -x

# A bash script to remove old versions of a Google App Engine instance.
# From https://gist.github.com/vonNiklasson/b9d3c64ec8beb6a13a42e647012d4815
#
# Inspiration of script taken from:
# https://almcc.me/blog/2017/05/04/removing-older-versions-on-google-app-engine/
# Original code by Alastair McClelland and Marty Číž.
# Assembled and modified by Johan Niklasson.
#
# To run this script, execute
# sh remove_old_gcloud_versions.sh <instance> <versions to keep>
# where <instance> is the instance type to filter (usuaylly default)
# and <versions to keep> is the number of versions to keep.

# The name of the project to delete versions from.
PROJECT=$1
# The type of instance to filter on (usually default)
INSTANCE_TYPE=$2
# How many versions to keep, and throw away the rest
VERSIONS_TO_KEEP=$(($3 + 1))

# If you run a flexible environment, run this script instead as it will make sure that the instances are stopped before trying to remove them
#VERSIONS=$(gcloud app versions list --project $PROJECT --service $INSTANCE_TYPE --sort-by '~version' --filter="version.servingStatus='STOPPED'" --format 'value(version.id)' | sort -r | tail -n +$VERSIONS_TO_KEEP | paste -sd " " -)
# If you run the standard environment, you can't stop services and will always get an empty result if you run the command above.
VERSIONS=($(gcloud app versions list --project $PROJECT --service $INSTANCE_TYPE --sort-by '~version' --format 'value(version.id)' | sort -r | tail -n +$VERSIONS_TO_KEEP | paste -sd " " -))

# Don't try to delete old versions if there were no from the filtering.
if [ ${#VERSIONS[*]} -gt 0 ]
then
    # If you want to confirm before deletion, remove the -q
    gcloud app versions delete --project $PROJECT --service $INSTANCE_TYPE ${VERSIONS[*]} -q
fi
