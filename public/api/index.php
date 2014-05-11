<?php
	$service = isset($_GET['service'])?$_GET['service']:null;
	$serviceFile = 'services/'.$service.'.php';
	$sandboxDirectory = '../../sandbox/';
	$result = [
			'status'  => false,
			'message' => 'ERROR: invalid call!'
		];

	if(file_exists($serviceFile)) {
		include($serviceFile);
	} else {
		$result['status'] = 'ERROR: service not found! ['.$service.']';
	}

	header('Content-type: application/json');
	echo json_encode($result);
?>