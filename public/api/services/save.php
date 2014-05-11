<?php
	$result['status'] = false;
	$result['message'] = 'Unknown error!';

	$projectName = isset($_POST['project'])?$_POST['project']:null;
	$files = isset($_POST['files'])?$_POST['files']:null;

	if($files && $projectName) {
		$projectDirectory = $sandboxDirectory.$projectName.'/';
		$directoryExists = false;


		if (!file_exists($projectDirectory)) {
			mkdir($projectDirectory, 0777);
		}

		if (file_exists($projectDirectory)) {
			$directoryExists = true;
		}

		if($directoryExists) {
			foreach ($files as $file => $content) {
				$filePath = $projectDirectory.$file;

				file_put_contents($filePath, $content);
			}

			$result['status'] = true;
			$result['message'] = 'Saved!';
		} else {
			$result['message'] = 'Cannot create project folder!';
		}

	} else {
		$result['message'] = 'No files specified!';
	}