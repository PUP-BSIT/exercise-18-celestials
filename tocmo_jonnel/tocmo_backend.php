<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "127.0.0.1:3306";
$username = "u220855403_celestials";
$password = "C3lestials!";
$dbname = "u220855403_ex_18";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $teamName = $data->teamName;
    $coach = $data->coach;
    $country = $data->country;

    $sql = "INSERT INTO teams (teamName, coach, country) VALUES ('$teamName', '$coach', '$country')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Team added successfully"]);
    } else {
        echo json_encode(["error" => "Error adding team: " . $conn->error]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM teams";
    $result = $conn->query($sql);

    $teams = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $teams[] = [
                "id" => $row["id"],
                "teamName" => $row["teamName"],
                "coach" => $row["coach"],
                "country" => $row["country"],
                "wins" => $row["wins"]
            ];
        }
    }

    echo json_encode($teams);
}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    parse_str(file_get_contents("php://input"), $data);

    $teamId = $data['id'];
    $newWins = $data['wins'];

    $sql = "UPDATE teams SET wins = $newWins WHERE id = $teamId";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Team wins updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating team wins: " . $conn->error]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $teamId = $_GET['id'];

    $sql = "DELETE FROM teams WHERE id = $teamId";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Team deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting team: " . $conn->error]);
    }
}

$conn->close();

?>
