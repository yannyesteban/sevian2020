<?php

trigger_error("No se puede dividir por cero", E_USER_WARNING);

echo 5;
/*
 * 
 * opcode number: 108
 */
try {
    $error = 'Always throw this error';
    throw new Exception($error);

    // Code following an exception is not executed.
    echo 'Never executed';

} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

// Continue execution
echo 'Hello World';
?> 