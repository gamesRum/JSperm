<?php
	$service = isset($_GET['service'])?$_GET['service']:null;
	$serviceFile = 'services/'.$service.'.php';
	$sandboxDirectory = '../../sandbox/';
	$result = [
			'status'  => false,
			'message' => 'Invalid call!'
		];

	if(file_exists($serviceFile)) {
		include($serviceFile);
	} else {
		$result['message'] = 'service not found! ['.$service.']';
	}

	header('Content-type: application/json');
	echo json_encode($result);
?>