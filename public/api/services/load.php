<?php
	$result['message'] = 'Unknown error!';

	$userName = isset($_POST['username'])?$_POST['username']:null;
	$projectName = isset($_POST['project'])?$_POST['project']:null;

	if($projectName) {
		$projectDirectory = $sandboxDirectory.$userName.'/'.$projectName.'/';
		$directoryExists = false;

		if (!file_exists($projectDirectory)) {
			$result['message'] = 'Project not found!';
		} else {
			if ($handle = opendir($projectDirectory)) {
				while (false !== ($entry = readdir($handle))) {
					if ($entry != "." && $entry != "..") {
						$fileName = $projectDirectory.$entry;
						$result['files'][$entry] = file_get_contents($fileName);
					}
				}

				closedir($handle);
				$result['name'] = $projectName;
				$result['message'] = 'Files loaded!';
				$result['status'] = true;
			} else {
				$result['message'] = 'Project not found!';
			}
		}
	} else {
		$result['message'] = 'No project specified!';
	}