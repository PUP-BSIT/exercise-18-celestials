<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

    $host = "127.0.0.1:3306";
    $username = "u220855403_celestials";
    $password = "C3lestials!";
    $database = "u220855403_ex_18";

    $conn = new mysqli($host, $username, $password, $database);

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            $dataKpop = $_POST["kpop"] ?? "";
            $dataMembers = $_POST["members"] ?? "";
            $dataAgency = $_POST["agency"] ?? "";
            $dataFandom = $_POST["fandom"] ?? "";
            $dataBias = $_POST["bias"] ?? "";
    
            $sql = "INSERT INTO kpop_band (
                kpop,
                members,
                agency,
                fandom,
                bias
            ) VALUES (
                '$dataKpop',
                '$dataMembers',
                '$dataAgency',
                '$dataFandom',
                '$dataBias'
            )";

            if (!mysqli_query($conn, $sql)) {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            } else {
                echo "New record created successfully";
            }
            break;

        case 'GET': 
            $sql = 
            "SELECT id, kpop, members, agency, fandom, bias FROM kpop_band";
            $result = mysqli_query($conn, $sql);
            $response = [];

            while($row = mysqli_fetch_assoc($result)) {
                array_push($response, array(
                    'id'=>$row["id"],
                    'kpop'=> $row["kpop"],
                    'members'=> $row["members"],
                    'agency'=> $row["agency"],
                    'fandom'=> $row["fandom"],
                    'bias'=> $row["bias"]
                ));
            }
            echo json_encode($response);
            break;
        
        case 'PATCH':
            parse_str(file_get_contents('php://input'), $_PATCH);
            $dataKpop = $_PATCH["kpop"] ?? "";
            $dataMembers = $_PATCH["members"] ?? ""; 
            $dataAgency = $_PATCH["agency"] ?? "";
            $dataFandom = $_PATCH["fandom"] ?? "";
            $dataBias = $_PATCH["bias"] ?? "";   
            $dataUserId = $_PATCH["id"] ?? "";   
        
            $sql = "UPDATE kpop_band
            SET `kpop`='${dataKpop}', `members`='${dataMembers}',
                `agency`='${dataAgency}', `fandom`='${dataFandom}', 
                `bias`='${dataBias}'
            WHERE `id`='${dataUserId}'";

            if (!mysqli_query($conn, $sql)) {
                echo "Error: " . $sql . " " . mysqli_error($conn);
            } else {
                echo "Updated successfully";
            }
            break;

        case 'DELETE':
            parse_str(file_get_contents('php://input'), $_DELETE);
            $id = $_DELETE["id"] ?? "";  

            $sql = "DELETE FROM kpop_band WHERE id=?";
            $stmt = mysqli_prepare($conn, $sql);

            if ($stmt) {
                mysqli_stmt_bind_param($stmt, "i", $id);
        
                if (mysqli_stmt_execute($stmt)) {
                    echo "Deleted successfully!";
                } else {
                    echo 
                    "Error executing statement: " . mysqli_stmt_error($stmt);
                }
                mysqli_stmt_close($stmt);
            } else {
                echo "Error preparing statement: " . mysqli_error($conn);
            }
            break;

        default:
            echo "Invalid request method";
    }
    mysqli_close($conn);
?>