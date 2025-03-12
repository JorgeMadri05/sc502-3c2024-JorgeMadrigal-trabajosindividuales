<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titule</title>
    <link rel="stylesheet" href="css/styles.css">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        <h1>Registro de Transacciones</h1>
    </header>
    <div class="botones">
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#transaccionmodal">Transacción</button>
    <form action="" method="POST" style="display:inline;">
        <button type="submit" name="generar_txt" class="btn btn-success">Generar Estado de Cuenta en TXT</button>
    </form>
    </div>
    <!-- Abrir ventana Modal -->
    <div class="modal fade" id="transaccionmodal" tabindex="-1" aria-labelledby="transaccionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <h1 class="modal-header">Transacciones</h1>
                    <div class="modal-body">
                        <form id="comentario-form" action="" method="POST">
                            <div class="mb-3">
                            <label for="monto-trans">Monto a ingresar</label>
                            <input type="number" class="form-control" id="monto-trans" name="monto" required>
                            </div>
                            <div class="mb-3">
                            <label for="descripcion-trans">Descripción</label>
                            <textarea class="form-control" id="descripcion-trans" name="descripcion" required></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>    
                        </form>    
                    </div>
                </div>
            </div>
        </div>
    </div>


    <?php
    session_start(); 

    //Crear el arreglo transacciones en coso de que no haya sido generado
    if (!isset($_SESSION['transacciones'])) {
        $_SESSION['transacciones'] = [];
    }
    $transacciones = $_SESSION['transacciones'];


    // Verificar que los datos fueron incluidos
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_POST['monto']) && isset($_POST['descripcion'])) {
            $monto = $_POST['monto'];
            $descripcion = $_POST['descripcion'];

            // Incrementar los id de las transacciones 
            if (empty($transacciones)) {
                $nuevoid = 1;
            } else {
                $incrementar_id = end($transacciones)['id'];
                $nuevoid = $incrementar_id + 1;
            }

            $nueva_transaccion = [
                'id' => $nuevoid,
                'monto' => $monto,
                'descripcion' => $descripcion
            ];

            // Guardar inforomacion en el arreglo
            $transacciones[] = $nueva_transaccion;
            $_SESSION['transacciones'] = $transacciones;

        // Eliminar las transacciones apartir de su id
        } elseif (isset($_POST['eliminar_id'])) {
            $eliminar_id = $_POST['eliminar_id'];
            foreach ($transacciones as $key => $transaccion) {
                if ($transaccion['id'] == $eliminar_id) {
                    unset($transacciones[$key]);
                    break;
                }
            }
            // Actualiza la lista transacciones
            $transacciones = array_values($transacciones);
            $_SESSION['transacciones'] = $transacciones;

        // Boton para generar el txt
        } elseif (isset($_POST['generar_txt'])) {
            echo "<p>El archivo se encuentra en: " . realpath("EstadoCuenta.txt") . "</p>";
            generartxt($transacciones);
        }
    }

    // Informacion que se imprime 
    function generarEstadoDeCuenta($transacciones) {
        $suma_Total = 0;
        foreach($transacciones as $transaccion) {
            $suma_Total += $transaccion['monto'];
        }
        $interes = $suma_Total * 0.026;
        $cashback = $suma_Total * 0.001;
        $monto_final = $suma_Total + $interes - $cashback;

        echo "<h2 class='mt-4'>Estado de Cuenta</h2>";

        echo "<table class='table table-striped table-bordered'>";
        echo "<thead class='table-dark'>";
        echo "<tr>";
        echo "<th>ID</th>";
        echo " <th>Descripción</th>";
        echo " <th>Monto</th>";
        echo " <th>Acciones</th>";
        echo "</tr>";
        echo "</thead>";
        echo "<tbody>";

        foreach ($transacciones as $transaccion) {
            echo "<tr>";
            echo "<td>{$transaccion['id']}</td>";
            echo "<td>{$transaccion['descripcion']}</td>";
            echo "<td>{$transaccion['monto']}</td>";
            echo "<td>";
            echo "<form action='' method='POST' style='display:inline;'>";
            echo "<input type='hidden' name='eliminar_id' value='{$transaccion['id']}'>";
            echo "<button type='submit' class='btn btn-danger btn-sm'>Eliminar</button>";
            echo "</form>";
            echo "</td>";
            echo "</tr>";
        }
        echo "</tbody>";
        echo "</table>";
        echo "<div class='mt-3 p-3 text-center border rounded bg-light '>";
        echo "<p><strong>Monto Total de Contado:</strong> $suma_Total</p>";
        echo "<p><strong>Monto Total con Intereses:</strong> " . ($suma_Total + $interes) . "</p>";
        echo "<p><strong>Cashback:</strong> $cashback</p>";
        echo "<p><strong>Monto Final a Pagar:</strong> $monto_final</p>";
        echo "</div>";

    }

    // Informacion q se agrega en el txt
    function generartxt($transacciones) {
        $suma_Total = 0;
        foreach($transacciones as $transaccion) {
            $suma_Total += $transaccion['monto'];
        }
        $interes = $suma_Total * 0.026;
        $cashback = $suma_Total * 0.001;
        $monto_final = $suma_Total + $interes - $cashback;

        $informacion = "Estado de Cuenta\n";
        $informacion .= "------------------------\n";
        foreach($transacciones as $transaccion) {
            $informacion .= "ID: {$transaccion['id']}\n";
            $informacion .= "Monto: {$transaccion['monto']}\n";
            $informacion .= "Descripcion: {$transaccion['descripcion']}\n";
            $informacion .= "------------------------\n";
        }
        $informacion .= "Monto total de contado: $suma_Total\n";
        $informacion .= "Monto total de interes: $interes\n";
        $informacion .= "Cashback: $cashback\n";
        $informacion .= "Monto Final: $monto_final\n";

        file_put_contents("EstadoCuenta.txt", $informacion); 
    }

    generarEstadoDeCuenta($transacciones);
    ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>