lab=$1
gitlab_hostname=$4
admin_key=$5
start_time=$2 #`date -d "$2" +"%s"`
end_time=$3 #`date -d "$3" +"%s"`
echo "$start_time      $end_time"

rm -f user_commits.txt

# Get the backups of all the labs
cd ..
bash get_submissions.sh $lab $4
cd reval
echo "$lab" >> user_commits.txt
number_users=`cat ../userList| wc -l`
echo "$number_users" >> user_commits.txt
while read id
do
	user_score=0


	cd ../lab_backups/$lab/$id  2> /dev/null

	if [ $? -eq 0 ]; then
	git checkout master 	> /dev/null						 #Point the head to the latest commit
	number_commits=$(git log --since "$start_time" --until "$end_time"  --format="%H" 2>/dev/null | wc -l)
	echo "$id" >> ../../../reval/user_commits.txt
	echo "$number_commits"
	echo  "$number_commits" >> ../../../reval/user_commits.txt
	git log --since "$start_time"  --until "$end_time" --format="%H" 2>/dev/null
	(git log --since "$start_time"  --until "$end_time" --format="%H" 2>/dev/null) >> ../../../reval/user_commits.txt

	cd ../../../reval
	fi
done < ../userList

ADMIN_KEY=$admin_key nodejs submit.js
