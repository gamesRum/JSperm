<?php
	$result['message'] = 'Unknown error!';

	$username = isset($_POST['username'])?$_POST['username']:null;
	$password = isset($_POST['password'])?$_POST['password']:null;

	if($username && $password) {
		$userDirectory = $sandboxDirectory.$username.'/';
		$userProfile = $userDirectory.'/profile.json';

		if (!file_exists($userDirectory)) {
			$result['message'] = 'User not found!';
		} else {
			if(!file_exists($userProfile)) {
				$result['message'] = 'User profile not found!';
			} else {
				$profile = json_decode(file_get_contents($userProfile));

				if($profile->hash == hash('sha512', $password)) {
					$projectsList = array();

					if ($handle = opendir($userDirectory)) {
						while (false !== ($entry = readdir($handle))) {
							if ($entry != "." && $entry != ".." && is_dir($userDirectory.$entry)) {
								array_push($projectsList, $entry);
							}
						}

						closedir($handle);
					} else {
						$result['message'] = 'No projects found!';
					}

					$result['name'] = $profile->name;
					$result['github'] = $profile->github;
					$result['email'] = $profile->email;
					$result['avatar'] = 'http://www.gravatar.com/avatar/'.md5($profile->email);
					$result['description'] = $profile->description;
					$result['status'] = true;
					$result['projects'] = $projectsList;
					$result['message'] = 'Profile loaded!';
				} else {
					$result['message'] = 'Password mismatch!';
				}
			}
		}
	} else {
		$result['message'] = 'No project specified!';
	}