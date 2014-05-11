<?php
	$result['message'] = 'Unknown error!';

	$projectName = isset($_POST['project'])?$_POST['project']:null;

	if($projectName) {
		$projectDirectory = $sandboxDirectory.$projectName.'/';
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