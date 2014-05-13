<?php
	$result['message'] = 'Unknown error!';

	$newusername = isset($_POST['newusername'])?$_POST['newusername']:null;
	$newpassword = isset($_POST['newpassword'])?$_POST['newpassword']:null;
	$newemail = isset($_POST['newemail'])?$_POST['newemail']:null;
	$newname = isset($_POST['newname'])?$_POST['newname']:null;
	$newdescription = isset($_POST['newdescription'])?$_POST['newdescription']:null;

	if($newusername && $newpassword && $newemail && $newname) {
		$userDirectory = $sandboxDirectory.$newusername.'/';
		$userProfile = $userDirectory.'/profile.json';

		if (file_exists($userDirectory)) {
			$result['message'] = 'User already exists!';
		} else {
			mkdir($userDirectory);
			$profile = array();

			$profile['name'] = $newname;
			$profile['hash'] = hash('sha512', $newpassword);
			$profile['github'] = '';
			$profile['email'] = $newemail;
			$profile['description'] = $newdescription;

			if(file_put_contents($userProfile, json_encode($profile))){
				$result['status'] = true;
				$result['message'] = 'Profile saved!';
			} else {
				$result['message'] = 'Cannot save profile!';
			}
		}
	} else {
		$result['message'] = 'No project specified!';
	}