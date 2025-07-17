<?php 

// Enable CORS for frontend access (local or otherwise)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");

session_start();
require 'config.php';
header('Content-Type: application/json');

// Optional: Uncomment this block for session-based authentication
// if (!isset($_SESSION['admin_user'])) {
//     echo json_encode(["status" => false, "message" => "Unauthorized"]);
//     exit;
// }

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $today = date('Y-m-d');
    $month = date('m');
    $year = date('Y');

    // === Summary Box Queries ===

    // 1. Total wage expense (monthly)
    $wageSql = "SELECT SUM(final_salary) AS total FROM salary WHERE MONTH(generated_at) = $month AND YEAR(generated_at) = $year";
    $wages = $conn->query($wageSql)->fetch_assoc()['total'] ?? 0;

    // 2. Total working hours (monthly)
    $hoursSql = "SELECT SUM(hours_worked) AS total FROM attendance WHERE MONTH(date) = $month AND YEAR(date) = $year";
    $hours = $conn->query($hoursSql)->fetch_assoc()['total'] ?? 0;

    // 3. Today's wage expense
    $wageTodaySql = "SELECT SUM(final_salary) AS total FROM salary WHERE DATE(generated_at) = '$today'";
    $wageToday = $conn->query($wageTodaySql)->fetch_assoc()['total'] ?? 0;

    // 4. Total advance paid (monthly)
    $advSql = "SELECT SUM(amount) AS total FROM advances WHERE MONTH(date) = $month AND YEAR(date) = $year";
    $advances = $conn->query($advSql)->fetch_assoc()['total'] ?? 0;

    // 5. Advance paid today
    $advTodaySql = "SELECT SUM(amount) AS total FROM advances WHERE DATE(date) = '$today'";
    $advToday = $conn->query($advTodaySql)->fetch_assoc()['total'] ?? 0;

    // 6. Active labour count
    $activeSql = "SELECT COUNT(*) AS total FROM labours WHERE is_active = 1";
    $active = $conn->query($activeSql)->fetch_assoc()['total'] ?? 0;

    // === Per-Labour Summary (monthly) ===

    $labourSql = "
    SELECT 
        l.id AS labour_id,
        l.name,
        IFNULL(a.hours_worked, 0) AS total_hours,
        IFNULL(s.total_salary, 0) AS total_salary,
        IFNULL(v.total_advance, 0) AS total_advance,
        s.last_paid
    FROM labours l
    LEFT JOIN (
        SELECT labour_id, SUM(hours_worked) AS hours_worked
        FROM attendance
        WHERE MONTH(date) = $month AND YEAR(date) = $year
        GROUP BY labour_id
    ) a ON l.id = a.labour_id
    LEFT JOIN (
        SELECT labour_id, SUM(final_salary) AS total_salary, MAX(generated_at) AS last_paid
        FROM salary
        WHERE MONTH(generated_at) = $month AND YEAR(generated_at) = $year
        GROUP BY labour_id
    ) s ON l.id = s.labour_id
    LEFT JOIN (
        SELECT labour_id, SUM(amount) AS total_advance
        FROM advances
        WHERE MONTH(date) = $month AND YEAR(date) = $year
        GROUP BY labour_id
    ) v ON l.id = v.labour_id
    WHERE l.is_active = 1
    ORDER BY l.name ASC
    ";

    $res = $conn->query($labourSql);
    $labour_summary = [];

    while ($row = $res->fetch_assoc()) {
        $labour_summary[] = [
            "labour_id" => $row["labour_id"],
            "name" => $row["name"],
            "total_hours" => round($row["total_hours"], 2),
            "total_salary" => number_format((float)$row["total_salary"], 2),
            "total_advance" => number_format((float)$row["total_advance"], 2),
            "last_paid" => $row["last_paid"]
        ];
    }

    // ✅ Final Response
    echo json_encode([
        "status" => true,
        "summary" => [
            "total_wage_expense" => number_format((float)$wages, 2),
            "total_working_hours" => round((float)$hours, 2),
            "wage_today" => number_format((float)$wageToday, 2),
            "total_advance" => number_format((float)$advances, 2),
            "advance_today" => number_format((float)$advToday, 2),
            "active_labours" => (int)$active
        ],
        "labours" => $labour_summary
    ]);
}

?>

