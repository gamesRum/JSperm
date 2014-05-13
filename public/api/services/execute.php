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
					ob_flush();

					if ($entry != "." && $entry != ".." && $entry != '.DS_Store') {
						$fileName = $projectDirectory.$entry;
						ob_clean();
						ob_start();
						passthru("/usr/bin/time -l /usr/local/bin/node $fileName 2>&1", $exitCode);

						$result['response'][$entry]['output'] = htmlentities(ob_get_clean());
						$result['response'][$entry]['exit'] = $exitCode;
						$result['response'][$entry]['memory'] = 0;
						$result['response'][$entry]['cpu'] = 0;
						$result['response'][$entry]['time'] = 0;
					}
				}

				closedir($handle);
				$result['name'] = $projectName;
				$result['message'] = 'Files executed!';
				$result['status'] = true;
			} else {
				$result['message'] = 'Project not found!';
			}
		}
	} else {
		$result['message'] = 'No project specified!';
	}