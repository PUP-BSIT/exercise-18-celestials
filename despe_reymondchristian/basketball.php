<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

// Establishes the database connection
$host = "127.0.0.1:3306";
$username = "u220855403_celestials";
$password = "C3lestials!";
$database = "u220855403_ex_18";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $playerId = mysqli_real_escape_string($conn, $_GET['id']);
            $sql = "SELECT * FROM players_table WHERE id = $playerId";
        } else {
            $sql = "SELECT * FROM players_table";
        }

        $result = $conn->query($sql);

        $playerList = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $playerList[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($playerList);
        break;

    case 'POST':
        $player_name = 
        mysqli_real_escape_string($conn, $_POST['player_name']);
        $team_name = 
        mysqli_real_escape_string($conn, $_POST['team_name']);
        $player_position = 
        mysqli_real_escape_string($conn, $_POST['player_position']);
        $player_age = 
        mysqli_real_escape_string($conn, $_POST['player_age']);

        $sql = "INSERT INTO players_table 
        (player_name, team_name, player_position, player_age) 
                VALUES 
        ('$player_name', '$team_name', '$player_position', '$player_age')";

        if ($conn->query($sql) === TRUE) {
            echo "Player added to the list successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $playerId = isset($patchVars['id']) ? 
        mysqli_real_escape_string($conn, $patchVars['id']) : null;

        if ($playerId !== null) {
            $player_name = 
            mysqli_real_escape_string($conn, $patchVars['player_name']);
            $team_name = 
            mysqli_real_escape_string($conn, $patchVars['team_name']);
            $player_position =
            mysqli_real_escape_string($conn, $patchVars['player_position']);
            $player_age = 
            mysqli_real_escape_string($conn, $patchVars['player_age']);

            $stmt = $conn->prepare("UPDATE players_table 
                                   SET player_name=?, team_name=?, 
                                   player_position=?, player_age=? 
                                   WHERE id=?");

            $stmt->bind_param("ssssi", $player_name, $team_name, 
            $player_position, $player_age, $playerId);

            if ($stmt->execute()) {
                echo "Player details updated successfully!";
            } else {
                echo "Error updating player list: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Error: Player ID is missing.";
        }

        break;

    case 'DELETE':
        $playerId = 
        isset($_GET['id']) ? mysqli_real_escape_string
        ($conn, $_GET['id']) : null;

        if ($playerId !== null) {
            $sql = "DELETE FROM players_table WHERE id=$playerId";

            if ($conn->query($sql) === TRUE) {
                echo "Player deleted from the list successfully!";
            } else {
                echo "Error deleting player list: " . $conn->error;
            }
        } else {
            echo "Error: Player ID is missing.";
        }
        break;

    case 'OPTIONS':
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, 
        PATCH, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Origin, 
        Content-Type, X-Auth-Token");
        header('Content-Type: application/json');
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo "Invalid request method";
        break;
}
$conn->close();
?>